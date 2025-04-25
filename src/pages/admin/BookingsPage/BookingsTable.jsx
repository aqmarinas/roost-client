import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { format, parseISO } from "date-fns";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import Search from "../../../components/atom/Search";
import Pagination from "../../../components/ui/Pagination";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Filter from "@/components/ui/Filter";
import { DatePicker } from "@/components/ui/datepicker";

const periodOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "canceled", label: "Canceled" },
];

export default function BookingsTable({ data, onAction }) {
  const columns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          id="select"
          className="size-4"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          id="select"
          className="size-4"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "created_at",
      header: "Request Time",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-gray-900">{format(parseISO(row.original.created_at), "MMMM dd, yyyy")}</span>
          <span className="text-gray-500">{format(parseISO(row.original.created_at), "HH:mm")}</span>
        </div>
      ),
      enableSorting: true,
      sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.original.date).getTime();
        const b = new Date(rowB.original.date).getTime();
        return a - b;
      },
    },
    {
      header: "Title",
      accessorKey: "eventTitle",
      cell: (row) => <span className="font-semibold text-gray-900">{row.getValue()}</span>,
      enableSorting: true,
    },
    {
      header: "Room",
      accessorKey: "room.name",
      cell: (row) => <span className="text-gray-500">{row.getValue()}</span>,
      enableSorting: true,
    },
    {
      header: "Date & Time",
      accessorKey: "date",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-gray-900">{format(parseISO(row.original.date), "MMMM dd, yyyy")}</span>
          <span>
            {format(parseISO(row.original.startTime), "HH:mm")} - {format(parseISO(row.original.endTime), "HH:mm")}
          </span>
        </div>
      ),
      enableSorting: true,
      sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.original.startTime).getTime();
        const b = new Date(rowB.original.startTime).getTime();
        return a - b;
      },
    },
    {
      header: "Booker",
      accessorKey: "bookerName",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-gray-900">{row.original.bookerName}</span>
          <span className="text-gray-500">{row.original.bookerEmail}</span>
        </div>
      ),
      enableSorting: false,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusColor =
          {
            Pending: "bg-yellow-100 text-yellow-800",
            Approved: "bg-green-100 text-green-800",
            Rejected: "bg-red-100 text-red-800",
          }[status] || "";

        return <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor}`}>{status}</span>;
      },
      enableSorting: false,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionsCell
          row={row}
          onAction={onAction}
        />
      ),
      enableSorting: false,
    },
  ]);

  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
      rowSelection,
      sorting,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  return (
    <>
      {/* search, filter, delete */}
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="md:flex md:items-center mt-4 md:p-0 px-4">
            <div className="md:flex md:mb-0 flex-1 pl-0.5 space-y-4 space-x-4">
              <Search
                placeholder="Search bookings..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <Filter
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                filterData={statusOptions}
                filterType={"status"}
              />
              <DatePicker />
            </div>
            <div className="md:ml-auto mt-4 lg:mt-2 w-full md:w-auto">
              {Object.keys(rowSelection).length > 0 && (
                <button
                  onClick={() => {
                    const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
                    if (selectedIds.length > 0) {
                      onAction(selectedIds, "delete");
                      table.resetRowSelection();
                    }
                  }}
                  className="mb-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md text-sm font-semibold"
                >
                  Delete ({Object.keys(rowSelection).length})
                </button>
              )}
            </div>
            {/* todo: filter status & date */}
          </div>

          {/* table */}
          <div className="mt-4 flow-root">
            <div className="w-full overflow-x-auto">
              <div className="max-h-[calc(100vh-250px)] min-w-full overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="sticky top-0 z-10 bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-3 py-3.5 text-sm text-left font-semibold text-gray-900"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-3 py-4 text-sm text-gray-700 whitespace-nowrap"
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="py-8 text-center"
                        >
                          <p className="text-sm text-gray-500">No bookings found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 border-t border-gray-200 py-3">
          <Pagination table={table} />
        </div>
      </div>
    </>
  );
}

const ActionsCell = React.memo(function ActionsCell({ row, onAction }) {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left"
    >
      <MenuButton className="text-indigo-600 hover:text-indigo-900 focus:outline-none">
        <EllipsisHorizontalIcon className="size-5" />
        <span className="sr-only">Options for booking {row.original.id}</span>
      </MenuButton>
      <div className="fixed z-50">
        <MenuItems
          transition
          className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          {row.original.status === "Pending" && (
            <>
              <MenuItem>
                <div
                  onClick={() => onAction(row.original, "approve")}
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  Approve
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  onClick={() => onAction(row.original, "reject")}
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  Reject
                </div>
              </MenuItem>
            </>
          )}

          <div className="border-t border-gray-200"></div>
          <MenuItem>
            <div
              onClick={() => onAction(row.original, "edit")}
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              Edit
            </div>
          </MenuItem>
          <MenuItem>
            <div
              onClick={() => onAction(row.original, "delete")}
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              Delete
            </div>
          </MenuItem>
        </MenuItems>
      </div>
    </Menu>
  );
});
