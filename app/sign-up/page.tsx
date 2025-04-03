import SignUp from "@/components/SignUpPage/SignUpPage";
import { UnprotectedRoute } from "@/utils/protection";

const page = async () => {
  await UnprotectedRoute();
  return <SignUp />;
};

export default page;
