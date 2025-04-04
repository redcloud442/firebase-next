import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

import { auth, realtime } from "@/utils/firebase/firebase";
import { AdminUser, User } from "@/utils/types";
import { signInWithEmailAndPassword } from "firebase/auth";
import { child, get, ref } from "firebase/database";

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

export const getUsers = async (params: {
  page: number;
  limit: number;
  search: string;
}) => {
  const { page, limit, search } = params;

  const dbRef = ref(realtime);

  try {
    const snapshot = await get(child(dbRef, "users"));
    if (!snapshot.exists()) {
      return { data: [], count: 0 };
    }

    const data = snapshot.val();

    const users = Object.entries(data).map(([key, value]) => {
      const user = value as User;
      return {
        ...user,
        id: key,
      };
    });

    // Search filtering (name or email)
    const filtered = search
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
      : users;

    const count = filtered.length;

    // Pagination (manual slice)
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return { data: paginated, count };
  } catch (error) {
    console.error("Error getting users:", error);
    return { data: [], count: 0 };
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
  type: "disable" | "enable" | "promote" | "demote" | "update-avatar";
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
