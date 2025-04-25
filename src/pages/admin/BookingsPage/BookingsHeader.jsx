import { PlusIcon } from "@heroicons/react/24/solid";

export default function BookingsHeader({ onAdd }) {
  return (
    <>
      <div className="space-y-4 px-4 md:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="text-sm text-gray-500">Manage all meeting room bookings.</p>
          </div>

          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto w-full"
          >
            <PlusIcon className="size-5" />
            Add Booking
          </button>
        </div>
      </div>
    </>
  );
}
