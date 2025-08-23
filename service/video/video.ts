export const videoService = async (params: {
  lessonType: string;
  language: string;
}) => {
  const response = await fetch(
    `/api/video?lessonType=${params.lessonType}&language=${params.language}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch video data");
  }

  return data.video;
};
