import FrontPage from "@/components/FrontPage/FrontPage";
import { protectedRoute } from "@/utils/protection";

const page = async () => {
  await protectedRoute();

  return <FrontPage />;
};

export default page;
