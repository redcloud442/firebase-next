export const quizService = async (params: {
  category: string;
  language: string;
  difficulty?: string;
}) => {
  const response = await fetch(
    `/api/quiz?category=${params.category}&language=${params.language}&difficulty=${params.difficulty}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard data");
  }

  return data.quiz;
};
