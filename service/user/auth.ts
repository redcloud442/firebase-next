import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

import { auth } from "@/utils/firebase/firebase";
import { AdminUser } from "@/utils/types";
import { signInWithEmailAndPassword } from "firebase/auth";

export const loginUser = async (params: {
  email: string;
  password: string;
}) => {
  const { email, password } = params;

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

export const registerUser = async (params: {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}) => {
  const { email, password, firstname, lastname } = params;

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

export const getAdminUsers = async (params: {
  limit: number;
  search: string;
  nextPageToken?: string;
}) => {
  const { limit, search, nextPageToken } = params;

  const response = await fetch(
    `/api/user?limit=${limit}&search=${search}&nextPageToken=${nextPageToken ?? ""}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return data as {
    users: AdminUser[];
    count: number;
    nextPageToken: string;
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
    | "verify";
  photoURL?: string;
}) => {
  const { userUid, type, photoURL } = params;

  const response = await fetch(`/api/user/${userUid}`, {
    method: "PATCH",
    body: JSON.stringify({ type, photoURL }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return data;
};

export const updateUserChangePassword = async (params: {
  password: string;
  confirmPassword: string;
  userUid: string;
}) => {
  const { password, confirmPassword, userUid } = params;

  const response = await fetch(`/api/user/${userUid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, confirmPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return data;
};

export const refreshUser = async () => {
  const idToken = await auth.currentUser?.getIdToken(true);

  const response = await fetch("/api/auth", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to refresh user");
  }

  return data;
};

export const resetProgress = async (params: { uid: string }) => {
  const { uid } = params;

  const response = await fetch(`/api/user/${uid}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to reset progress");
  }

  return data;
};

export const getUserRoleManagement = async (params: {
  limit: number;
  search: string;
  page: number;
}) => {
  const { limit, search, page } = params;

  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      limit,
      search,
      page,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to get user role management");
  }

  return data;
};

export const getUserRoleManagementExport = async (params: {
  limit: number;
  page: number;
}) => {
  const { limit, page } = params;

  const response = await fetch("/api/user/export", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      limit,
      page,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to get user role management");
  }

  return data;
};
