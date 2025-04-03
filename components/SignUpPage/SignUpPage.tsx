"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebase/firebase";

import { SignUpFormData, signUpSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
      await createUserWithEmailAndPassword(auth, data.email, data.password);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
