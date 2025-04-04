import { getAccountHistory } from "@/service/history/user-history";
import { useAccountHistoryStore } from "@/store/accountHistoryStore";
import { AccountHistory as AccountHistoryType } from "@/utils/types";
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
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ReusableTable from "../ui/reusable-table";
import { accountHistoryColumns } from "./AccountHistoryColumn";
const AccountHistory = () => {
  const { accountHistory, setAccountHistory } = useAccountHistoryStore();

  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = accountHistoryColumns();

  const table = useReactTable({
    data: accountHistory.data,
    columns: columns as ColumnDef<AccountHistoryType>[],
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

  const handleFetchAccountHistory = async () => {
    try {
      setIsLoading(true);
      const invoices = await getAccountHistory({
        limit: 10,
        page: activePage,
      });
      setAccountHistory(invoices);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchAccountHistory();
  }, [activePage]);

  const pageCount = Math.ceil(accountHistory.count / 10);

  const handleRefresh = () => {
    handleFetchAccountHistory();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-xl">Account History</CardTitle>
        <Button disabled={isLoading} variant="outline" onClick={handleRefresh}>
          <RefreshCcw className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 text-lg text-muted-foreground">
        <ReusableTable
          activePage={activePage}
          setActivePage={setActivePage}
          columns={columns as ColumnDef<object>[]}
          table={table as Table<object>}
          isFetchingList={isLoading}
          pageCount={pageCount}
          totalCount={accountHistory.count}
        />
      </CardContent>
    </Card>
  );
};

export default AccountHistory;
