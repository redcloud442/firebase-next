import { getUsersExport } from "@/handlers/user/user-handler";
import { getAuthUser } from "@/utils/firebase/firebaseApiContext";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { admin } = await getAuthUser();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { limit, nextPageToken } = await req.json();

  const user = await getUsersExport({
    limit,
    nextPageToken,
  });

  return NextResponse.json(user);
};
