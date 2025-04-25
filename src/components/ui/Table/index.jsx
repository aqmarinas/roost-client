import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, getFilteredRowModel } from "@tanstack/react-table";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Search from "../../../components/atom/Search";

export default function Table({ columns, data, onAction }) {
  const [rowSelection, setRowSelection] = useState({});
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
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  return (
    <>
      {/* filter & delete */}
      <div className="md:flex md:items-center mt-4">
        <div className="md:flex md:mb-0 flex-1">
          <Search
            placeholder="Search..."
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
                console.log("selected ids:", selectedIds);
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
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                      <p className="text-sm text-gray-500">No data found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 px-3">
            <div>
              <p className="text-sm text-gray-500">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={`p-2 border border-gray-300 rounded text-sm font-bold bg-white ${table.getCanPreviousPage() ? "hover:bg-indigo-700 hover:text-white" : "opacity-50 cursor-not-allowed"}`}
              >
                <ChevronLeftIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={`p-2 border border-gray-300 rounded text-sm font-bold bg-white ${table.getCanNextPage() ? "hover:bg-indigo-700 hover:text-white" : "opacity-50 cursor-not-allowed"}`}
              >
                <ChevronRightIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ActionsCell({ onAction, row }) {
  return (
    <Menu
      as="div"
      className="relative"
    >
      {({ open }) => (
        <>
          <MenuButton className="text-indigo-600 hover:text-indigo-900 focus:outline-none">
            <EllipsisHorizontalIcon className="size-5" />
          </MenuButton>
          <div className="fixed z-50">
            <MenuItems className={`absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none ${open ? "block" : "hidden"}`}>
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
}
