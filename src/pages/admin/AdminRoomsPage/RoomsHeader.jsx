import { PlusIcon } from "lucide-react";

export default function RoomsHeader({ onAdd }) {
  return (
    <>
      <div className="space-y-4 px-4 md:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
            <p className="text-sm text-gray-500">Manage all meeting rooms in your company.</p>
          </div>

          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="size-5" />
            Add Room
          </button>
        </div>
      </div>
    </>
  );
}
