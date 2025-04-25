import SignUp from "@/components/SignUpPage/SignUpPage";
import { protectedRoute } from "@/utils/protection";

const page = async () => {
  await protectedRoute();

  return <SignUp />;
};

export default page;
