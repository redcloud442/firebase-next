import firebaseAdmin from "@/utils/firebase/firebaseAdmin";
import { authConfig } from "@/utils/firebase/firebaseConfig";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { idToken, firstname, lastname } = await request.json();

  try {
    const user = await firebaseAdmin.auth().verifyIdToken(idToken);

    await firebaseAdmin.auth().setCustomUserClaims(user.uid, { admin: true });

    await firebaseAdmin.firestore().collection("users").doc(user.uid).set({
      email: user.email,
      firstname: firstname,
      lastname: lastname,
      admin: true,
      createdAt: new Date(),
      updatedAt: null,
    });

    await refreshCookiesWithIdToken(
      idToken,
      await headers(),
      await cookies(),
      authConfig
    );

    return NextResponse.json({ message: "User logged in" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "User not logged in" },
        { status: 401 }
      );
    }
  }
}
