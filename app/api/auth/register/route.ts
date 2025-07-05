import firebaseAdmin from "@/utils/firebase/firebaseAdmin";
import { getAuthUser } from "@/utils/firebase/firebaseApiContext";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { firstname, lastname, email, password } = await request.json();

  const { admin } = await getAuthUser();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName: `${firstname} ${lastname}`,
      emailVerified: true,
    });

    await firebaseAdmin.auth().setCustomUserClaims(user.uid, { admin: true });

    await firebaseAdmin.firestore().collection("users").doc(user.uid).set({
      email: user.email,
      firstname: firstname,
      lastname: lastname,
      admin: true,
      createdAt: new Date(),
      updatedAt: null,
    });

    return NextResponse.json({ message: "User created" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "User not created" },
        { status: 401 }
      );
    }
  }
}
