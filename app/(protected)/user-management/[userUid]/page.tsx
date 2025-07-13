import UserDetailsPage from "@/components/UserDetailsPage/UserDetailsPage";
import { getUser } from "@/handlers/user/user-handler";
import { protectedRoute } from "@/utils/protection";
import { UserData } from "@/utils/types";
const page = async ({ params }: { params: Promise<{ userUid: string }> }) => {
  const { userUid } = await params;

  await protectedRoute();

  const { data } = await getUser(userUid);

  return (
    <UserDetailsPage
      user={
        data ||
        ({
          User_Information: { email: "", name: "", rtime: "" },
          progress: {},
        } as UserData)
      }
    />
  );
};

export default page;
