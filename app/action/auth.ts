"use server";

import { signInWithEmailAndPassword } from "firebase/auth";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/utils/firebase/firebase";

export async function loginAction(username: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, username, password);

  const idToken = await credential.user.getIdToken();

  await refreshCookiesWithIdToken(idToken, await headers(), await cookies(), {
    apiKey: "AIzaSyDIj7POTzuqY0fB9a5oca58wJzHSQj56Yc",
    cookieName: "AuthToken",
    cookieSignatureKeys: [
      "8bdcb6411da851f7e200af8a77657454373947274d700ffd7882d9ab2e49f3be",
    ],
    cookieSerializeOptions: {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 24, // 12 days
    },
  });
  redirect("/");
}
