import { SearchIcon } from "lucide-react";

export default function Search({ id, name, type = "text", placeholder, ...props }) {
  return (
    <>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder ?? "Search..."}
          {...props}
          className="block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-sm text-gray-900 outline-1 outline-gray-200 shadow-sm placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
        />
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-gray-400" />
      </div>
    </>
  );
}
