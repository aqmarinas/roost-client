import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

function Pagination({ table }) {
  const pageSizeOptions = [5, 10, 20, 50];

  return (
    <div className="bottom-0 left-0 right-0 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* pagesize */}
          <Menu
            as="div"
            className="relative inline-block text-left"
          >
            <div>
              <MenuButton className="inline-flex justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                Show {table.getState().pagination.pageSize} per page
                <ChevronDownIcon
                  className="size-5 text-gray-400"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                {pageSizeOptions.map((size) => (
                  <MenuItem key={size}>
                    <button
                      onClick={() => {
                        table.setPageSize(size);
                      }}
                      className={`hover:bg-gray-100 block w-full text-left px-4 py-2 text-sm`}
                    >
                      {size}
                    </button>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>

          {/* pagination buttons */}
          <div className="space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`p-2 border border-gray-300 rounded-md text-sm font-bold bg-white ${table.getCanPreviousPage() ? "hover:bg-indigo-700 hover:text-white" : "opacity-50 cursor-not-allowed"}`}
            >
              <ChevronLeftIcon
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`p-2 border border-gray-300 rounded-md text-sm font-bold bg-white ${table.getCanNextPage() ? "hover:bg-indigo-700 hover:text-white" : "opacity-50 cursor-not-allowed"}`}
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
  );
}

export default Pagination;
