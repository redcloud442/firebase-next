import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

export const leaderBoardColumn = (
  pageIndex: number,
  pageSize: number,
  leaderBoardType:
    | "Motorcycle Driving Lessons"
    | "Motorcycle Video Lessons"
    | "Car Driving Lessons"
    | "Car Video Lessons"
    | "Road Sign Quiz"
    | "Theoretical Quiz"
): ColumnDef<{
  userEmail: string;
  CurrentStars: number;
  TotalStars: number;
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
      accessorKey: "userEmail",
      header: () => (
        <Button className="w-full " variant="ghost">
          User Email
        </Button>
      ),
      cell: ({ row }) => {
        const userEmail = row.getValue("userEmail") as string;
        return <div className="font-medium text-center  ">{userEmail}</div>;
      },
    },
    {
      accessorKey: "CurrentStars",
      header: () => (
        <Button className="w-full " variant="ghost">
          {leaderBoardType.includes("Quiz") ? "Quiz Progress" : "Stars Count"}
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue("CurrentStars") as number;
        const TotalStars = row.original.TotalStars;

        return (
          <div className="text-center">
            {value} / {TotalStars}
          </div>
        );
      },
    },
  ];
};
