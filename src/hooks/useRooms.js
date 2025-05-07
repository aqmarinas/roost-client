import { API_URL } from "@/config/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useRooms(auth) {
  const queryClient = useQueryClient();

  const getAllRoomsQuery = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/rooms`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch rooms");
      }
      return data.data;
    },
  });

  const getRoomByIdQuery = (roomId) =>
    useQuery({
      queryKey: ["room", roomId],
      queryFn: async () => {
        const res = await fetch(`${API_URL}/rooms/${roomId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch room");
        }
        return data.data;
      },
      enabled: !!roomId,
    });

  const getBookingsByRoomId = (roomId) =>
    useQuery({
      queryKey: ["roomBookings", roomId],
      queryFn: async () => {
        const res = await fetch(`${API_URL}/rooms/${roomId}/bookings`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }
        return data.data;
      },
      enabled: !!roomId,
    });

  const createRoomMutation = useMutation({
    mutationFn: async (newRoom) => {
      const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.accessToken}` },
        body: newRoom,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add room");
      return result.data;
    },
    onSuccess: (newRoom) => {
      toast.success("Successfully added room");
      queryClient.setQueryData(["rooms"], (oldData) => {
        const updated = [newRoom, ...(oldData || [])];
        return updated.sort((a, b) => a.name.localeCompare(b.name));
      });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: updatedData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update room");
      return result.data;
    },
    onSuccess: (updatedRoom) => {
      toast.success("Room updated successfully");
      queryClient.setQueryData(["rooms"], (oldData) => {
        if (!oldData) return [updatedRoom];
        return oldData.map((room) => (room.id === updatedRoom.id ? updatedRoom : room));
      });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async (ids) => {
      const response = await fetch(`${API_URL}/rooms`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({ ids }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete room");
      return result;
    },
    onSuccess: () => {
      toast.success("Room deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete room");
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
