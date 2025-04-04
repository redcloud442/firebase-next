// lib/firebase/getAuthUser.ts
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";

export const getAuthUser = async () => {
  const tokenResult = await getTokens(await cookies(), {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    cookieName: "AuthToken",
    cookieSignatureKeys: [
      process.env.NEXT_PUBLIC_FIREBASE_COOKIE_SIGNATURE_KEY!,
    ],
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!,
    },
  });

  if (!tokenResult || !tokenResult.decodedToken) {
    throw new Error("Unauthorized");
  }

  return tokenResult.decodedToken; // { uid, email, customClaims, ... }
};
