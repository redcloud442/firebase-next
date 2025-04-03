import {
  User,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase"; // Make sure this exports your initialized Firebase app

type FormattedUser = {
  uid: string;
  email: string | null;
};

const formatAuthUser = (user: User): FormattedUser => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<FormattedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const authStateChanged = async (user: User | null) => {
    if (!user) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    const formattedUser = formatAuthUser(user);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
  };
}
