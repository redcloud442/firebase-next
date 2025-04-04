import SignIn from "@/components/SignInPage/SignInPage";
import { UnprotectedRoute } from "@/utils/protection";
const page = async () => {
  await UnprotectedRoute();

  return <SignIn />;
};

export default page;
