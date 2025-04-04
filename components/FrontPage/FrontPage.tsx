"use client";

import { logoutUser } from "@/service/user/auth";
import { redirect } from "next/navigation";

const FrontPage = () => {
  const handleLogout = async () => {
    await logoutUser();
    redirect("/sign-in");
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default FrontPage;
