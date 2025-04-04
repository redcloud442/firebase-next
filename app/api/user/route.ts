import { getAdminUsers } from "@/handlers/user/user-handler";
import { getAuthUser } from "@/utils/firebase/firebaseApiContext";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { admin } = await getAuthUser();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "10";
  const search = searchParams.get("search") || "";
  const nextPageToken = searchParams.get("nextPageToken") || undefined;

  const users = await getAdminUsers({
    limit: parseInt(limit),
    nextPageToken,
    search,
  });

  return NextResponse.json(users);
};
