"use client";

import { loginUser } from "@/service/user/auth";
import { SignInFormData, signInSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
const SignIn = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      await loginUser({
        email: data.email,
        password: data.password,
      });

      toast.success("Logged in successfully");
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 relative">
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
        <h2 className="text-2xl font-normal mb-6 text-center">SIGN IN</h2>

        {/* Email */}
        <div className="mb-6 space-y-4 flex flex-col items-center">
          <Label
            htmlFor="email"
            className="block text-md text-center font-normal mb-1 dark:text-black"
          >
            Email
          </Label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-4 py-2 max-w-xs bg-opacity-80 border-1 dark:text-black border-white rounded-full shadow-md focus:outline-none dark:focus:ring-4 dark:focus:ring-white "
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6 space-y-4 flex flex-col items-center">
          <Label
            htmlFor="password"
            className="block text-md text-center font-normal mb-1 dark:text-black"
          >
            Password
          </Label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full px-4 py-2 max-w-xs bg-opacity-80 border-1 dark:text-black border-white rounded-full shadow-md focus:outline-none dark:focus:ring-4 dark:focus:ring-white "
            placeholder="Enter your password"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-xs bg-red-600 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <Link
            type="button"
            className="text-blue-500 underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
