"use client";

import { useRouter } from "next/navigation";

import { registerUser } from "@/service/user/auth";
import { SignUpFormData, signUpSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";

const SignUp = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
      });

      toast.success("Success. The user is created in Firebase");
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
          RoadWheelLearn
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
        <h2 className="text-2xl font-normal mb-6 text-center dark:text-black">
          SIGN UP
        </h2>

        {/* Email */}

        <div className="mb-4 flex flex-col items-center">
          <label
            htmlFor="firstname"
            className="block text-md text-center font-normal mb-1 dark:text-black"
          >
            Firstname
          </label>
          <input
            id="firstname"
            type="text"
            {...register("firstname")}
            className="w-full px-4 py-2 max-w-xs bg-opacity-80 border-1 dark:text-black border-white rounded-full shadow-md focus:outline-none dark:focus:ring-4 dark:focus:ring-white "
            placeholder="Enter your firstname"
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstname.message}
            </p>
          )}
        </div>

        <div className="mb-4 flex flex-col items-center">
          <label
            htmlFor="lastname"
            className="block text-md text-center font-normal mb-1 dark:text-black"
          >
            Lastname
          </label>
          <input
            id="lastname"
            type="text"
            {...register("lastname")}
            className="w-full px-4 py-2 max-w-xs bg-opacity-80 border-1 dark:text-black border-white rounded-full shadow-md focus:outline-none dark:focus:ring-4 dark:focus:ring-white "
            placeholder="Enter your lastname"
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastname.message}
            </p>
          )}
        </div>

        <div className="mb-4 flex flex-col items-center">
          <label
            htmlFor="email"
            className="block text-md text-center font-normal mb-1 dark:text-black"
          >
            Email
          </label>
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
        <div className="mb-4 flex flex-col items-center">
          <label
            htmlFor="password"
            className="block text-md text-center font-normal mb-1 dark:text-black"
          >
            Password
          </label>
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

        {/* Confirm Password */}
        <div className="mb-6 flex flex-col items-center">
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
            className="w-full px-4 py-2 max-w-xs bg-opacity-80 border-1 dark:text-black border-white rounded-full shadow-md focus:outline-none dark:focus:ring-4 dark:focus:ring-white "
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-xs bg-red-600 text-white py-2 rounded-md  transition disabled:opacity-50"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>

        <div className="flex items-center justify-center mt-4 gap-2 w-full">
          <span>Already have an account?</span>
          <Link href="/sign-in" className="text-red-500 hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
