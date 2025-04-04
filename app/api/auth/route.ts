import firebaseAdmin from "@/utils/firebase/firebaseAdmin";
import { authConfig } from "@/utils/firebase/firebaseConfig";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  const user = await firebaseAdmin.auth().verifyIdToken(idToken);

  if (!user?.admin) {
    return NextResponse.json(
      { message: "User not authorized" },
      { status: 403 }
    );
  }

  try {
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

export async function DELETE() {
  const cookiesList = await cookies();

  cookiesList.delete("AuthToken");

  return NextResponse.json({ message: "User logged out" });
}

export async function PUT(request: NextRequest) {
  const { idToken } = await request.json();

  const user = await firebaseAdmin.auth().verifyIdToken(idToken);

  if (!user?.admin) {
    return NextResponse.json(
      { message: "User not authorized" },
      { status: 403 }
    );
  }

  try {
    await refreshCookiesWithIdToken(
      idToken,
      await headers(),
      await cookies(),
      authConfig
    );

    return NextResponse.json({ message: "User token refreshed" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "User not logged in" },
        { status: 401 }
      );
    }
  }
}
