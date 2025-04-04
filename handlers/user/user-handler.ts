import firebaseAdmin from "@/utils/firebase/firebaseAdmin";
import { Timestamp } from "firebase/firestore";

export const getAdminUsers = async (params: {
  limit: number;
  nextPageToken?: string;
  search?: string;
}) => {
  const { limit, nextPageToken, search } = params;

  const result = search
    ? [await firebaseAdmin.auth().getUserByEmail(search)]
    : await firebaseAdmin.auth().listUsers(limit, nextPageToken ?? undefined);

  const count = (await firebaseAdmin.auth().listUsers()).users.length;

  return {
    users: (Array.isArray(result) ? result : result.users).map(
      (user: firebaseAdmin.auth.UserRecord) => ({
        uid: user.uid,
        email: user.email,
        dateCreated: user.metadata.creationTime,
        disabled: user.disabled,
        isVerified: user.emailVerified,
        admin: user.customClaims?.admin ?? false,
      })
    ),
    nextPageToken: Array.isArray(result) ? null : (result.pageToken ?? null),
    count,
  };
};

export const updateUser = async (params: {
  userUid: string;
  type: "disable" | "enable" | "promote" | "demote" | "update-avatar";
  photoURL?: string;
  actorEmail: string;
  actorUid: string;
}) => {
  const { userUid, type, actorEmail, actorUid, photoURL } = params;

  const user = await firebaseAdmin.auth().getUser(userUid);

  if (type === "disable") {
    await firebaseAdmin.auth().updateUser(userUid, { disabled: true });
  }

  if (type === "enable") {
    await firebaseAdmin.auth().updateUser(userUid, { disabled: false });
  }

  if (type === "promote") {
    await firebaseAdmin.auth().setCustomUserClaims(userUid, { admin: true });
  }

  if (type === "demote") {
    await firebaseAdmin.auth().setCustomUserClaims(userUid, { admin: false });
  }

  if (type === "update-avatar") {
    await firebaseAdmin.auth().updateUser(userUid, { photoURL: photoURL });
  }

  await firebaseAdmin
    .firestore()
    .collection("user-history")
    .doc(actorUid)
    .collection("actions")
    .add({
      type,
      date: new Date(),
      actionReceivedBy: photoURL ? user.email : "",
      actionBy: actorEmail,
    });
};

export const getAccountHistory = async (params: {
  limit: number;
  page: number;
  uid: string;
}) => {
  const { limit, page, uid } = params;

  const firestore = firebaseAdmin.firestore();

  // 1. Get total count of actions
  const totalSnapshot = await firestore
    .collection("user-history")
    .doc(uid)
    .collection("actions")
    .count()
    .get();

  const totalCount = totalSnapshot.data().count;

  // 2. Fetch paginated docs
  const actionsRef = firestore
    .collection("user-history")
    .doc(uid)
    .collection("actions")
    .orderBy("date", "desc");

  if (page === 1) {
    const snapshot = await actionsRef.limit(limit).get();

    return {
      data: snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate(),
      })),
      count: totalCount,
    };
  }

  const prevPageSnapshot = await actionsRef.limit((page - 1) * limit).get();
  const lastVisible = prevPageSnapshot.docs[prevPageSnapshot.docs.length - 1];

  const currentPageSnapshot = await actionsRef
    .startAfter(lastVisible)
    .limit(limit)
    .get();

  return {
    data: currentPageSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate(),
    })),
    count: totalCount,
  };
};

export const updateUserChangePassword = async (params: {
  userUid: string;
  email: string;
  password: string;
}) => {
  const { userUid, email, password } = params;

  await firebaseAdmin.auth().updateUser(userUid, { password: password });

  await firebaseAdmin
    .firestore()
    .collection("user-history")
    .doc(userUid)
    .collection("actions")
    .add({
      type: "change-password",
      date: new Date(),
      actionReceivedBy: "",
      actionBy: email,
    });
};
