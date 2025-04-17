export const leaderboardService = async (params: {
  type: string;
  limit: number;
  startAfterValue: number;
}) => {
  const response = await fetch("/api/leaderboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard data");
  }

  return data;
};
