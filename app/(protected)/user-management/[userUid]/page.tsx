import UserDetailsPage from "@/components/UserDetailsPage/UserDetailsPage";
import { getUser } from "@/handlers/user/user-handler";

const page = async ({ params }: { params: Promise<{ userUid: string }> }) => {
  const { userUid } = await params;

  const { data } = await getUser(userUid);

  return <UserDetailsPage user={data || {}} />;
};

export default page;
