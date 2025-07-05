import firebaseAdmin from "@/utils/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const firestore = firebaseAdmin.firestore();
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("email");
  const startAfterDate = searchParams.get("startAfter");
  const limit = 10;

  let query;
  let countSnap;
  try {
    if (userEmail) {
      query = firestore
        .collection("feedback")
        .doc(userEmail)
        .collection("user_feedbacks")
        .orderBy("date", "desc")
        .limit(limit);

      if (startAfterDate) {
        query = query.startAfter(new Date(startAfterDate));
      }

      countSnap = await firestore
        .collection("feedback")
        .doc(userEmail)
        .collection("user_feedbacks")
        .count()
        .get();
    } else {
      query = firestore.collectionGroup("user_feedbacks").limit(limit);

      if (startAfterDate) {
        query = query.startAfter(new Date(startAfterDate));
      }

      countSnap = await firestore
        .collectionGroup("user_feedbacks")
        .count()
        .get();
    }

    const snap = await query.get();

    const feedback = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return NextResponse.json({
      message: "Feedback fetched",
      feedback,
      totalCount: countSnap.data().count,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching feedback", error: String(error) },
      { status: 500 }
    );
  }
};
