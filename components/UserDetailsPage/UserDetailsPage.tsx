import { formatCustom } from "@/utils/function";
import { UserData } from "@/utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { UserPerformanceChart } from "./UserDetailsChart";

type UserDetailsPageProps = {
  user: UserData;
};

const UserDetailsPage = ({ user }: UserDetailsPageProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Details</h1>
      <p>
        This is the user details page. Here you can view the details of the user
        and their account.
      </p>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Player Information</CardTitle>
          <CardDescription>
            Information about the player and their account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-md font-medium">Email</p>
              <p className="text-sm">{user.User_Information.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-md font-medium">Name</p>
              <p className="text-sm">{user.User_Information.name}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-md font-medium">Date Created</p>
              <p className="text-sm">
                {formatCustom(user.User_Information.rtime)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <UserPerformanceChart user={user} />
      {/* <UserAccordionChart user={user} /> */}
    </div>
  );
};

export default UserDetailsPage;
