import { redirect } from "next/navigation";
import { auth } from "./firebase/firebase";
import firebaseAdmin from "./firebase/firebaseAdmin";

export const protectRoute = async () => {
  const user = auth.currentUser;

  if (!user) {
    redirect("/sign-in");
  }

  const userData = await firebaseAdmin.auth().getUser(user.uid);

  if (!userData) {
    redirect("/sign-in");
  }

  const userDataCollection = await firebaseAdmin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get();

  if (!userDataCollection.exists) {
    redirect("/sign-in");
  }

  const userRole = userDataCollection.data()?.role;

  if (userRole !== "ADMIN") {
    redirect("/sign-in");
  }

  return userData;
};

export const UnprotectedRoute = async () => {
  const user = auth.currentUser;

  if (user) {
    redirect("/");
  }
};
