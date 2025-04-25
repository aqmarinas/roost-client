import { Suspense, lazy, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import BookingsTable from "./BookingsTable";
import BookingsHeader from "./BookingsHeader";
import { API_URL } from "../../../config/config";
import { BookingsTable2 } from "./BookingsTable2";

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
  const queryClient = useQueryClient();
  const { auth } = useAuth();

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

  // w/o pagination
  const createBookingMutation = useMutation({
    mutationFn: async (newBooking) => {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify(newBooking),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add booking");
      return result.data;
    },
    onSuccess: (newBooking) => {
      toast.success("Successfully added booking");
      queryClient.setQueryData(["bookings"], (oldData) => {
        const updated = [newBooking, ...(oldData || [])];
        return updated.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update booking");
      return result.data;
    },
    onSuccess: (updatedBooking) => {
      toast.success("Booking updated successfully");
      queryClient.setQueryData(["bookings"], (oldData) => {
        if (!oldData) return [updatedBooking];
        return oldData.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking));
      });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  // todo
  const deleteBookingMutation = useMutation({
    mutationFn: async (ids) => {
      // delete many
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/bookings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({ ids }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete booking");
      return result;
    },
    onSuccess: () => {
      toast.success("Booking deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setOpenDelete(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete booking");
    },
  });

  const approveBookingMutation = useMutation({
    mutationFn: async ({ id }) => {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/bookings/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to approve booking");
      return result.data;
    },
    onSuccess: (updatedBooking) => {
      toast.success("Booking approved successfully");
      queryClient.setQueryData(["bookings"], (oldData) => {
        if (!oldData) return [updatedBooking];
        return oldData.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking));
      });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const rejectBookingMutation = useMutation({
    mutationFn: async ({ id }) => {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/bookings/${id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to rejecet booking");
      return result.data;
    },
    onSuccess: (updatedBooking) => {
      toast.success("Booking rejeceted successfully");
      queryClient.setQueryData(["bookings"], (oldData) => {
        if (!oldData) return [updatedBooking];
        return oldData.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking));
      });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  if (isLoading) return <p>Loading fetch bookings...</p>;
  if (error) return <p>Error loading rooms</p>;

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
      {/* <BookingsTable
        data={bookings}
        onAction={handleActionClick}
      /> */}
      <BookingsTable2
        data={bookings}
        onAction={handleActionClick}
      />

      <Suspense fallback={null}>
        {openCreate && (
          <CreateModal
            isOpen={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreate={(data) => createBookingMutation.mutate(data)}
          />
        )}
        {openUpdate && (
          <UpdateModal
            isOpen={openUpdate}
            booking={selectedBooking}
            onClose={() => setOpenUpdate(false)}
            onSuccess={(data) => updateBookingMutation.mutate({ id: selectedBooking?.id, updatedData: data })}
          />
        )}
        {openDelete && (
          <DeleteModal
            isOpen={openDelete}
            onClose={() => setOpenDelete(false)}
            onSuccess={() => {
              deleteBookingMutation.mutate(selectedBooking);
            }}
          />
        )}
        {openApprove && (
          <ApproveModal
            isOpen={openApprove}
            onClose={() => setOpenApprove(false)}
            onSuccess={() => approveBookingMutation.mutate({ id: selectedBooking?.id })}
          />
        )}
        {openReject && (
          <RejectModal
            isOpen={openReject}
            onClose={() => setOpenReject(false)}
            onSuccess={() => rejectBookingMutation.mutate({ id: selectedBooking?.id })}
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
