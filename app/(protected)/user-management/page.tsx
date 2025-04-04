import { protectedRoute } from "@/utils/protection";

const page = async () => {
  await protectedRoute();

  return <div>page</div>;
};

export default page;
