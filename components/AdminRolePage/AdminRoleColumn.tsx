import { Button } from "@/components/ui/button";
import { formatCustom } from "@/utils/function";
import { AdminUser } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  handleUpdateUser: (
    userUid: string,
    type: "disable" | "enable" | "promote" | "demote"
  ) => void;
  handleProceedToUser: (userUid: string) => void;
};

export const adminRoleColumns = ({
  handleUpdateUser,
  handleProceedToUser,
}: Props): ColumnDef<AdminUser>[] => {
  return [
    {
      accessorKey: "email",
      header: () => <Button variant="ghost">Email</Button>,
      cell: ({ row }) => {
        const email = row.original.email;
        return (
          <div className="text-center">
            <Button
              variant="link"
              className="text-blue-500 underline cursor-pointer"
              onClick={() => handleProceedToUser(row.original.uid)}
            >
              {email}
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "dateCreated",
      header: () => <Button variant="ghost">Date Created</Button>,
      cell: ({ row }) => (
        <div className="text-center">
          {formatCustom(row.getValue("dateCreated"))}
        </div>
      ),
    },
    {
      accessorKey: "isVerified",
      header: () => <Button variant="ghost">Verified</Button>,
      cell: ({ row }) => {
        const isVerified = row.getValue("isVerified");
        return (
          <div
            className={`text-center ${isVerified ? "text-green-600" : "text-red-500"}`}
          >
            {isVerified ? "Verified" : "Unverified"}
          </div>
        );
      },
    },
    {
      accessorKey: "disabled",
      header: () => <Button variant="ghost">Disabled</Button>,
      cell: ({ row }) => {
        const isDisabled = row.getValue("disabled");
        return (
          <div
            className={`text-center ${isDisabled ? "text-red-500" : " text-green-600"}`}
          >
            {isDisabled ? "Disabled" : "Active"}
          </div>
        );
      },
    },
    {
      accessorKey: "admin",
      header: () => <Button variant="ghost">Role</Button>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("admin") ? "ADMIN" : "MEMBER"}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <Button variant="ghost">Actions</Button>,
      cell: ({ row }) => {
        const uuid = row.original.uid;
        const isDisabled = row.original.disabled;
        const isAdmin = row.original.admin;

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
                Copy user Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProceedToUser(uuid)}>
                View Player Details
              </DropdownMenuItem>
              {isDisabled ? (
                <DropdownMenuItem
                  onClick={() => handleUpdateUser(uuid, "enable")}
                >
                  Enable Account
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleUpdateUser(uuid, "disable")}
                >
                  Disable Account
                </DropdownMenuItem>
              )}
              {isAdmin ? (
                <DropdownMenuItem
                  onClick={() => handleUpdateUser(uuid, "demote")}
                >
                  Demote to Member
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleUpdateUser(uuid, "promote")}
                >
                  Promote to Admin
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
