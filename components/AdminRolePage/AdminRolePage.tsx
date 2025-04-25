import { Separator } from "../ui/separator";
import AdminRoleTable from "./AdminRoleTable";

const AdminRolePage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">User Role Management</h1>
      <p>
        This is the user role page. Here you can manage the user roles in the
        database.
      </p>

      <Separator className="bg-white/20" />

      <section className="mt-4">
        <AdminRoleTable />
      </section>
    </div>
  );
};

export default AdminRolePage;
