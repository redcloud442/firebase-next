import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KEY_MAPPING } from "@/utils/constant";
import { userReturnData } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export const userColumns = (
  users: userReturnData[],
  handleProceedToUser: (uid: string) => void,
  handleResetProgress: (uid: string) => void
): ColumnDef<userReturnData>[] => {
  const staticKeys = ["id", "email", "name", "rtime"];

  const staticColumns: ColumnDef<userReturnData>[] = [
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
      header: () => <Button variant="ghost">Date Registered</Button>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("rtime")}</div>
      ),
    },
  ];

  const dynamicKeys = Array.from(
    new Set(users.flatMap((user) => Object.keys(user)))
  ).filter((key) => !staticKeys.includes(key));

  const renderHeader = (key: string) => {
    const header = KEY_MAPPING[key as keyof typeof KEY_MAPPING] ?? key;
    return (
      <Button className="w-full capitalize" variant="ghost">
        {header}
      </Button>
    );
  };

  const dynamicColumns: ColumnDef<userReturnData>[] = dynamicKeys.map(
    (key) => ({
      id: key,
      accessorKey: key,
      header: () => renderHeader(key),
      cell: ({ row }) => {
        const value = row.getValue(key) as string;
        return <div className="text-center">{value ?? "—"}</div>;
      },
    })
  );

  const actionColumns: ColumnDef<userReturnData>[] = [
    {
      accessorKey: "action",
      header: () => <Button variant="ghost">Action</Button>,
      cell: ({ row }) => {
        const uuid = row.original.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.email)
                }
              >
                View Player Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleResetProgress(uuid)}>
                Reset Progress
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return [...staticColumns, ...dynamicColumns, ...actionColumns];
};
