import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/16/solid";

const locations = [
  { id: 1, name: "United States" },
  { id: 2, name: "Canada" },
  { id: 3, name: "Mexico" },
];

export default function Select() {
  const [selected, setSelected] = useState(locations[0]);

  return (
    <div>
      <label
        htmlFor="location"
        className="block text-sm/6 font-medium text-gray-900"
      >
        Location
      </label>
      <div className="mt-2">
        <Listbox
          value={selected}
          onChange={setSelected}
        >
          <div className="relative">
            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              <span className="block truncate">{selected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {locations.map((location) => (
                <ListboxOption
                  key={location.id}
                  value={location}
                  className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"}`}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{location.name}</span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <CheckIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </div>
  );
}
