import AdminRoleTable from "./AdminRoleTable";

const AdminRolePage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Role Management</h1>
      <p>
        This is the admin role page. Here you can manage the admin roles in the
        database.
      </p>
      <section className="mt-4">
        <AdminRoleTable />
      </section>
    </div>
  );
};

export default AdminRolePage;
