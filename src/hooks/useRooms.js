import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAxiosPrivate from "./useAxiosPrivate";
import axios from "@/lib/axios";

export function useRooms() {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const getAllRoomsQuery = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axios.get("/rooms");
      return res.data.data;
    },
  });

  const getRoomByIdQuery = (roomId) =>
    useQuery({
      queryKey: ["room", roomId],
      queryFn: async () => {
        const res = await axios.get(`/rooms/${roomId}`);
        return res.data.data;
      },
      enabled: !!roomId,
    });

  const getBookingsByRoomId = (roomId) =>
    useQuery({
      queryKey: ["roomBookings", roomId],
      queryFn: async () => {
        const res = await axios.get(`/rooms/${roomId}/bookings`);
        return res.data.data;
      },
      enabled: !!roomId,
    });

  const createRoomMutation = useMutation({
    mutationFn: async (newRoom) => {
      const res = await axiosPrivate.post("/rooms", newRoom);
      return res.data.data;
    },
    onSuccess: (newRoom) => {
      toast.success("Successfully added room");
      queryClient.setQueryData(["rooms"], (oldData) => {
        const updated = [newRoom, ...(oldData || [])];
        return updated.sort((a, b) => a.name.localeCompare(b.name));
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create room");
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await axiosPrivate.patch(`/rooms/${id}`, updatedData);
      return res.data.data;
    },
    onSuccess: (updatedRoom) => {
      toast.success("Room updated successfully");
      queryClient.setQueryData(["rooms"], (oldData) => {
        if (!oldData) return [updatedRoom];
        return oldData.map((room) => (room.id === updatedRoom.id ? updatedRoom : room));
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update room");
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async (ids) => {
      const res = await axiosPrivate.delete("/rooms", { data: { ids } });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Room deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete room");
    },
  });

  return {
    ...getAllRoomsQuery,
    getRoomByIdQuery,
    getBookingsByRoomId,
    createRoomMutation,
    updateRoomMutation,
    deleteRoomMutation,
  };
}
