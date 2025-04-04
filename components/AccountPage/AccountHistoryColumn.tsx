import { Button } from "@/components/ui/button";
import { formatCustom } from "@/utils/function";
import { AccountHistory } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

export const accountHistoryColumns = (): ColumnDef<AccountHistory>[] => {
  return [
    {
      accessorKey: "actionBy",
      header: () => <Button variant="ghost">Action By</Button>,
      cell: ({ row }) => {
        const actionBy = row.original.actionBy;
        return <div className="text-center">{actionBy}</div>;
      },
    },
    {
      accessorKey: "date",
      header: () => <Button variant="ghost">Date</Button>,
      cell: ({ row }) => {
        const date = row.original.date;
        return <div className="text-center">{formatCustom(date)}</div>;
      },
    },
    {
      accessorKey: "type",
      header: () => <Button variant="ghost">Type</Button>,
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-center capitalize">
              {type}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "actionReceivedBy",
      header: () => <Button variant="ghost">Action Received By</Button>,
      cell: ({ row }) => {
        const actionReceivedBy = row.original.actionReceivedBy;
        return <div className="text-center">{actionReceivedBy}</div>;
      },
    },
  ];
};
