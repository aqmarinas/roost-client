import React, { useState } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/20/solid";
import CreateModal from "./CreateModal";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-4 px-4 md:p-0">
        {/* title & btn */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
            <p className="text-sm text-gray-500">Manage all meeting rooms in your company.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="size-5" />
            Add Room
          </button>
        </div>

        <div className="md:flex md:items-center md:gap-4">
          {/* search */}
          <div className="md:flex mb-2 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search room..."
                className="block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-sm text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
              />
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <CreateModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
