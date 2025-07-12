import firebaseAdmin from "@/utils/firebase/firebaseAdmin";

type LeaderboardType =
  | "Motorcycle Driving Lessons"
  | "Motorcycle Video Lessons"
  | "Car Driving Lessons"
  | "Car Video Lessons"
  | "Road Sign Quiz"
  | "Theoretical Quiz";

const leaderboardFieldMap: Record<LeaderboardType, string> = {
  "Motorcycle Driving Lessons":
    "ProgressDict.Motorcycle Driving Lessons.CurrentStars",
  "Motorcycle Video Lessons":
    "ProgressDict.Motorcycle Video Lessons.CurrentStars",
  "Car Driving Lessons": "ProgressDict.Car Driving Lessons.CurrentStars",
  "Car Video Lessons": "ProgressDict.Car Video Lessons.CurrentStars",
  "Road Sign Quiz": "ProgressDict.Road Sign Quiz.CurrentStars",
  "Theoretical Quiz": "ProgressDict.Theoretical Quiz.CurrentStars",
};

const leaderboardTypeMap: Record<LeaderboardType, string> = {
  "Motorcycle Driving Lessons": "Motorcycle Driving Lessons",
  "Motorcycle Video Lessons": "Motorcycle Video Lessons",
  "Car Driving Lessons": "Car Driving Lessons",
  "Car Video Lessons": "Car Video Lessons",
  "Road Sign Quiz": "Road Sign Quiz",
  "Theoretical Quiz": "Theoretical Quiz",
};
export const getLeaderboardData = async (params: { type: LeaderboardType }) => {
  const { type } = params;
  const fieldPath = leaderboardFieldMap[type];
  const typeMap = leaderboardTypeMap[type];

  if (!fieldPath) {
    throw new Error(`Invalid leaderboard type: ${type}`);
  }

  const query = firebaseAdmin
    .firestore()
    .collection("progress")
    .orderBy(fieldPath, "desc")
    .limit(10);

  const snapshot = await query.get();

  const data = snapshot.docs.map((doc) => ({
    userEmail: doc.id,
    ...doc.data().ProgressDict[typeMap],
  }));

  return {
    data,
    totalCount: data.length,
  };
};
