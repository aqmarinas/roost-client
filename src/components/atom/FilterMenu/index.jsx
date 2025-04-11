import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function FilterMenu({ label, options, resetOption }) {
  return (
    <Menu
      as="div"
      className="relative lg:w-32 w-1/2 z-20"
    >
      <MenuButton className="inline-flex items-center justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 w-full">
        <span>{label}</span>
        <ChevronDownIcon className="size-5 text-gray-400" />
      </MenuButton>
      <MenuItems className="absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-none">
        <div className="py-1">
          {options.map((option) => (
            <MenuItem key={option.value}>
              {({ focus }) => (
                <a
                  href="#"
                  className={`block px-4 py-2 text-sm ${focus ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
                >
                  {option.label}
                </a>
              )}
            </MenuItem>
          ))}
        </div>
        {resetOption && (
          <div className="py-1">
            <MenuItem>
              {({ focus }) => (
                <button
                  type="button"
                  className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm ${focus ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
                >
                  <XMarkIcon className="size-5" />
                  <span>Reset</span>
                </button>
              )}
            </MenuItem>
          </div>
        )}
      </MenuItems>
    </Menu>
  );
}
