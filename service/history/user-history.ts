import { AccountHistory } from "@/utils/types";

export const getAccountHistory = async (params: {
  limit: number;
  page: number;
}) => {
  const response = await fetch(
    `/api/user/history?limit=${params.limit}&page=${params.page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch account history");
  }

  return data as {
    data: AccountHistory[];
    count: number;
  };
};
