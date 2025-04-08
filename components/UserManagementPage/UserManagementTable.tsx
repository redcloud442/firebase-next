"use client";

import { getUsers, resetProgress } from "@/service/user/auth";
import { userReturnData } from "@/utils/types";
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
import { userColumns } from "./UserManagementColumn";

const UserManagementTable = () => {
  const [users, setUsers] = useState<userReturnData[]>([]);
  const [count, setCount] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(1);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const { data, count } = await getUsers({
          page: activePage,
          limit: 10,
          search: "",
        });
        setUsers(data as userReturnData[]);
        setCount(count);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [activePage]);

  const handleProceedToUser = (uid: string) => {
    router.push(`/user-management/${uid}`);
  };

  const handleResetProgress = async (uid: string) => {
    try {
      setIsLoading(true);
      await resetProgress(uid);
      const userToReset = users.find((user) => user.id === uid);

      if (userToReset) {
        const resetData = {
          rtime: userToReset.rtime,
          email: userToReset.email,
          name: userToReset.name,
          id: uid,
        };

        setUsers((prevUsers) =>
          prevUsers.map((user) => ({
            ...user,
            ...(user.id === uid && {
              User_Information: resetData,
            }),
          }))
        );

        toast.success("Progress reset successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const columns = userColumns(users, handleProceedToUser, handleResetProgress);

  const table = useReactTable({
    data: users,
    columns: columns as ColumnDef<userReturnData>[],
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
