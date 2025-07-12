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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { leaderBoardColumn } from "./LeaderboardColumn";
import LeaderboardTabs from "./LeaderboardTabs";

const AdminLeaderBoardsPage = () => {
  const [leaderboards, setLeaderboards] = useState<
    { userEmail: string; CurrentStars: number }[]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [leaderBoardType, setLeaderBoardType] = useState<
    | "Motorcycle Driving Lessons"
    | "Motorcycle Video Lessons"
    | "Car Driving Lessons"
    | "Car Video Lessons"
    | "Road Sign Quiz"
    | "Theoretical Quiz"
  >("Motorcycle Driving Lessons");
  const [isFetchingList, setIsFetchingList] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const cachedLeaderboards = useRef<{
    [key: string]: {
      data: { userEmail: string; CurrentStars: number }[];
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
    setLeaderBoardType(
      type as
        | "Motorcycle Driving Lessons"
        | "Motorcycle Video Lessons"
        | "Car Driving Lessons"
        | "Car Video Lessons"
        | "Road Sign Quiz"
        | "Theoretical Quiz"
    );
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

      <Select value={leaderBoardType} onValueChange={handleTabChange}>
        <SelectTrigger className="w-full lg:hidden">
          <SelectValue placeholder="Leaderboard" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Motorcycle Driving Lessons">
            Motorcycle Driving Lessons
          </SelectItem>

          <SelectItem value="Motorcycle Video Lessons">
            Motorcycle Video Lessons
          </SelectItem>
          <SelectItem value="Car Driving Lessons">
            Car Driving Lessons
          </SelectItem>
          <SelectItem value="Car Video Lessons">Car Video Lessons</SelectItem>
          <SelectItem value="Road Sign Quiz">Road Sign Quiz</SelectItem>
          <SelectItem value="Theoretical Quiz">Theoretical Quiz</SelectItem>
        </SelectContent>
      </Select>
      <Tabs
        defaultValue="Motorcycle Driving Lessons"
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-4 lg:block hidden">
          <TabsTrigger value="Motorcycle Driving Lessons">
            Motorcycle Driving Lessons
          </TabsTrigger>
          <TabsTrigger value="Car Driving Lessons">
            Car Driving Lessons
          </TabsTrigger>
          <TabsTrigger value="Motorcycle Video Lessons">
            Motorcycle Video Lessons
          </TabsTrigger>
          <TabsTrigger value="Car Driving Lessons">
            Car Driving Lessons
          </TabsTrigger>
          <TabsTrigger value="Car Video Lessons">Car Video Lessons</TabsTrigger>
          <TabsTrigger value="Road Sign Quiz">Road Sign Quiz</TabsTrigger>
          <TabsTrigger value="Theoretical Quiz">Theoretical Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="Car Driving Lessons">
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

        <TabsContent value="Car Video Lessons">
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

        <TabsContent value="Motorcycle Driving Lessons">
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

        <TabsContent value="Motorcycle Video Lessons">
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

        <TabsContent value="Road Sign Quiz">
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

        <TabsContent value="Theoretical Quiz">
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
