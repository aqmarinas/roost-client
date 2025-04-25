import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/ui/Pagination";

export function DataTable({ columns, data, globalFilterKey = "", enableGlobalFilter = false, onAction, customFilters, datePicker }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
          {enableGlobalFilter && (
            <Input
              placeholder="Search..."
              value={table.getColumn(globalFilterKey)?.getFilterValue() ?? ""}
              onChange={(event) => table.getColumn(globalFilterKey)?.setFilterValue(event.target.value)}
              className="w-full md:w-64"
            />
          )}

          {/* Optional custom filters */}
          {customFilters}

          {/* Optional date picker */}
          {datePicker}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
              >
                Columns <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {Object.keys(rowSelection).length > 0 && onAction && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
                onAction(selectedIds, "delete");
                table.resetRowSelection();
              }}
            >
              Delete ({Object.keys(rowSelection).length})
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className="ml-1 inline-flex">
                        {header.column.getIsSorted() === "asc" && (
                          <ArrowUp
                            className="h-4 w-4"
                            onClick={header.column.getToggleSortingHandler()}
                          />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ArrowDown
                            className="h-4 w-4"
                            onClick={header.column.getToggleSortingHandler()}
                          />
                        )}
                        {!header.column.getIsSorted() && (
                          <ArrowUpDown
                            className="h-4 w-4 text-gray-500"
                            onClick={header.column.getToggleSortingHandler()}
                          />
                        )}
                      </span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-gray-200 py-3">
        <Pagination table={table} />
      </div>
    </div>
  );
}
