import React, { useState } from "react";
import { EllipsisHorizontalIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import useFetch from "../../../hooks/useFetch";
import { Toaster } from "react-hot-toast";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";

export default function RoomsTable() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { data: response, loading, error, refetch } = useFetch(`/rooms`);
  const rooms = response?.data || [];

  if (loading) return <p>Loading fetch rooms...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleActionClick = (room, actionType) => {
    setSelectedRoom(room);
    actionType === "edit" ? setIsUpdateModalOpen(true) : setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="w-full overflow-x-auto">
          <div className="max-h-[calc(100vh-200px)] min-w-full overflow-y-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="w-full divide-y divide-gray-300">
                <thead className="sticky top-0 z-10 bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Room
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Capacity
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Facilities
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
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <tr key={room.id}>
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <img
                              className="rounded-lg object-cover aspect-3/2 w-24 lg:w-48"
                              src={`http://localhost:3000/${room.image}`}
                              alt={room.name}
                            />
                            <p className="text-sm font-semibold line-clamp-2">{room.name}</p>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="size-5" />
                            {room.capacity}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{room.location}</td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <div className="flex flex-wrap gap-2">
                            {room.facilities?.map((facility) => (
                              <span
                                key={facility.id}
                                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                              >
                                {facility.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-3 text-sm font-medium whitespace-nowrap text-center">
                          {/* dropdown */}
                          <Menu
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <div>
                              <MenuButton className="text-indigo-600 hover:text-indigo-900 focus:outline-none">
                                <EllipsisHorizontalIcon className="size-5" />
                                <span className="sr-only">Options for room {room.id}</span>
                              </MenuButton>
                            </div>
                            <MenuItems
                              transition
                              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                              <div className="py-1">
                                <MenuItem>
                                  <div
                                    onClick={() => handleActionClick(room, "edit")}
                                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer"
                                  >
                                    Edit
                                  </div>
                                </MenuItem>
                                <MenuItem>
                                  <div
                                    onClick={() => handleActionClick(room, "delete")}
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
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 text-center text-gray-500 text-sm"
                      >
                        No rooms found
                      </td>
                    </tr>
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
          room={selectedRoom}
          onSuccess={refetch}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          roomId={selectedRoom?.id}
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
