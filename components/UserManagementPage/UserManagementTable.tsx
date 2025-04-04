"use client";

import { getUsers } from "@/service/user/auth";
import { User } from "@/utils/types";
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
  const [users, setUsers] = useState<User[]>([]);
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
        setUsers(data);
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

  const columns = userColumns(users, handleProceedToUser);

  const table = useReactTable({
    data: users,
    columns: columns as ColumnDef<User>[],
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
