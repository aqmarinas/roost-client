"use client";
import React, { useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import useFetch from "../../../hooks/useFetch";
import { Toaster, toast } from "react-hot-toast";
import DeleteModal from "./DeleteModal";
import UpdateModal from "./UpdateModal";

export default function FacilitiesTable() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const { data: response, loading, error, refetch } = useFetch(`/facilities`);
  const facilities = response?.data || [];

  if (loading) return <p>Loading fetch facilities...</p>;
  if (error) toast.error(`Error loading facilities`);

  const handleActionClick = (facility, actionType) => {
    setSelectedFacility(facility);
    actionType === "edit" ? setIsUpdateModalOpen(true) : setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="w-full overflow-x-auto">
          <div className="max-h-[calc(100vh-200px)] min-w-full overflow-y-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="sticky top-0 z-10 bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Facility
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Rooms
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pr-4 pl-3 sm:pr-0"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {facilities.length > 0 ? (
                    facilities.map((facility) => (
                      <tr key={facility.id}>
                        <td className="pr-3 py-4 text-sm whitespace-nowrap text-gray-900 font-semibold sm:pl-0">{facility.name}</td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {/* {facility.room} */}
                          12 rooms
                        </td>

                        <td className="py-4 px-3 text-sm font-medium whitespace-nowrap text-center">
                          <Menu
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <div>
                              <MenuButton className="text-indigo-600 hover:text-indigo-900 focus:outline-none">
                                <EllipsisHorizontalIcon className="size-5" />
                                <span className="sr-only">Options for facility {facility.id}</span>
                              </MenuButton>
                            </div>
                            <MenuItems
                              transition
                              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                              <div className="py-1">
                                <MenuItem>
                                  <div
                                    onClick={() => handleActionClick(facility, "edit")}
                                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer"
                                  >
                                    Edit
                                  </div>
                                </MenuItem>
                                <MenuItem>
                                  <div
                                    onClick={() => handleActionClick(facility, "delete")}
                                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer"
                                  >
                                    Delete
                                  </div>
                                </MenuItem>
                              </div>
                            </MenuItems>
                          </Menu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <td
                      colSpan={3}
                      className=" py-8 text-center"
                    >
                      <p className="text-sm text-gray-500">No facilities found</p>
                    </td>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isUpdateModalOpen && (
        <UpdateModal
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          facility={selectedFacility}
          onSuccess={refetch}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          facilityId={selectedFacility?.id}
          onSuccess={refetch}
        />
      )}

      <Toaster
        position="top-center"
        toastOptions={{ className: "text-sm" }}
      />
    </>
  );
}
