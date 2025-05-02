import { Suspense, lazy, useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import BookingsHeader from "./BookingsHeader";
import BookingsTable from "./BookingsTable";
import DataTableSkeleton from "@/components/ui/datatableskeleton";
import { useBookings } from "@/hooks/useBookings";

const CreateModal = lazy(() => import("@/pages/public/HomePage/BookModal"));
const UpdateModal = lazy(() => import("./modals/UpdateModal"));
const DeleteModal = lazy(() => import("./modals/DeleteModal"));
const ApproveModal = lazy(() => import("./modals/ApproveModal"));
const RejectModal = lazy(() => import("./modals/RejectModal"));

export default function Bookings() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { auth } = useAuth();
  const { data: bookings = [], isLoading, error, createBookingMutation, updateBookingMutation, deleteBookingMutation, approveBookingMutation, rejectBookingMutation } = useBookings(auth);

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

      <Suspense fallback={<p>Load modal...</p>}>
        {openCreate && (
          <CreateModal
            existBooking={bookings}
            isOpen={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreate={(data) => createBookingMutation.mutateAsync(data).then(() => setOpenCreate(false))}
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
      </Suspense>
    </>
  );
}
