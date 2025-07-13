import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userReturnData } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { formatCustom } from "@/utils/function";
import Link from "next/link";
import { DropdownMenuItem } from "../ui/dropdown-menu";
export const userColumns = (
  users: userReturnData[],
  handleProceedToUser: (uid: string) => void,
  handleResetProgress: (uid: string) => void,
  handleDeleteUser: (uid: string) => void
): ColumnDef<userReturnData>[] => {
  const staticColumns: ColumnDef<userReturnData>[] = [
    {
      accessorKey: "email",
      header: () => <Button variant="ghost">Email</Button>,
      cell: ({ row }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            className="text-blue-500 underline cursor-pointer"
            onClick={() => handleProceedToUser(row.original.uid)}
          >
            {row.getValue("email")}
          </Button>
        </div>
      ),
    },

    {
      accessorKey: "dateCreated",
      header: () => <Button variant="ghost">Date Registered</Button>,
      cell: ({ row }) => (
        <div className="text-center">
          {formatCustom(row.getValue("dateCreated"))}
        </div>
      ),
    },
    {
      accessorKey: "progress.Car Driving Lessons",
      header: () => <Button variant="ghost">Car Driving Lessons</Button>,
      cell: ({ row }) => {
        const progress = row.original.progress;
        const carLesson = progress?.["Car Driving Lessons"];
        return (
          <div className="text-center">
            {carLesson
              ? `${carLesson.CurrentStars} / ${carLesson.TotalStars}`
              : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "progress.Car Video Lessons",
      header: () => <Button variant="ghost">Car Video Lessons</Button>,
      cell: ({ row }) => {
        const progress = row.original.progress;
        const carLesson = progress?.["Car Video Lessons"];
        return (
          <div className="text-center">
            {carLesson
              ? `${carLesson.CurrentStars} / ${carLesson.TotalStars}`
              : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "progress.Motorcycle Driving Lessons",
      header: () => <Button variant="ghost">Motorcycle Driving Lessons</Button>,
      cell: ({ row }) => {
        const progress = row.original.progress;
        const carLesson = progress?.["Motorcycle Driving Lessons"];
        return (
          <div className="text-center">
            {carLesson
              ? `${carLesson.CurrentStars} / ${carLesson.TotalStars}`
              : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "progress.Motorcycle Video Lessons",
      header: () => <Button variant="ghost">Motorcycle Video Lessons</Button>,
      cell: ({ row }) => {
        const progress = row.original.progress;
        const carLesson = progress?.["Motorcycle Video Lessons"];
        return (
          <div className="text-center">
            {carLesson
              ? `${carLesson.CurrentStars} / ${carLesson.TotalStars}`
              : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "progress.Road Sign Quiz",
      header: () => <Button variant="ghost">Road Sign Quiz</Button>,
      cell: ({ row }) => {
        const progress = row.original.progress;
        const carLesson = progress?.["Road Sign Quiz"];
        return (
          <div className="text-center">
            {carLesson
              ? `${carLesson.CurrentStars} / ${carLesson.TotalStars}`
              : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "progress.Theoretical Quiz",
      header: () => <Button variant="ghost">Theoretical Quiz</Button>,
      cell: ({ row }) => {
        const progress = row.original.progress;
        const carLesson = progress?.["Theoretical Quiz"];
        return (
          <div className="text-center">
            {carLesson
              ? `${carLesson.CurrentStars} / ${carLesson.TotalStars}`
              : "N/A"}
          </div>
        );
      },
    },
  ];

  const actionColumns: ColumnDef<userReturnData>[] = [
    {
      accessorKey: "action",
      header: () => <Button variant="ghost">Action</Button>,
      cell: ({ row }) => {
        const uuid = row.original.uid;
        const email = row.original.email;

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
              <DropdownMenuItem>
                <Link href={`/user-management/${uuid}`}>
                  View Player Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleResetProgress(email)}>
                Reset Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteUser(uuid)}>
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return [...staticColumns, ...actionColumns];
};
