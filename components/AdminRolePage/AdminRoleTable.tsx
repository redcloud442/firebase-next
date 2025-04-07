"use client";

import { getAdminUsers, updateUser } from "@/service/user/auth";
import { AdminUser } from "@/utils/types";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Table,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ReusableTable from "../ui/reusable-table";
import { adminRoleColumns } from "./AdminRoleColumn";

const UserManagementTable = () => {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [count, setCount] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(1);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [pageTokens, setPageTokens] = useState<string[]>([""]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const pageToken = pageTokens[activePage - 1] || undefined;

        const { users, count, nextPageToken } = await getAdminUsers({
          limit: 10,
          search: "",
          nextPageToken: pageToken,
        });

        setUsers(users);
        setCount(count);

        if (nextPageToken && pageTokens.length === activePage) {
          setPageTokens([...pageTokens, nextPageToken]);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [pageTokens, activePage]);

  const handleUpdateUser = async (
    userUid: string,
    type: "disable" | "enable" | "promote" | "demote" | "verify"
  ) => {
    try {
      setIsLoading(true);
      await updateUser({ userUid, type });

      switch (type) {
        case "disable":
          setUsers(
            users.map((user) =>
              user.uid === userUid ? { ...user, disabled: true } : user
            ) as AdminUser[]
          );
          break;
        case "enable":
          setUsers(
            users.map((user) =>
              user.uid === userUid ? { ...user, disabled: false } : user
            ) as AdminUser[]
          );
          break;
        case "promote":
          setUsers(
            users.map((user) =>
              user.uid === userUid ? { ...user, admin: true } : user
            ) as AdminUser[]
          );
          break;
        case "demote":
          setUsers(
            users.map((user) =>
              user.uid === userUid ? { ...user, admin: false } : user
            ) as AdminUser[]
          );
          break;
        case "verify":
          setUsers(
            users.map((user) =>
              user.uid === userUid ? { ...user, isVerified: true } : user
            ) as AdminUser[]
          );
          break;
      }

      toast.success("User updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToUser = (userUid: string) => {
    router.push(`/user-management/${userUid}`);
  };

  const columns = adminRoleColumns({ handleUpdateUser, handleProceedToUser });

  const table = useReactTable({
    data: users,
    columns: columns as ColumnDef<AdminUser>[],
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });
  const pageCount = Math.ceil(count / 10);

  return (
    <ReusableTable
      activePage={activePage}
      setActivePage={setActivePage}
      columns={columns as ColumnDef<object>[]}
      table={table as Table<object>}
      isFetchingList={isLoading}
      pageCount={pageCount}
      totalCount={count}
    />
  );
};

export default UserManagementTable;
