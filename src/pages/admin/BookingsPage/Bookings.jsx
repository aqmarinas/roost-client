import { useState } from "react";
import { toast } from "react-hot-toast";
import BookingsHeader from "./BookingsHeader";
import BookingsTable from "./table/BookingsTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { useBookings } from "@/hooks/useBookings";
import UpdateModal from "./modals/UpdateBooking";
import DeleteModal from "./modals/DeleteBooking";
import ApproveModal from "./modals/ApproveBooking";
import RejectModal from "./modals/RejectBooking";
import CreateModal from "@/pages/public/HomePage/BookModal";

export default function Bookings() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: bookings = [], isLoading, error, updateBookingMutation, deleteBookingMutation, approveBookingMutation, rejectBookingMutation } = useBookings();

  const handleActionClick = (booking, actionType) => {
    setSelectedBooking(booking);
    switch (actionType) {
      case "edit":
        setOpenUpdate(true);
        break;
      case "delete":
        setOpenDelete(true);
        break;
      case "approve":
        setOpenApprove(true);
        break;
      case "reject":
        setOpenReject(true);
        break;
      default:
        toast.error(`Unknown action type: ${actionType}`);
    }
  };

  return (
    <>
      <BookingsHeader
        isLoading={isLoading}
        onAdd={() => setOpenCreate(true)}
      />

      {isLoading ? (
        <DataTableSkeleton columnCount={3} />
      ) : error ? (
        <p className="py-4 text-red-500 text-sm">Error: Cannot get bookings data</p>
      ) : (
        <BookingsTable
          data={bookings}
          onAction={handleActionClick}
        />
      )}

      {openCreate && (
        <CreateModal
          isOpen={openCreate}
          onClose={() => setOpenCreate(false)}
          // existBooking={bookings}
          // onCreate={(data) => createBookingMutation.mutateAsync({newBooking: data, auth})}
        />
      )}

      {openUpdate && (
        <UpdateModal
          existBooking={bookings}
          isOpen={openUpdate}
          booking={selectedBooking}
          onClose={() => setOpenUpdate(false)}
          onSuccess={(data) => updateBookingMutation.mutateAsync({ id: selectedBooking?.id, updatedData: data })}
        />
      )}

      {openDelete && (
        <DeleteModal
          isOpen={openDelete}
          onClose={() => setOpenDelete(false)}
          onSuccess={() => {
            deleteBookingMutation.mutateAsync(Array.isArray(selectedBooking) ? selectedBooking : [selectedBooking?.id]);
          }}
        />
      )}
      {openApprove && (
        <ApproveModal
          isOpen={openApprove}
          onClose={() => setOpenApprove(false)}
          onSuccess={() => approveBookingMutation.mutateAsync({ id: selectedBooking?.id })}
        />
      )}
      {openReject && (
        <RejectModal
          isOpen={openReject}
          onClose={() => setOpenReject(false)}
          onSuccess={() => rejectBookingMutation.mutateAsync({ id: selectedBooking?.id })}
        />
      )}
    </>
  );
}
