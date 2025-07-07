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
  const category = searchParams.get("category");
  const language = searchParams.get("language");
  const difficulty = searchParams.get("difficulty");

  try {
    const query = firestore
      .collectionGroup("quiz")
      .where("quizLanguage", "==", language)
      .where("quiz_type", "==", category)
      .where("is_deleted", "==", false)
      .where("difficulty", "==", difficulty || "easy");

    const [snap, countSnap] = await Promise.all([
      query.get(),
      firestore.collectionGroup("quiz").count().get(),
    ]);

    const quiz = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return NextResponse.json({
      message: "Quiz fetched",
      quiz,
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

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
}
