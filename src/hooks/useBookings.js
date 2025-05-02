import { API_URL } from "@/config/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useBookings(auth) {
  const queryClient = useQueryClient();

  const getAllBookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/bookings`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }
      return data.data;
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (newBooking) => {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(newBooking),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to add booking");
      return result.data;
    },
    onSuccess: (newBooking) => {
      toast.success("Booking added!");
      queryClient.setQueryData(["bookings"], (old = []) => [newBooking, ...old].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    },
    onError: (err) => toast.error(err.message),
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(updatedData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update booking");
      return result.data;
    },
    onSuccess: (updatedBooking) => {
      toast.success("Booking updated!");
      queryClient.setQueryData(["bookings"], (old = []) => old.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (ids) => {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({ ids }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to delete booking");
      return result;
    },
    onSuccess: () => {
      toast.success("Booking deleted");
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (err) => toast.error(err.message),
  });

  const approveBookingMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await fetch(`${API_URL}/bookings/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to approve");
      return result.data;
    },
    onSuccess: (updatedBooking) => {
      toast.success("Approved");
      queryClient.setQueryData(["bookings"], (old = []) => old.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
    },
    onError: (err) => toast.error(err.message),
  });

  const rejectBookingMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await fetch(`${API_URL}/bookings/${id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to reject");
      return result.data;
    },
    onSuccess: (updatedBooking) => {
      toast.success("Rejected");
      queryClient.setQueryData(["bookings"], (old = []) => old.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
    },
    onError: (err) => toast.error(err.message),
  });

  return {
    ...getAllBookingsQuery,
    createBookingMutation,
    updateBookingMutation,
    deleteBookingMutation,
    approveBookingMutation,
    rejectBookingMutation,
  };
}
