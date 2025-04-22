"use client";

import { refreshUser, updateUser } from "@/service/user/auth";
import { storage } from "@/utils/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/context";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import AvatarDropzone from "../ui/drop-zone";
import TableLoading from "../ui/table-loading";
import AccountEditProfile from "./AccountEditProfile";
import AccountHistory from "./AccountHistory";

const AccountPage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const handleEditProfile = () => {
    setIsEditing((prev) => !prev);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file || !user?.uid) return;

    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);

    try {
      setIsUploading(true);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateUser({
        userUid: user.uid,
        type: "update-avatar",
        photoURL: url,
      });

      setUser({ ...user, photoURL: url });
      await refreshUser();

      toast.success("Avatar updated successfully");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {isUploading && <TableLoading />}
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center gap-4">
          <AvatarDropzone
            avatarUrl={user?.photoURL ?? ""}
            onFileUpload={handleAvatarUpload}
            email={user?.email ?? ""}
          />

          <CardTitle className="text-xl">{user?.email}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-lg text-muted-foreground">
          {!isEditing ? (
            <>
              <div>
                <p className="font-semibold text-white">Email</p>
                <p>{user?.email}</p>
              </div>
              <div>
                <p className="font-semibold text-white">Email Verified</p>
                <Badge
                  variant={user?.emailVerified ? "success" : "destructive"}
                  className="text-white"
                >
                  {user?.emailVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
              <div>
                <p className="font-semibold text-white">User Role</p>
                <p className="break-all">
                  {user?.customClaims?.admin ? "ADMIN" : "USER"}
                </p>
              </div>
              <div className="pt-4">
                <Button
                  onClick={handleEditProfile}
                  variant="outline"
                  className="w-full"
                >
                  Edit Profile
                </Button>
              </div>
            </>
          ) : (
            <AccountEditProfile handleCancel={handleCancel} />
          )}
        </CardContent>
      </Card>

      <AccountHistory />
    </div>
  );
};

export default AccountPage;
