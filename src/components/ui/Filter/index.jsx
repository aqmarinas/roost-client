import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

export default function Filter({ columnFilters, setColumnFilters, filterType, filterData }) {
  const filterValues = columnFilters.find((filter) => filter.id === filterType)?.value || [];

  const handleClearFilter = () => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== filterType));
  };

  const handleFilterChange = (value) => {
    setColumnFilters((prev) => {
      const filter = prev.find((f) => f.id === filterType);
      const selected = filter?.value || [];
      const newSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];

      return prev
        .filter((f) => f.id !== filterType)
        .concat({
          id: filterType,
          value: newSelected,
        });
    });
  };

  return (
    <Menu
      as="div"
      className="relative inline-block text-left"
    >
      {({ open }) => (
        <>
          <div>
            <MenuButton className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 capitalize">
              {filterType}
              {filterValues.length > 0 && <span className="ml-1.5 rounded-sm bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-700 tabular-nums">{filterValues.length}</span>}
              <ChevronDownIcon
                className={`-mr-1 size-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div className="p-4">
              <div className="text-sm font-semibold mb-4">Fiter</div>
              <div className="flex flex-col space-y-1 max-h-56 overflow-auto">
                {filterData?.map((item, index) => (
                  <MenuItem key={index}>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFilterChange(item.value);
                      }}
                      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${filterValues.includes(item.value) ? "bg-indigo-50 text-indigo-700" : "text-gray-700"}`}
                    >
                      <span>{item.label}</span>
                      {filterValues.includes(item.value) && <CheckIcon className="h-4 w-4 text-indigo-500" />}
                    </div>
                  </MenuItem>
                ))}
              </div>
              {filterValues.length > 0 && (
                <>
                  <hr className="my-3 border-gray-300" />
                  <MenuItem>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleClearFilter();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Reset
                    </button>
                  </MenuItem>
                </>
              )}
            </div>
          </MenuItems>
        </>
      )}
    </Menu>
  );
}
