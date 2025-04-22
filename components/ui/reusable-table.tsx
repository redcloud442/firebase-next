import {
  ColumnDef,
  flexRender,
  Table as ReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import TableLoading from "./table-loading";

type Props<T> = {
  table: ReactTable<T>;
  columns: ColumnDef<T>[];
  activePage: number;
  totalCount: number;
  isFetchingList: boolean;
  setActivePage: Dispatch<SetStateAction<number>>;
  pageCount: number;
  entriesPerPage?: number;
  className?: string;
};

const ReusableTable = <T extends object>({
  table,
  columns,
  activePage,
  totalCount,
  isFetchingList,
  setActivePage,
  pageCount,
  entriesPerPage = 10,
  className = "",
}: Props<T>) => {
  const renderPagination = () => {
    const maxVisiblePages = 3;
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
    let displayedPages: (number | "...")[] = [];

    if (pageCount <= maxVisiblePages) {
      displayedPages = pages;
    } else {
      if (activePage <= 2) {
        displayedPages = [1, 2, 3, "...", pageCount];
      } else if (activePage >= pageCount - 1) {
        displayedPages = [1, "...", pageCount - 2, pageCount - 1, pageCount];
      } else {
        displayedPages = [
          activePage - 1,
          activePage,
          activePage + 1,
          "...",
          pageCount,
        ];
      }
    }

    return (
      <div className="flex space-x-2">
        {displayedPages.map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={page}
              variant={activePage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setActivePage(page)}
              className={`${
                activePage === page
                  ? "bg-zinc-800 text-white"
                  : "border border-zinc-300 text-zinc-700 dark:border-zinc-500 dark:text-zinc-300"
              } rounded-lg px-3 py-2 hover:bg-zinc-700 hover:text-white transition`}
            >
              {page}
            </Button>
          ) : (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-1 text-zinc-600 dark:text-zinc-300"
            >
              {page}
            </span>
          )
        )}
      </div>
    );
  };

  const startEntry = (activePage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(activePage * entriesPerPage, totalCount);

  return (
    <>
      <ScrollArea className={`relative w-full overflow-x-auto ${className}`}>
        {isFetchingList && <TableLoading />}

        <Table className="min-w-full table-auto border-separate border-spacing-0 bg-white text-zinc-900 dark:bg-white/10 dark:text-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-zinc-200 dark:bg-zinc-700"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-2 px-4 text-center text-md font-extrabold text-zinc-700 bg-zinc-200 border-b border-r border-white dark:text-zinc-300 dark:bg-zinc-700 dark:border-zinc-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getExpandedRowModel().rows.length ? (
              table.getExpandedRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-all bg-white/60 duration-300 hover:bg-zinc-100 dark:bg-zinc-800 hover:dark:bg-zinc-700"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-4 text-sm text-zinc-700 border-b border-r border-white dark:text-white dark:border-zinc-500"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center text-sm text-zinc-600 dark:text-zinc-300"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <tfoot>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="flex justify-between items-center py-2 px-4 border-t border-zinc-300 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    Showing {startEntry}–{endEntry} of {totalCount} entries
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </tfoot>
        </Table>

        <ScrollBar
          className="bg-zinc-400 dark:bg-zinc-600"
          orientation="horizontal"
        />
      </ScrollArea>

      <div className="flex items-center justify-end gap-x-4 py-4">
        {activePage > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
            className="bg-zinc-800 text-white rounded-lg px-3 py-2 hover:bg-zinc-700 transition dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            <ChevronLeft />
          </Button>
        )}

        {renderPagination()}

        {activePage < pageCount && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setActivePage((prev) => Math.min(prev + 1, pageCount))
            }
            className="bg-zinc-800 text-white rounded-lg px-3 py-2 hover:bg-zinc-700 transition dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            <ChevronRight />
          </Button>
        )}
      </div>
    </>
  );
};

export default ReusableTable;
