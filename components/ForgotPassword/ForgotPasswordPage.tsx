"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/utils/firebase/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

const ChangePasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    try {
      setIsSubmitted(true);
      await sendPasswordResetEmail(auth, data.email);

      toast.success("Password reset link sent to your email.");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to send reset email.");
      } else {
        toast.error("Failed to send reset email.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative">
      <nav className="absolute top-0 left-0 w-full min-h-28 bg-black/20 z-50 flex items-center justify-center">
        <h1 className="text-3xl sm:text-5xl font-black tracking-wide text-outline italic">
          RoadWheelLearn
        </h1>
      </nav>
      <Image
        src="/bg-default.jpg"
        alt="bg"
        fill
        className="object-cover object-center z-0"
      />
      {!isSubmitted ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-lg p-8 shadow-lg z-50"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Forgot Password?
          </h2>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-md text-center font-normal mb-1 dark:text-black"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full px-4 py-2 bg-opacity-80 border-1 dark:text-black border-white rounded-full shadow-md focus:outline-none dark:focus:ring-4 dark:focus:ring-white "
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center text-center z-50">
          <CircleCheckBig className="text-green-500 text-4xl mb-4 w-40 h-40 animate-pulse" />
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Check your email for the reset link
          </h2>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordPage;
