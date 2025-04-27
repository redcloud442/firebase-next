import firebaseAdmin from "@/utils/firebase/firebaseAdmin";
import { parseDuration } from "@/utils/function";
import { QuizInfo, UserData } from "@/utils/types";

export const getDashboardData = async () => {
  const userRef = firebaseAdmin.database().ref("users");
  const snapshot = await userRef.once("value");

  const users: Record<string, UserData> = snapshot.val() || {};

  let totalUsers = 0;
  let activePlayers = 0;
  let totalQuizAttempts = 0;
  let totalCorrectAnswers = 0;
  let totalQuizScore = 0;
  let quizAttemptCount = 0;
  let totalTimeSpent = 0;
  let quizTotal = 0;

  const gameStageCompletion: Record<string, number> = {};

  Object.values(users).forEach((user) => {
    totalUsers++;

    if (user.Quiz_Info) {
      Object.values(user.Quiz_Info).forEach((quiz) => {
        if (typeof quiz === "object" && quiz !== null) {
          const durationSec = parseDuration(
            (quiz as QuizInfo).duration || "0s"
          ); // default in case missing

          totalQuizAttempts++;
          totalCorrectAnswers +=
            typeof (quiz as QuizInfo).correct_answers === "number"
              ? (quiz as QuizInfo).correct_answers
              : 0;
          totalQuizScore +=
            typeof (quiz as QuizInfo).score === "number"
              ? (quiz as QuizInfo).score
              : 0;
          quizAttemptCount++;
          quizTotal +=
            typeof (quiz as QuizInfo).total_questions === "number"
              ? (quiz as QuizInfo).total_questions
              : 0;
          totalTimeSpent += durationSec;
        }
      });
    }

    if (user.Game_Info) {
      let userActive = false;

      Object.entries(user.Game_Info).forEach(([category, games]) => {
        Object.entries(games).forEach(([game, gameData]) => {
          const durationSec = parseDuration(gameData.duration || "0s");
          totalTimeSpent += durationSec;

          const key = `${category}/${game}`;
          gameStageCompletion[key] = (gameStageCompletion[key] || 0) + 1;

          if (
            ["started", "in_progress", "completed"].includes(
              gameData.status || ""
            )
          ) {
            userActive = true;
          }
        });
      });

      if (userActive) {
        activePlayers++;
      }
    }
  });

  const sortedStages = Object.entries(gameStageCompletion).sort(
    (a, b) => b[1] - a[1]
  );

  const mostCompletedStage = sortedStages[0]?.[0] || "N/A";
  const leastCompletedStage = sortedStages.at(-1)?.[0] || "N/A";
  console.log(totalQuizAttempts, quizTotal, totalCorrectAnswers);
  return {
    totalUsers,
    activePlayers,
    totalQuizAttempts,
    successRate:
      totalQuizAttempts > 0 && quizTotal > 0
        ? (totalCorrectAnswers / quizTotal) * 100
        : 0,
    averageQuizScore:
      quizAttemptCount > 0 ? totalQuizScore / quizAttemptCount : 0,
    mostCompletedStage,
    leastCompletedStage,
    averageTimeSpent: totalUsers > 0 ? totalTimeSpent / (totalUsers * 60) : 0,
  };
};
