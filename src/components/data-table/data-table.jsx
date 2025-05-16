import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/data-table/table";
import Pagination from "@/components/data-table/pagination";
import Search from "@/components/form/search";
import Filter from "@/components/ui/Filter";
import DateRangePicker from "../ui/date-range-picker";

export function DataTable({ columns, data, onAction, enableDatePicker = false, search = "", filters }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  // const appliedFilters = filters.length ? filters : id && options ? [{ id, options }] : [];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const canHideColumns = table.getAllColumns().filter((column) => column.getCanHide());

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
          {/* filters */}
          {search && (
            <Search
              placeholder="Search..."
              value={table.getColumn(search)?.getFilterValue() ?? ""}
              onChange={(event) => table.getColumn(search)?.setFilterValue(event.target.value)}
            />
          )}
          {filters &&
            filters.map((filter, index) => (
              <Filter
                key={filter.id || index}
                id={filter.id}
                options={filter.options}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
              />
            ))}

          {enableDatePicker && (
            <DateRangePicker
              value={state}
              onChange={(selection) => {
                setState([{ ...selection, key: "selection" }]);
                table.getColumn("date")?.setFilterValue([selection]);
              }}
              onReset={() => {
                const resetRange = [
                  {
                    startDate: new Date(),
                    endDate: null,
                    key: "selection",
                  },
                ];
                setState(resetRange);
                table.getColumn("date")?.setFilterValue(undefined);
              }}
            />
          )}
        </div>

        {/* column visibility */}
        <div className="flex items-center gap-2">
          {canHideColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
                      {column.columnDef.header}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {Object.keys(rowSelection).length > 0 && onAction && (
            <Button
              variant="destructive"
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

      {/* table */}
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
                  className="h-24 text-center text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination */}
      <div className="border-t border-gray-200 py-3">
        <Pagination table={table} />
      </div>
    </div>
  );
}
