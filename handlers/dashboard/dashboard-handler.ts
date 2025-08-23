import firebaseAdmin from "@/utils/firebase/firebaseAdmin";

export const getDashboardData = async () => {
  const firestore = firebaseAdmin.firestore();
  const maxScorePerQuiz = 20;

  // Parallel data fetching
  const [userList, userFeedbacksSnap, progressDocsSnap] = await Promise.all([
    firebaseAdmin.auth().listUsers(),
    firestore.collectionGroup("user_feedbacks").get(),
    firestore.collectionGroup("progress").get(),
  ]);

  const totalUsers = userList.users.length;

  const feedbackDocs = userFeedbacksSnap.docs.map((doc) => doc.data());
  const quizAttemptCount = feedbackDocs.length;

  const totalQuizScore = feedbackDocs.reduce((acc, doc) => {
    const score = Number(doc.CorrectAnswers ?? 0);
    return acc + (isNaN(score) ? 0 : score);
  }, 0);

  const progressDocs = progressDocsSnap.docs.map((doc) => doc.data());
  const activePlayers = progressDocs.length;

  const stageStars: Record<string, number> = {};

  for (const doc of progressDocs) {
    const progressDict = doc.ProgressDict;
    if (!progressDict) continue;

    for (const stage in progressDict) {
      const stars = Number(progressDict[stage]?.CurrentStars ?? 0);
      stageStars[stage] = (stageStars[stage] ?? 0) + (isNaN(stars) ? 0 : stars);
    }
  }

  const getExtremeStage = (
    starsObj: Record<string, number>,
    mode: "max" | "min"
  ) => {
    let bestStage = "";
    let bestValue = mode === "max" ? -Infinity : Infinity;

    for (const [stage, stars] of Object.entries(starsObj)) {
      if (
        (mode === "max" && stars > bestValue) ||
        (mode === "min" && stars < bestValue)
      ) {
        bestValue = stars;
        bestStage = stage;
      }
    }

    return { stage: bestStage, stars: bestValue };
  };

  const most = getExtremeStage(stageStars, "max");
  const least = getExtremeStage(stageStars, "min");

  return {
    totalUsers,
    totalQuizAttempts: quizAttemptCount,
    activePlayers,
    successRate:
      quizAttemptCount > 0
        ? (totalQuizScore / (quizAttemptCount * maxScorePerQuiz)) * 100
        : 0,
    averageQuizScore:
      quizAttemptCount > 0 ? totalQuizScore / quizAttemptCount : 0,
    mostCompletedStage: most.stage,
    mostCompletedStageStars: most.stars,
    leastCompletedStage: least.stage,
    leastCompletedStageStars: least.stars,
  };
};
