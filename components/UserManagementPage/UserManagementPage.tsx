import { Separator } from "../ui/separator";
import UserManagementTable from "./UserManagementTable";

const UserManagementPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <p>
        This is the user management page. Here you can manage the users in the
        database.
      </p>

      <Separator className="bg-white/20" />

      <section className="mt-4">
        <UserManagementTable />
      </section>
    </div>
  );
};

export default UserManagementPage;
