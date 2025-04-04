"use client";

import { Button } from "@/components/ui/button";
import { updateUserChangePassword } from "@/service/user/auth";
import { useAccountHistoryStore } from "@/store/accountHistoryStore";
import { ChangePasswordFormData, changePasswordSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../context/context";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  handleCancel: () => void;
};

const AccountEditProfile = ({ handleCancel }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { addAccountHistory } = useAccountHistoryStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    try {
      await updateUserChangePassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
        userUid: user?.uid ?? "",
      });

      addAccountHistory({
        type: "change-password",
        date: new Date().toISOString(),
        actionReceivedBy: "",
        actionBy: user?.email ?? "",
        id: uuidv4(),
      });

      reset();
      handleCancel();
      toast.success("Password updated successfully!");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative">
      <div>
        <Label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <Label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Confirm Password
        </Label>
        <Input
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

      <div className="flex gap-4 relative ">
        <div className="w-full">
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
        <div className="w-full">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AccountEditProfile;
