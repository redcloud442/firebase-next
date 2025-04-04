import { getAccountHistory } from "@/handlers/user/user-handler";
import { getAuthUser } from "@/utils/firebase/firebaseApiContext";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { admin, uid } = await getAuthUser();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "10";
  const page = searchParams.get("page") || "1";

  const history = await getAccountHistory({
    limit: parseInt(limit),
    page: parseInt(page),
    uid,
  });

  return NextResponse.json(history);
};
