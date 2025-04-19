import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import useFetch from "../../../hooks/useFetch";
import { format, parseISO } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import UpdateModal from "./modals/UpdateModal";
import DeleteModal from "./modals/DeleteModal";
import ApproveModal from "./modals/ApproveModal";
import RejectModal from "./modals/RejectModal";
import Pagination from "../../../components/ui/Pagination";

export default function BookingsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const endpoint = `/bookings?page=${currentPage}&limit=${itemsPerPage}`;
  const { data: response, loading, error, refetch } = useFetch(endpoint);

  useEffect(() => {
    refetch();
  }, [currentPage, itemsPerPage]);

  if (loading) return <p>Loading fetch bookings...</p>;
  if (error) {
    toast.error(`Error loading bookings: ${error}`);
    return <p>Error loading bookings. Please try again.</p>;
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const bookings = Array.isArray(response?.data) ? response.data : [];
  const pagination = response?.pagination || {
    total: response?.total || bookings.length,
    totalPages: response?.totalPages || Math.ceil((response?.total || bookings.length) / itemsPerPage),
    currentPage: currentPage,
    perPage: itemsPerPage,
  };

  const handleActionClick = (booking, actionType) => {
    setSelectedBooking(booking);

    switch (actionType) {
      case "edit":
        setIsUpdateModalOpen(true);
        break;
      case "delete":
        setIsDeleteModalOpen(true);
        break;
      case "approve":
        setIsApproveModalOpen(true);
        break;
      case "reject":
        setIsRejectModalOpen(true);
        break;
      default:
        console.error(`Unknown action type: ${actionType}`);
    }
  };

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="w-full overflow-x-auto">
          <div className="max-h-[calc(100vh-200px)] min-w-full overflow-y-auto">
            <div className="inline-block w-full py-2 align-middle">
              <table className="w-full divide-y divide-gray-300">
                <thead className="sticky top-0 z-10 bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Request Time
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Room
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booker
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
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
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="py-4 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-0">
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-900">{format(parseISO(booking.created_at), "MMMM dd, yyyy")}</span>
                            <span className="text-gray-500">{format(parseISO(booking.created_at), "HH:mm")}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-900 font-semibold  ">{booking.eventTitle}</td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{booking.room.name}</td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-900">{format(parseISO(booking.date), "MMMM dd, yyyy")}</span>
                            <span>
                              {format(parseISO(booking.startTime), "HH:mm")} - {format(parseISO(booking.endTime), "HH:mm")}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-900">{booking.bookerName}</span>
                            <span>{booking.bookerEmail}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {booking.status === "Pending" && <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">Pending</span>}
                          {booking.status === "Approved" && <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Approved</span>}
                          {booking.status === "Rejected" && <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">Rejected</span>}
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
                                <span className="sr-only">Options for booking {booking.id}</span>
                              </MenuButton>
                            </div>
                            <MenuItems
                              transition
                              className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                              {booking.status === "Pending" && (
                                <>
                                  <MenuItem>
                                    <div
                                      onClick={() => handleActionClick(booking, "approve")}
                                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                      Approve
                                    </div>
                                  </MenuItem>
                                  <MenuItem>
                                    <div
                                      onClick={() => handleActionClick(booking, "reject")}
                                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                      Reject
                                    </div>
                                  </MenuItem>
                                </>
                              )}

                              <div className="border-t border-gray-200"></div>
                              <MenuItem>
                                <div
                                  onClick={() => handleActionClick(booking, "edit")}
                                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                >
                                  Edit
                                </div>
                              </MenuItem>
                              <MenuItem>
                                <div
                                  onClick={() => handleActionClick(booking, "delete")}
                                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                >
                                  Delete
                                </div>
                              </MenuItem>
                            </MenuItems>
                          </Menu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8"
                      >
                        <p className="text-center text-sm text-gray-500">No request bookings found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sticky bottom-0 pt-2 pb-4">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>
      </div>

      {isUpdateModalOpen && (
        <UpdateModal
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          booking={selectedBooking}
          onSuccess={refetch}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          bookingId={selectedBooking?.id}
          onSuccess={refetch}
        />
      )}
      {isApproveModalOpen && (
        <ApproveModal
          open={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          bookingId={selectedBooking?.id}
          onSuccess={refetch}
        />
      )}
      {isRejectModalOpen && (
        <RejectModal
          open={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          bookingId={selectedBooking?.id}
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
