"use client";

import { getUserRoleManagement, resetProgress } from "@/service/user/auth";
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
import { RefreshCcw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ReusableTable from "../ui/reusable-table";
import { userColumns } from "./UserManagementColumn";
import UserManagementExport from "./UserManagementExport";
type FormValues = {
  search: string;
};

const UserManagementTable = () => {
  const [users, setUsers] = useState<userReturnData[]>([]);
  const [count, setCount] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(1);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register, getValues, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      search: "",
    },
  });

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const { search } = getValues();

      const { data, count } = await getUserRoleManagement({
        page: activePage,
        limit: 10,
        search,
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

  useEffect(() => {
    fetchUsers();
  }, [activePage]);

  const handleProceedToUser = (uid: string) => {
    router.push(`/user-management/${uid}`);
  };

  const handleResetProgress = async (uid: string) => {
    try {
      setIsLoading(true);
      await resetProgress({ uid });
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

  const onSubmit = async () => {
    setActivePage(1);
    await fetchUsers();
  };

  const handleRefresh = async () => {
    setActivePage(1);

    reset();

    await fetchUsers();
  };

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full gap-2 justify-between"
      >
        <div className="flex  gap-2">
          <Input
            className="w-full"
            {...register("search")}
            placeholder="Search by name or email"
          />
          <Button type="submit">
            <Search />
            Search
          </Button>
          <Button type="button" onClick={handleRefresh}>
            <RefreshCcw />
            Refresh
          </Button>
        </div>
        <div className="flex gap-2">
          <UserManagementExport />
        </div>
      </form>
      <ReusableTable
        activePage={activePage}
        setActivePage={setActivePage}
        columns={columns as ColumnDef<object>[]}
        table={table as Table<object>}
        isFetchingList={isLoading}
        pageCount={pageCount}
        totalCount={count}
      />
    </div>
  );
};

export default UserManagementTable;
