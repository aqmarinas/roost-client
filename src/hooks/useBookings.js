import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAxiosPrivate from "./useAxiosPrivate";
import axios from "@/lib/axios";

export function useBookings() {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const getAllBookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await axios.get("/bookings");
      return res.data.data;
    },
  });

  const getBookingByTokenQuery = (token) =>
    useQuery({
      queryKey: ["booking", token],
      queryFn: async () => {
        const res = await axios.get(`/bookings/token/${token}`);
        return res.data.data;
      },
      enabled: !!token,
    });

  const createBookingMutation = useMutation({
    mutationFn: async ({ newBooking }) => {
      const res = await axios.post("/bookings", newBooking);
      return res.data.data;
    },
    onSuccess: (newBooking, variables) => {
      const { auth } = variables;

      // queryClient.setQueryData(["bookings"], (old = []) => [newBooking, ...old].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      queryClient.invalidateQueries(["bookings"]);

      if (auth?.accessToken) {
        toast.success("Booking created successfully");
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create booking"),
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await axiosPrivate.patch(`/bookings/${id}`, updatedData);
      return res.data.data;
    },
    onSuccess: (updatedBooking) => {
      toast.success("Booking updated successfully");
      queryClient.setQueryData(["bookings"], (old = []) => old.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update booking"),
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (ids) => {
      const res = await axiosPrivate.delete("/bookings", { data: { ids } });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Booking(s) deleted successfully");
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete booking(s)"),
  });

  const approveBookingMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await axiosPrivate.patch(`/bookings/${id}/approve`);
      return res.data.data;
    },
    onSuccess: (updatedBooking) => {
      toast.success("Booking approved");
      queryClient.setQueryData(["bookings"], (old = []) => old.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to approve booking"),
  });

  const rejectBookingMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await axiosPrivate.patch(`/bookings/${id}/reject`);
      return res.data.data;
    },
    onSuccess: (updatedBooking) => {
      toast.success("Booking rejected");
      queryClient.setQueryData(["bookings"], (old = []) => old.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to reject booking"),
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await axios.patch(`/bookings/${id}/cancel`);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Booking canceled");
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to cancel booking"),
  });

  return {
    ...getAllBookingsQuery,
    getBookingByTokenQuery,
    createBookingMutation,
    updateBookingMutation,
    deleteBookingMutation,
    approveBookingMutation,
    rejectBookingMutation,
    cancelBookingMutation,
  };
}
