import {
  deleteUser,
  resetProgress,
  updateUser,
  updateUserChangePassword,
} from "@/handlers/user/user-handler";
import { getAuthUser } from "@/utils/firebase/firebaseApiContext";
import { changePasswordSchema } from "@/utils/schema";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ userUid: string }> }
) => {
  const { uid, email, admin } = await getAuthUser();

  const { userUid } = await params;

  const { type, photoURL } = await req.json();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await updateUser({
    userUid,
    type,
    photoURL,
    actorEmail: email!,
    actorUid: uid,
  });

  return NextResponse.json({ message: "User updated" });
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ userUid: string }> }
) => {
  const { admin, email } = await getAuthUser();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { userUid } = await params;

  const { password, confirmPassword } = await req.json();

  const validate = changePasswordSchema.safeParse({
    password,
    confirmPassword,
  });

  if (!validate.success) {
    return NextResponse.json({ message: "Invalid password" }, { status: 400 });
  }

  await updateUserChangePassword({
    userUid,
    email: email!,
    password: validate.data.password,
  });

  return NextResponse.json({ message: "User updated" });
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ userUid: string }> }
) => {
  const { admin, email, uid } = await getAuthUser();

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { userUid } = await params;

  await resetProgress(email!, uid!, userUid);

  return NextResponse.json({ message: "Progress reset" });
};

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ userUid: string }> }
) => {
  try {
    const { admin, email, uid } = await getAuthUser();

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userUid } = await params;

    await deleteUser(userUid, uid!, email!);

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
};
