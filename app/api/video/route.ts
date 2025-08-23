import firebaseAdmin from "@/utils/firebase/firebaseAdmin";
import { getAuthUser } from "@/utils/firebase/firebaseApiContext";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { admin } = await getAuthUser();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const firestore = firebaseAdmin.firestore();
  const { searchParams } = new URL(request.url);
  const lessonType = searchParams.get("lessonType");
  const language = searchParams.get("language");

  try {
    const query = firestore
      .collection("video")
      .where("lesson_type", "==", lessonType)
      .where("lessonLanguage", "==", language)
      .where("is_deleted", "==", false)
      .orderBy("createdAt", "desc");

    const [snap, countSnap] = await Promise.all([
      query.get(),
      firestore
        .collection("video")
        .where("lesson_type", "==", lessonType)
        .where("is_deleted", "==", false)
        .where("lessonLanguage", "==", language)
        .count()
        .get(),
    ]);

    const video = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return NextResponse.json({
      message: "Video fetched",
      video,
      totalCount: countSnap.data().count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching quiz", error: String(error) },
      { status: 500 }
    );
  }
}
