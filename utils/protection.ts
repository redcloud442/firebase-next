import { User } from "@/components/context/context";
import { getUser } from "@/service/user/user";
import { Tokens } from "next-firebase-auth-edge/auth";
import { filterStandardClaims } from "next-firebase-auth-edge/auth/claims";
import { redirect } from "next/navigation";
import { auth } from "./firebase/firebase";

const toUser = ({ decodedToken }: Tokens): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
    source_sign_in_provider: signInProvider,
  } = decodedToken;

  const customClaims = filterStandardClaims(decodedToken);

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    providerId: signInProvider,
    customClaims: (customClaims as { admin: boolean }) ?? null,
  };
};

export const protectedRoute = async () => {
  const tokens = await getUser();

  const user = tokens ? toUser(tokens) : null;

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.customClaims?.admin) {
    redirect("/");
  }
};

export const UnprotectedRoute = async () => {
  const user = auth.currentUser;

  if (user) {
    redirect("/");
  }
};
