import ChangePasswordPage from "@/components/ForgotPassword/ForgotPasswordPage";
import { UnprotectedRoute } from "@/utils/protection";

const page = async () => {
  await UnprotectedRoute();

  return <ChangePasswordPage />;
};

export default page;
