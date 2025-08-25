import firebaseAdmin from "@/utils/firebase/firebaseAdmin";

type FeedbackDoc = {
  CorrectAnswers?: number | string;
  DateTime?: string; // e.g. "8/15/2025 10:50:08 PM"
  Email?: string;
  Name?: string;
  secondsConsumed?: number | string;
  secondsRemaining?: number | string;
  totalQuizSeconds?: number | string;
  TotalItems: number; // now dynamic per attempt
};

type ProgressDoc = {
  ProgressDict: Record<string, { CurrentStars: number }>;
};

const toNumber = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// very forgiving date parse
const toDate = (v?: string): Date | null => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

const median = (nums: number[]) => {
  if (!nums.length) return 0;
  const a = [...nums].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
};

export const getDashboardData = async () => {
  const firestore = firebaseAdmin.firestore();
  const fastExitThresholdSec = 30; // "bounced" attempts
  const daysForTrend = 7;

  const [userList, userFeedbacksSnap, progressDocsSnap] = await Promise.all([
    firebaseAdmin.auth().listUsers(),
    firestore.collectionGroup("user_feedbacks").get(),
    firestore.collectionGroup("progress").get(),
  ]);

  // ===== Basic aggregates =====
  const totalUsers = userList.users.length;

  const feedbacks: FeedbackDoc[] = userFeedbacksSnap.docs.map(
    (d) => d.data() as FeedbackDoc
  );
  const quizAttemptCount = feedbacks.length;

  const progressDocs = progressDocsSnap.docs.map(
    (d) => d.data() as ProgressDoc
  );
  const activePlayers = progressDocs.length;

  // ===== Score aggregates (dynamic totals) =====
  const scores = feedbacks.map((f) => toNumber(f.CorrectAnswers));
  const totals = feedbacks.map((f) => Math.max(1, toNumber(f.TotalItems, 1)));

  const sum = (arr: number[]) =>
    arr.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

  const totalCorrect = sum(scores);
  const totalPossible = sum(totals);

  const averageQuizScore = quizAttemptCount
    ? totalCorrect / quizAttemptCount // avg correct answers (raw count)
    : 0;

  const averageAccuracyPercent = totalPossible
    ? (totalCorrect / totalPossible) * 100
    : 0;

  const successRate = averageAccuracyPercent; // alias, kept for backwards compat
  // --- Raw-score buckets that adapt to the largest quiz length ---
  const maxItems = Math.max(...totals, 1);
  const makeRawBuckets = (maxItems: number, bins = 4) => {
    const size = Math.ceil((maxItems + 1) / bins); // +1 so we include 0
    const buckets: Record<string, number> = {};
    let start = 0;
    for (let i = 0; i < bins; i++) {
      const end = Math.min(maxItems, start + size - 1);
      buckets[`${start}-${end}`] = 0;
      start = end + 1;
      if (start > maxItems) break;
    }
    return buckets;
  };

  const scoreBucketsRaw = makeRawBuckets(maxItems, 4);
  for (const s of scores) {
    for (const range of Object.keys(scoreBucketsRaw)) {
      const [low, high] = range.split("-").map(Number);
      if (s >= low && s <= high) {
        scoreBucketsRaw[range]++;
        break;
      }
    }
  }

  // Top performers (by accuracy%, then time, then total correct)
  const withTime = feedbacks.map((f, i) => {
    const correct = toNumber(f.CorrectAnswers, 0);
    const items = totals[i];
    const accuracy = items ? (correct / items) * 100 : 0;
    return {
      name: f.Name ?? "",
      email: f.Email ?? "",
      score: correct,
      totalItems: items,
      accuracyPercent: accuracy,
      secondsConsumed: toNumber(f.secondsConsumed),
    };
  });

  const topPerformers = withTime
    .filter((x) => Number.isFinite(x.accuracyPercent))
    .sort(
      (a, b) =>
        b.accuracyPercent - a.accuracyPercent ||
        a.secondsConsumed - b.secondsConsumed ||
        b.score - a.score
    )
    .slice(0, 5);

  // ===== Time analytics =====
  const secondsConsumed = feedbacks.map((f) => toNumber(f.secondsConsumed));
  const secondsRemaining = feedbacks.map((f) => toNumber(f.secondsRemaining));

  const avgSecondsConsumed = quizAttemptCount
    ? sum(secondsConsumed) / quizAttemptCount
    : 0;
  const medianSecondsConsumed = median(secondsConsumed);
  const avgSecondsRemaining = quizAttemptCount
    ? sum(secondsRemaining) / quizAttemptCount
    : 0;

  // average of per-attempt (seconds / totalItems)
  const perAttemptTimePerQ = feedbacks.map((f, i) => {
    const sec = toNumber(f.secondsConsumed);
    const items = totals[i];
    return items > 0 ? sec / items : 0;
  });
  const avgTimePerQuestion = perAttemptTimePerQ.length
    ? sum(perAttemptTimePerQ) / perAttemptTimePerQ.length
    : 0;

  // Efficiency: seconds spent per correct answer (per-attempt, then average)
  const secondsPerCorrectEach = feedbacks.map((f) => {
    const sec = toNumber(f.secondsConsumed);
    const correct = Math.max(1, toNumber(f.CorrectAnswers, 0)); // avoid /0
    return sec / correct;
  });
  const avgSecondsPerCorrectAnswer = secondsPerCorrectEach.length
    ? sum(secondsPerCorrectEach) / secondsPerCorrectEach.length
    : 0;

  // Fast exits: consumed < threshold
  const fastExitRate = quizAttemptCount
    ? (secondsConsumed.filter((s) => s > 0 && s < fastExitThresholdSec).length /
        quizAttemptCount) *
      100
    : 0;

  // ===== Trends (last 7 days) =====
  const now = new Date();
  const startWindow = new Date(now);
  startWindow.setDate(now.getDate() - (daysForTrend - 1));
  startWindow.setHours(0, 0, 0, 0);

  const dayKey = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD

  const trendMap: Record<
    string,
    { attempts: number; correctSum: number; totalItemsSum: number }
  > = {};
  for (let i = 0; i < daysForTrend; i++) {
    const d = new Date(startWindow);
    d.setDate(startWindow.getDate() + i);
    trendMap[dayKey(d)] = { attempts: 0, correctSum: 0, totalItemsSum: 0 };
    // initialize all days so charts don't have gaps
  }

  feedbacks.forEach((f, i) => {
    const d = toDate(f.DateTime);
    if (!d) return;
    const k = dayKey(d);
    if (!(k in trendMap)) return;
    const correct = toNumber(f.CorrectAnswers, 0);
    const items = totals[i];
    trendMap[k].attempts += 1;
    trendMap[k].correctSum += correct;
    trendMap[k].totalItemsSum += items;
  });

  const attemptsByDay = Object.entries(trendMap).map(([date, v]) => ({
    date,
    attempts: v.attempts,
  }));

  const avgAccuracyByDay = Object.entries(trendMap).map(([date, v]) => ({
    date,
    // guard against division by 0
    avgAccuracyPercent:
      v.totalItemsSum > 0 ? (v.correctSum / v.totalItemsSum) * 100 : 0,
  }));

  // ===== Stages (unchanged) =====
  const stageStars: Record<string, number> = {};
  for (const doc of progressDocs) {
    const pd = doc?.ProgressDict;
    if (!pd) continue;
    for (const stage in pd) {
      const stars = toNumber(pd[stage]?.CurrentStars);
      stageStars[stage] = (stageStars[stage] ?? 0) + stars;
    }
  }

  const getExtremeStage = (
    obj: Record<string, number>,
    mode: "max" | "min"
  ) => {
    let bestStage = "";
    let bestValue = mode === "max" ? -Infinity : Infinity;
    for (const [stage, val] of Object.entries(obj)) {
      if (
        (mode === "max" && val > bestValue) ||
        (mode === "min" && val < bestValue)
      ) {
        bestValue = val;
        bestStage = stage;
      }
    }
    return {
      stage: bestStage,
      stars: Number.isFinite(bestValue) ? bestValue : 0,
    };
  };

  const most = getExtremeStage(stageStars, "max");
  const least = getExtremeStage(stageStars, "min");

  // ===== Final payload =====
  const engagementRate = totalUsers ? (activePlayers / totalUsers) * 100 : 0;

  // === KPIs / aliases ===
  const avgTimeSpent = avgSecondsConsumed; // alias
  const totalQuizAttempts = quizAttemptCount;

  return {
    // headline
    totalUsers,
    activePlayers,
    engagementRate, // %
    totalQuizAttempts,

    // scoring
    averageQuizScore, // avg correct answers (raw count)
    averageAccuracyPercent, // NEW: avg correctness across attempts (%)
    successRate, // alias of averageAccuracyPercent
    scoreBuckets: scoreBucketsRaw, // percentage-based distribution
    topPerformers, // top 5 {name,email,score,totalItems,accuracyPercent,secondsConsumed}

    // time
    avgSecondsConsumed,
    avgTimeSpent,
    medianSecondsConsumed,
    avgSecondsRemaining,
    avgTimePerQuestion,
    avgSecondsPerCorrectAnswer,
    fastExitRate,

    // trends
    attemptsByDay,
    avgAccuracyByDay, // NEW: % by day

    // stages
    mostCompletedStage: most.stage,
    mostCompletedStageStars: most.stars,
    leastCompletedStage: least.stage,
    leastCompletedStageStars: least.stars,
  };
};
