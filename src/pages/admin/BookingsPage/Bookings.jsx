import { Suspense, lazy, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import BookingsTable from "./BookingsTable";
import BookingsHeader from "./BookingsHeader";
import { API_URL } from "../../../config/config";
import { BookingsTable2 } from "./BookingsTable2";
import { useBookingMutations } from "@/hooks/useBookingMutations";
import DataTableSkeleton from "@/components/ui/datatableskeleton";

const CreateModal = lazy(() => import("../../public/HomePage/BookModal"));
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
  const { createBooking, updateBooking, deleteBooking, approveBooking, rejectBooking } = useBookingMutations(auth);

  // const endpoint = `/bookings?page=${currentPage}&limit=${itemsPerPage}`;

  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: () =>
      fetch(`${API_URL}/bookings`)
        .then((res) => res.json())
        .then((res) => res.data),
  });

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
      <BookingsHeader onAdd={() => setOpenCreate(true)} />

      {isLoading && <DataTableSkeleton columnCount={3} />}
      {error && <p className="px-4 text-red-500">Error: Cannot get bookings data</p>}

      {!isLoading && !error && (
        <>
          {/* <BookingsTable
          data={bookings}
          onAction={handleActionClick}
        /> */}
          <BookingsTable2
            data={bookings}
            onAction={handleActionClick}
          />
        </>
      )}

      <Suspense fallback={<p>Loading modal...</p>}>
        {openCreate && (
          <CreateModal
            isOpen={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreate={(data) => createBooking.mutateAsync(data).then(() => setOpenCreate(false))}
          />
        )}
        {openUpdate && (
          <UpdateModal
            isOpen={openUpdate}
            booking={selectedBooking}
            onClose={() => setOpenUpdate(false)}
            onSuccess={(data) => updateBooking.mutateAsync({ id: selectedBooking?.id, updatedData: data }).then(() => setOpenUpdate(false))}
          />
        )}
        {openDelete && (
          <DeleteModal
            isOpen={openDelete}
            onClose={() => setOpenDelete(false)}
            onSuccess={() => {
              // deleteBooking.mutate(selectedBooking.length > 1 ? selectedBooking : [selectedBooking?.id]);
              deleteBooking.mutateAsync(Array.isArray(selectedBooking) ? selectedBooking : [selectedBooking?.id]).then(() => setOpenDelete(false));
            }}
          />
        )}
        {openApprove && (
          <ApproveModal
            isOpen={openApprove}
            onClose={() => setOpenApprove(false)}
            onSuccess={() => approveBooking.mutateAsync({ id: selectedBooking?.id }).then(() => setOpenApprove(false))}
          />
        )}
        {openReject && (
          <RejectModal
            isOpen={openReject}
            onClose={() => setOpenReject(false)}
            onSuccess={() => rejectBooking.mutateAsync({ id: selectedBooking?.id }).then(() => setOpenReject(false))}
          />
        )}
      </Suspense>

      <Toaster
        position="top-center"
        toastOptions={{ className: "text-sm" }}
      />
    </>
  );
}
