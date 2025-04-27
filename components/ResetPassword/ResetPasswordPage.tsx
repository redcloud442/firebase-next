"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/utils/firebase/firebase";
import { ResetPasswordFormData, resetPasswordSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode") as string;
  const mode = searchParams.get("mode") as string;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const handleVerifyLink = async () => {
      if (!oobCode || mode !== "resetPassword") {
        toast.error("Invalid password reset link.");
        router.push("/sign-in");
      }

      const email = await verifyPasswordResetCode(auth, oobCode);

      if (!email) {
        toast.error("Invalid password reset link.");
        router.push("/sign-in");
      }
    };
    handleVerifyLink();
  }, [oobCode, mode, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!oobCode) return;

    try {
      setIsSubmitting(true);
      await confirmPasswordReset(auth, oobCode, data.password);
      toast.success("Password has been reset successfully.");
      router.push("/sign-in");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to reset password.");
      } else {
        toast.error("Failed to reset password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <nav className="absolute top-0 left-0 w-full min-h-28 bg-black/20 z-50 flex items-center justify-center">
        <h1 className="text-3xl sm:text-5xl font-black tracking-wide text-outline italic">
          RoadWheeLearn
        </h1>
      </nav>
      <Image
        src="/bg-default.jpg"
        alt="bg"
        fill
        className="object-cover object-center z-0"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-lg p-8 shadow-lg z-50"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h2>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-md text-center font-normal mb-1 dark:text-black"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full px-4 py-2 bg-opacity-80 border-1 dark:text-black border-white rounded-full shadow-md focus:outline-none dark:focus:ring-4 dark:focus:ring-white "
            placeholder="Enter new password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-md text-center font-normal mb-1 dark:text-black"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className="w-full px-4 py-2 bg-opacity-80 border-1 dark:text-black border-white rounded-full shadow-md focus:outline-none dark:focus:ring-4 dark:focus:ring-white "
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-500"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
