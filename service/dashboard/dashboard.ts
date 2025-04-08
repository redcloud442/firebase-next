import { DashboardData } from "@/utils/types";

export const getDashboardDataService = async () => {
  const data = await fetch("/api/dashboard", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();

  if (!data.ok) {
    throw new Error(response.message);
  }

  return response as DashboardData;
};
