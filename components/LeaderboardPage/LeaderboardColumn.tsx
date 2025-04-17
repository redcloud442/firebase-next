import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

export const leaderBoardColumn = (
  pageIndex: number,
  pageSize: number,
  leaderBoardType: "QUIZ" | "GAME"
): ColumnDef<{
  userName: string;
  value: number;
}>[] => {
  return [
    {
      header: "Rank",
      cell: ({ row }) => {
        const rank = row.index + 1 + (pageIndex - 1) * pageSize;

        return (
          <div className="flex justify-center items-center">
            {" "}
            {/* Flex container for centering */}
            {rank === 1 ? (
              <Badge className="bg-green-500 dark:bg-green-600 text-white dark:text-white">
                Top 1
              </Badge>
            ) : rank === 2 ? (
              <Badge className="bg-green-500 dark:bg-green-600 text-white dark:text-white">
                Top 2
              </Badge>
            ) : rank === 3 ? (
              <Badge className="bg-green-500 dark:bg-green-600 text-white dark:text-white">
                Top 3
              </Badge>
            ) : (
              <Badge className="bg-gray-500">Rank {rank}</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "userName",
      header: () => (
        <Button className="w-full " variant="ghost">
          User Name
        </Button>
      ),
      cell: ({ row }) => {
        const userName = row.getValue("userName") as string;
        return <div className="font-medium text-center  ">{userName}</div>;
      },
    },
    {
      accessorKey: "value",
      header: () => (
        <Button className="w-full " variant="ghost">
          {leaderBoardType === "QUIZ" ? "Quiz Score" : "Game Count"}
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue("value") as number;
        return <div className="text-center">{value}</div>;
      },
    },
  ];
};
