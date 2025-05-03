import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export default function Select({ label = "", options = [], selected, onChange, displayKey = "name", valueKey = "id", error, fetchError, required = false, loading = false }) {
  const selectedOption = options.find((option) => option[valueKey] === selected);

  return (
    <>
      <Listbox
        value={selected}
        onChange={onChange}
      >
        {label && (
          <Label className="mt-2 block text-sm font-medium text-gray-900">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </Label>
        )}
        <div className="relative mt-2">
          <ListboxButton className={`w-full rounded-md bg-white py-2 px-3 text-left border ${error ? "border-red-500" : "border-gray-300"} focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600`}>
            <span className="block truncate text-sm">{selectedOption ? selectedOption[displayKey] : `Select a ${label}`}</span>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto text-sm">
            {loading ? (
              <span className="text-gray-500 text-sm">Loading options...</span>
            ) : options.length > 0 ? (
              options.map((option) => (
                <ListboxOption
                  key={option[valueKey]}
                  value={option[valueKey]}
                  className="cursor-pointer select-none relative py-2 pl-4 hover:bg-indigo-100"
                >
                  {option[displayKey]}
                </ListboxOption>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No options available</div>
            )}
          </ListboxOptions>
        </div>
      </Listbox>

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}

      {fetchError && <p className="mt-1 text-sm text-red-500">Failed to load options</p>}
    </>
  );
}
