import AdminRolePage from "@/components/AdminRolePage/AdminRolePage";
import { protectedRoute } from "@/utils/protection";

const page = async () => {
  await protectedRoute();

  return <AdminRolePage />;
};

export default page;
