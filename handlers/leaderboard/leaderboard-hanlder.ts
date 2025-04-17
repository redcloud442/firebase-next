import firebaseAdmin from "@/utils/firebase/firebaseAdmin";

type LeaderboardType = "QUIZ" | "GAME";

export const getLeaderboardData = async (params: {
  type: LeaderboardType;
  limit: number;
  startAfterKey?: string;
}) => {
  const { type, limit, startAfterKey } = params;

  const userRef = firebaseAdmin.database().ref("users");

  let query = userRef.orderByKey();

  if (startAfterKey) {
    query = query.startAfter(startAfterKey);
  }

  query = query.limitToFirst(limit);

  const snapshot = await query.once("value");

  const leaderboardData: { userName: string; value: number }[] = [];

  snapshot.forEach((child) => {
    const user = child.val();

    const userName = user.User_Information?.name || "Unknown";
    const quizScore = user.Quiz_Info?.correct_answers || 0;
    const cars = Object.keys(user.Game_Info?.Cars || {}).length;
    const motorcycles = Object.keys(user.Game_Info?.Motorcycle || {}).length;
    const vehicleCount = cars + motorcycles;

    leaderboardData.push({
      userName,
      value: type === "QUIZ" ? quizScore : vehicleCount,
    });
  });

  leaderboardData.sort((a, b) => b.value - a.value);

  const totalCount = snapshot.numChildren();

  return { data: leaderboardData, totalCount };
};
