import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import Search from "../../../components/atom/Search";
import Pagination from "../../../components/ui/Pagination";
import Filter from "../../../components/ui/Filter";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function RoomsTable({ data, onAction, filterData }) {
  const columns = [
    {
      accessorKey: "name",
      header: "Room",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <img
            className="rounded-lg object-cover aspect-3/2 w-24 lg:w-48"
            src={`http://localhost:3000/${row.original.image}`}
            alt={row.original.name}
          />
          <p className="text-sm font-semibold line-clamp-2">{row.original.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserGroupIcon className="size-5" />
          {row.original.capacity}
        </div>
      ),
      enableSorting: true,
      enableColumnFilter: false,
      sortingFn: (rowA, rowB, columnId) => {
        const a = Number(rowA.getValue(columnId));
        const b = Number(rowB.getValue(columnId));

        return a - b;
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span className="text-sm text-gray-500 whitespace-nowrap">{row.original.location}</span>,
      enableSorting: false,
      // sortingFn: (rowA, rowB, columnId) => {
      //   const a = Number(rowA.getValue(columnId));
      //   const b = Number(rowB.getValue(columnId));

      //   return a - b;
      // },
    },
    {
      accessorKey: "facilities",
      header: "Facilities",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.facilities?.map((facility) => (
            <span
              key={facility.id}
              className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
            >
              {facility.name}
            </span>
          ))}
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (filterValue.length === 0) return true;
        const facilityNames = row.original.facilities?.map((f) => f.name) || [];
        return filterValue.every((value) => facilityNames.includes(value));
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <ActionsCell
          row={row}
          onAction={onAction}
        />
      ),
      meta: {
        className: "text-center",
      },
    },
  ];

  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
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
      columnFilters,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  return (
    <>
      {/* search & filter */}
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="md:flex md:items-center mt-4 md:p-0 px-4">
            <div className="md:flex md:mb-0 flex-1 pl-0.5 space-y-4 space-x-4">
              <Search
                placeholder="Search room..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <Filter
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                filterData={filterData}
                filterType={"facilities"}
              />
            </div>
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
                          <p className="text-sm text-gray-500">No room found</p>
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

const ActionsCell = React.memo(function ActionsCell({ onAction, row }) {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left"
    >
      {({ open }) => (
        <>
          <MenuButton className="text-indigo-600 hover:text-indigo-900 focus:outline-none">
            <EllipsisHorizontalIcon className="size-5" />
            <span className="sr-only">Options for room {row.original.id}</span>
          </MenuButton>
          <div className="fixed z-50">
            <MenuItems
              transition
              className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in ${
                open ? "block" : "hidden"
              }`}
            >
              <div className="py-1">
                <MenuItem>
                  <div
                    onClick={() => onAction(row.original, "edit")}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer"
                  >
                    Edit
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    onClick={() => onAction(row.original, "delete")}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer"
                  >
                    Delete
                  </div>
                </MenuItem>
              </div>
            </MenuItems>
          </div>
        </>
      )}
    </Menu>
  );
});
