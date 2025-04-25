import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import Search from "../../../components/atom/Search";
import Pagination from "../../../components/ui/Pagination";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function FacilitiesTable({ data, onAction }) {
  const columns = [
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
      accessorKey: "name",
      header: "Facility",
      cell: (row) => <span className="font-semibold text-gray-900">{row.getValue()}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "rooms",
      header: "Rooms",
      cell: () => "Enter text here",
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
  ];

  const [rowSelection, setRowSelection] = useState({});
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
      {/* filter & delete */}
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="md:flex md:items-center mt-4 md:p-0 px-4">
            <div className="md:flex md:mb-0 flex-1 pl-0.5">
              <Search
                placeholder="Search facilities..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
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
                          <p className="text-sm text-gray-500">No facilities found</p>
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
      className="relative"
    >
      {({ open }) => (
        <>
          <MenuButton className="text-indigo-600 hover:text-indigo-900 focus:outline-none">
            <EllipsisHorizontalIcon className="size-5" />
            <span className="sr-only">Options for facility {row.original.id}</span>
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
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Edit
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    onClick={() => onAction(row.original, "delete")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
