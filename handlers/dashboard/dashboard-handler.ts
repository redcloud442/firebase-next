import firebaseAdmin from "@/utils/firebase/firebaseAdmin";

type FeedbackDoc = {
  CorrectAnswers?: number | string;
  DateTime?: string; // e.g. "8/15/2025 10:50:08 PM"
  Email?: string;
  Name?: string;
  secondsConsumed?: number | string;
  secondsRemaining?: number | string;
  totalQuizSeconds?: number | string;
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
  const maxScorePerQuiz = 20; // adjust if your quiz length changes
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
    (d) => d.data() as any
  );
  const quizAttemptCount = feedbacks.length;

  const progressDocs = progressDocsSnap.docs.map((d) => d.data() as any);
  const activePlayers = progressDocs.length;

  // ===== Score aggregates =====
  const scores = feedbacks.map((f) => toNumber(f.CorrectAnswers));
  const totalQuizScore = scores.reduce((a, b) => a + b, 0);

  const averageQuizScore = quizAttemptCount
    ? totalQuizScore / quizAttemptCount
    : 0;
  const successRate = quizAttemptCount
    ? (totalQuizScore / (quizAttemptCount * maxScorePerQuiz)) * 100
    : 0;

  // Buckets for quick score distribution (0–5, 6–10, 11–15, 16–20)
  const scoreBuckets = { "0-5": 0, "6-10": 0, "11-15": 0, "16-20": 0 };
  for (const s of scores) {
    if (s <= 5) scoreBuckets["0-5"]++;
    else if (s <= 10) scoreBuckets["6-10"]++;
    else if (s <= 15) scoreBuckets["11-15"]++;
    else scoreBuckets["16-20"]++;
  }

  // Top performers (best score, then fastest time)
  const withTime = feedbacks.map((f) => ({
    name: f.Name ?? "",
    email: f.Email ?? "",
    score: toNumber(f.CorrectAnswers),
    secondsConsumed: toNumber(f.secondsConsumed),
  }));
  const topPerformers = withTime
    .filter((x) => Number.isFinite(x.score))
    .sort((a, b) => b.score - a.score || a.secondsConsumed - b.secondsConsumed)
    .slice(0, 5);

  // ===== Time analytics =====
  const secondsConsumed = feedbacks.map((f) => toNumber(f.secondsConsumed));
  const secondsRemaining = feedbacks.map((f) => toNumber(f.secondsRemaining));
  const totalSeconds = feedbacks.map(
    (f) => toNumber(f.totalQuizSeconds, 0) || 1
  );

  const sum = (arr: number[]) =>
    arr.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

  const avgSecondsConsumed = quizAttemptCount
    ? sum(secondsConsumed) / quizAttemptCount
    : 0;
  const medianSecondsConsumed = median(secondsConsumed);
  const avgSecondsRemaining = quizAttemptCount
    ? sum(secondsRemaining) / quizAttemptCount
    : 0;

  const avgTimePerQuestion = maxScorePerQuiz
    ? avgSecondsConsumed / maxScorePerQuiz
    : 0;

  // Efficiency: seconds spent per correct answer
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

  const trendMap: Record<string, { attempts: number; scoreSum: number }> = {};
  for (let i = 0; i < daysForTrend; i++) {
    const d = new Date(startWindow);
    d.setDate(startWindow.getDate() + i);
    trendMap[dayKey(d)] = { attempts: 0, scoreSum: 0 };
  }

  for (const f of feedbacks) {
    const d = toDate(f.DateTime);
    if (!d) continue;
    const k = dayKey(d);
    if (!(k in trendMap)) continue;
    trendMap[k].attempts += 1;
    trendMap[k].scoreSum += toNumber(f.CorrectAnswers);
  }

  const attemptsByDay = Object.entries(trendMap).map(([date, v]) => ({
    date,
    attempts: v.attempts,
  }));
  const avgScoreByDay = Object.entries(trendMap).map(([date, v]) => ({
    date,
    avgScore: v.attempts ? v.scoreSum / v.attempts : 0,
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

  // === NEW: KPIs you requested ===
  const avgTimeSpent = avgSecondsConsumed; // alias with requested name
  const avgScore = averageQuizScore; // alias with requested name
  const totalQuizAttempts = quizAttemptCount;

  return {
    // headline
    totalUsers,
    activePlayers,
    engagementRate, // %
    totalQuizAttempts, // NEW (alias of quizAttemptCount)

    // scoring
    averageQuizScore, // raw average out of 20
    avgScore, // NEW (alias for convenience)
    successRate, // %
    scoreBuckets, // distribution
    topPerformers, // top 5 {name,email,score,secondsConsumed}

    // time
    avgSecondsConsumed,
    avgTimeSpent,
    medianSecondsConsumed,
    avgSecondsRemaining,
    avgTimePerQuestion,
    avgSecondsPerCorrectAnswer,
    fastExitRate,

    attemptsByDay,
    avgScoreByDay,

    // stages
    mostCompletedStage: most.stage,
    mostCompletedStageStars: most.stars,
    leastCompletedStage: least.stage,
    leastCompletedStageStars: least.stars,
  };
};
