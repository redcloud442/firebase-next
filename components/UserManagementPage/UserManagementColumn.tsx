import { Button } from "@/components/ui/button";
import { User } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";

export const userColumns = (
  users: User[],
  handleProceedToUser: (uid: string) => void
): ColumnDef<User>[] => {
  const staticKeys = ["id", "email", "name", "rtime"];

  const staticColumns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: () => <Button variant="ghost">Email</Button>,
      cell: ({ row }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            className="text-blue-500 underline cursor-pointer"
            onClick={() => handleProceedToUser(row.original.id)}
          >
            {row.getValue("email")}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: () => <Button variant="ghost">Name</Button>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "rtime",
      header: () => <Button variant="ghost">Registered</Button>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("rtime")}</div>
      ),
    },
  ];

  const dynamicKeys = Array.from(
    new Set(users.flatMap((user) => Object.keys(user)))
  ).filter((key) => !staticKeys.includes(key));

  const dynamicColumns: ColumnDef<User>[] = dynamicKeys.map((key) => ({
    id: key,
    accessorKey: key,
    header: () => (
      <Button className="w-full capitalize" variant="ghost">
        {key}
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue(key) as string;
      return <div className="text-center">{value ?? "—"}</div>;
    },
  }));

  return [...staticColumns, ...dynamicColumns];
};
