import { getLeaderboardData } from "@/handlers/leaderboard/leaderboard-handler";
import { getAuthUser } from "@/utils/firebase/firebaseApiContext";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { admin } = await getAuthUser();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { type } = await request.json();

  const leaderboardData = await getLeaderboardData({
    type,
  });

  return NextResponse.json(leaderboardData);
}
