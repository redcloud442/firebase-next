import LeaderboardPage from "@/components/LeaderboardPage/LeaderboardPage";
import { protectedRoute } from "@/utils/protection";

const page = async () => {
  await protectedRoute();

  return <LeaderboardPage />;
};

export default page;
