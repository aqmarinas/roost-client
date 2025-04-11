import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import CreateModal from "./CreateModal";
import Search from "../../../components/atom/Search";

export default function FacilitiesHeader() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-4 px-4 md:p-0">
        {/* title & btn */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Facilities</h1>
            <p className="text-sm text-gray-500">Manage facilities available in meeting rooms.</p>
          </div>

          <div className="lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto w-full"
            >
              <PlusIcon className="size-5" />
              Add Facility
            </button>
          </div>
        </div>

        <div className="md:flex md:items-center md:gap-4">
          {/* search */}
          <div className="md:flex mb-2 md:mb-0">
            <Search placeholder="Search facilities..." />
          </div>
        </div>
      </div>
      <CreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
