import { getDashboardData } from "@/handlers/dashboard/dashboard-handler";
import { getAuthUser } from "@/utils/firebase/firebaseApiContext";
import { NextResponse } from "next/server";

export async function GET() {
  const { admin } = await getAuthUser();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dashboardData = await getDashboardData();

  console.log(dashboardData);

  return NextResponse.json(dashboardData);
}
