import React, { Suspense, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import FilterMenu from "../../../components/atom/FilterMenu";
// import BookModal from "../../public/HomePage/BookModal";

const BookModal = React.lazy(() => import("../../public/HomePage/BookModal"));

export default function Header() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const periodOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "canceled", label: "Canceled" },
  ];

  return (
    <>
      <div className="space-y-4 px-4 md:p-0">
        {/* title & btn */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="text-sm text-gray-500">Manage all meeting room bookings.</p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto w-full"
          >
            <PlusIcon className="size-5" />
            Add Booking
          </button>
        </div>

        <div className="md:flex md:items-center md:gap-4">
          {/* search */}
          <div className="md:flex mb-2 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search bookings..."
                className="block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-sm text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
              />
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-gray-400"
              />
            </div>
          </div>

          {/* filter */}
          <div className="flex gap-2">
            <FilterMenu
              label="Period"
              options={periodOptions}
              resetOption
            />
            <FilterMenu
              label="Status"
              options={statusOptions}
              resetOption
            />
          </div>
        </div>
      </div>

      {/* lazy loading */}
      {isCreateModalOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <BookModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
