import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

import { auth } from "@/utils/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);

    const idToken = await user.user.getIdToken();

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      await signOut(auth);
      throw new Error("Login failed");
    }

    return user;
  } catch (error) {
    await signOut(auth);
    if (error instanceof Error) {
      throw new Error("Login failed");
    }
  }
};

export const logoutUser = async () => {
  await signOut(auth);
  await fetch("/api/auth", {
    method: "DELETE",
    credentials: "include",
  });
};

export const registerUser = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string
) => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);

    const idToken = await user.user.getIdToken();

    await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ idToken, firstname, lastname }),
    });

    return user;
  } catch (error) {
    await signOut(auth);
    if (error instanceof Error) {
      throw new Error("Login failed");
    }
  }
};
