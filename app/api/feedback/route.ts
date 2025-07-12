import { getFeedback } from "@/handlers/feedback/feedback";
import { getAuthUser } from "@/utils/firebase/firebaseApiContext";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { admin } = await getAuthUser();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    const lastDocId = searchParams.get("lastDocId");
    const lastDocParentId = searchParams.get("lastDocParentId");
    const lastDocCollectionName = searchParams.get("lastDocCollectionName");

    const limit = 10;

    const feedback = await getFeedback({
      lastDocId: lastDocId || "",
      lastDocParentId: lastDocParentId || "",
      lastDocCollectionName: lastDocCollectionName || "",
      limit,
    });

    return NextResponse.json(feedback);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error fetching comments",
        error: String(error),
      },
      { status: 500 }
    );
  }
};
