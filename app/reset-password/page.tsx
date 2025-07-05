import ResetPasswordPage from "@/components/ResetPassword/ResetPasswordPage";
import { UnprotectedRoute } from "@/utils/protection";
import { Suspense } from "react";

const page = async () => {
  await UnprotectedRoute();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default page;
