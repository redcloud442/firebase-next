import firebaseAdmin from "@/utils/firebase/firebaseAdmin";
import { UserData } from "@/utils/types";
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

export const getUsers = async (params: {
  limit: number;
  search?: string;
  startAfterKey?: string;
}) => {
  const { limit, search, startAfterKey } = params;

  const userRef = firebaseAdmin.database().ref("users");
  let query = userRef.orderByKey();

  if (startAfterKey) {
    query = query.startAfter(startAfterKey);
  }

  query = query.limitToFirst(limit);

  const snapshot = await query.once("value");

  const users: {
    id: string;
    name: string;
    email: string;
    rtime: string;
    correctAnswers?: number;
    duration?: string;
    gameCarInfo?: number;
    gameMotorcycleInfo?: number;
  }[] = [];

  let filteredCount = 0;

  snapshot.forEach((child) => {
    const uid = child.key!;
    const user = child.val() as UserData;

    const name = user.User_Information?.name || "";
    const email = user.User_Information?.email || "";
    const rtime = user.User_Information?.rtime || "";

    const matchesSearch =
      !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    if (matchesSearch) {
      filteredCount++;

      users.push({
        id: uid,
        name,
        email,
        rtime,
        ...(user.Quiz_Info && {
          correctAnswers: user.Quiz_Info.correct_answers ?? 0,
          duration: user.Quiz_Info.duration ?? "00:00:00",
        }),
        ...(user.Game_Info && {
          gameCarInfo: Object.keys(user.Game_Info.Cars ?? {}).length ?? 0,
          gameMotorcycleInfo:
            Object.keys(user.Game_Info.Motorcycle ?? {}).length ?? 0,
        }),
      });
    }
  });

  return {
    data: users,
    count: filteredCount,
  };
};

export const getUsersExport = async (params: {
  limit: number;
  startAfterKey?: string;
}) => {
  const { limit, startAfterKey } = params;

  const userRef = firebaseAdmin.database().ref("users");
  let query = userRef.orderByKey();

  if (startAfterKey) {
    query = query.startAfter(startAfterKey);
  }

  query = query.limitToFirst(limit);

  const snapshot = await query.once("value");

  const users: {
    id: string;
    "User Name": string;
    Email: string;
    "Time Spent": string;
    "Correct Answers"?: number;
    Duration?: string;
    "Game Car Played"?: number;
    "Game Motorcycle Played"?: number;
  }[] = [];

  snapshot.forEach((child) => {
    const uid = child.key!;
    const user = child.val() as UserData;

    const name = user.User_Information?.name || "";
    const email = user.User_Information?.email || "";
    const rtime = user.User_Information?.rtime || "";

    users.push({
      id: uid,
      "User Name": name,
      Email: email,
      "Time Spent": rtime,
      ...(user.Quiz_Info && {
        "Correct Answers": user.Quiz_Info.correct_answers ?? 0,
        Duration: user.Quiz_Info.duration ?? "00:00:00",
      }),
      ...(user.Game_Info && {
        "Game Car Played": Object.keys(user.Game_Info.Cars ?? {}).length ?? 0,
        "Game Motorcycle Played":
          Object.keys(user.Game_Info.Motorcycle ?? {}).length ?? 0,
      }),
    });
  });

  return {
    data: users,
    count: snapshot.numChildren(),
  };
};

export const updateUser = async (params: {
  userUid: string;
  type:
    | "disable"
    | "enable"
    | "promote"
    | "demote"
    | "update-avatar"
    | "verify"
    | "delete-profile";
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

  if (type === "verify") {
    await firebaseAdmin.auth().updateUser(userUid, { emailVerified: true });
  }

  if (type === "delete-profile") {
    await firebaseAdmin.auth().updateUser(userUid, {
      photoURL: null,
    });
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

export const resetProgress = async (
  uid: string,
  email: string,
  actorUid: string
) => {
  const userRef = firebaseAdmin.database().ref(`users/${uid}`);

  const snapshot = await userRef.once("value");
  const userData = snapshot.val();

  if (!userData) return;

  await firebaseAdmin
    .firestore()
    .collection("user-history")
    .doc(actorUid)
    .collection("actions")
    .add({
      type: "reset-progress",
      date: new Date(),
      actionReceivedBy: userData?.User_Information?.email ?? "",
      actionBy: email,
    });

  await userRef.update({
    Quiz_Info: null,
    Game_Info: null,
  });
};

export const deleteUser = async (
  uid: string,
  actorUid: string,
  email: string
) => {
  try {
    const userRef = firebaseAdmin.database().ref(`users/${uid}`);

    const snapshot = await userRef.once("value");
    const userData = snapshot.val();

    const userByuid = await firebaseAdmin.auth().getUserByEmail(uid);

    if (userByuid) {
      await firebaseAdmin.auth().deleteUser(userByuid.uid);
    }

    if (!userData) return;

    const user = await firebaseAdmin
      .auth()
      .getUserByEmail(userData.User_Information.email);

    if (user) {
      await firebaseAdmin.auth().deleteUser(user.uid);
    }

    await firebaseAdmin
      .firestore()
      .collection("user-history")
      .doc(actorUid)
      .collection("actions")
      .add({
        type: "delete-user",
        date: new Date(),
        actionReceivedBy: userData?.User_Information?.email ?? "",
        actionBy: email,
      });

    await firebaseAdmin.database().ref(`users/${uid}`).remove();
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async (uid: string) => {
  const userRef = firebaseAdmin.database().ref(`users/${uid}`);

  const snapshot = await userRef.once("value");

  return { data: snapshot.val() as UserData };
};
