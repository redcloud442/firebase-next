"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leaderboardService } from "@/service/leaderboard/leaderboard";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { leaderBoardColumn } from "./LeaderboardColumn";
import LeaderboardTabs from "./LeaderboardTabs";

const AdminLeaderBoardsPage = () => {
  const [leaderboards, setLeaderboards] = useState<
    { userName: string; value: number }[]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [leaderBoardType, setLeaderBoardType] = useState<"QUIZ" | "GAME">(
    "QUIZ"
  );
  const [isFetchingList, setIsFetchingList] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const cachedLeaderboards = useRef<{
    [key: string]: {
      data: { userName: string; value: number }[];
      totalCount: number;
    };
  }>({});

  useEffect(() => {
    const getLeaderboards = async () => {
      try {
        setIsFetchingList(true);
        const cacheKey = `${leaderBoardType}-${activePage}`;
        if (cachedLeaderboards.current[cacheKey]) {
          const cachedData = cachedLeaderboards.current[cacheKey];
          setLeaderboards(cachedData.data);
          setTotalCount(cachedData.totalCount);
          return;
        }

        const { totalCount, data } = await leaderboardService({
          type: leaderBoardType,
          limit: 10,
          startAfterValue: activePage,
        });

        cachedLeaderboards.current[cacheKey] = { data, totalCount };

        setLeaderboards(data);

        setTotalCount(totalCount);
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message);
        }
      } finally {
        setIsFetchingList(false);
      }
    };
    getLeaderboards();
  }, [leaderBoardType, activePage]);

  const columns = leaderBoardColumn(activePage, 10, leaderBoardType);

  const table = useReactTable({
    data: leaderboards,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleTabChange = (type?: string) => {
    setLeaderBoardType(type as "QUIZ" | "GAME");
    setActivePage(1);
  };

  const pageCount = Math.ceil(totalCount / 10);

  return (
    <Card className="w-full rounded-sm p-4">
      <div className="flex items-center py-4">
        <div className="flex items-start py-4">
          <h1 className="Title pr-4 text-2xl font-bold">Leaderboards</h1>
          <Trophy size={40} />
        </div>
      </div>

      <Tabs defaultValue="QUIZ" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="QUIZ">Quiz</TabsTrigger>
          <TabsTrigger value="GAME">Game</TabsTrigger>
        </TabsList>

        <TabsContent value="QUIZ">
          <LeaderboardTabs
            table={table}
            columns={columns}
            activePage={activePage}
            totalCount={totalCount}
            setActivePage={setActivePage}
            pageCount={pageCount}
            isFetchingList={isFetchingList}
          />
        </TabsContent>

        <TabsContent value="GAME">
          <LeaderboardTabs
            table={table}
            columns={columns}
            activePage={activePage}
            totalCount={totalCount}
            setActivePage={setActivePage}
            pageCount={pageCount}
            isFetchingList={isFetchingList}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AdminLeaderBoardsPage;
