import { Suspense, lazy, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import RoomsHeader from "./RoomsHeader";
import RoomsTable from "./RoomsTable";
const CreateModal = lazy(() => import("./modals/CreateModal"));
const UpdateModal = lazy(() => import("./modals/UpdateModal"));
const DeleteModal = lazy(() => import("./modals/DeleteModal"));

export default function AdminRooms() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_LOCAL_API}/rooms
      `)
        .then((res) => res.json())
        .then((res) => res.data),
  });

  // facilities (for filtering)
  const { data: facilities = [] } = useQuery({
    queryKey: ["facilities"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_LOCAL_API}/facilities
      `)
        .then((res) => res.json())
        .then((res) => (res.data || []).map((f) => f.name)),
  });

  const createRoomMutation = useMutation({
    mutationFn: async (newRoom) => {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/rooms`, {
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
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/rooms/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(updatedData),
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

  // soft delete
  const deleteRoomMutation = useMutation({
    mutationFn: async (ids) => {
      // delete many
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/rooms`, {
        method: "DELETE", // todo: PATCH?
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
      setOpenDelete(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete room");
    },
  });

  if (isLoading) return <p>Loading fetch rooms...</p>;
  if (error) toast.error(`Error loading rooms`);

  const handleActionClick = (room, actionType) => {
    setSelectedRoom(room);
    actionType === "edit" ? setOpenUpdate(true) : setOpenDelete(true);
  };
  return (
    <>
      <RoomsHeader onAdd={() => setOpenCreate(true)} />
      <RoomsTable
        data={rooms}
        filterData={facilities}
        onAction={handleActionClick}
      />

      <Suspense fallback={null}>
        {openCreate && (
          <CreateModal
            isOpen={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreate={(data) => createRoomMutation.mutate(data)}
          />
        )}
        {openUpdate && (
          <UpdateModal
            room={selectedRoom}
            isOpen={openUpdate}
            onClose={() => setOpenUpdate(false)}
            onSuccess={(data) => updateRoomMutation.mutate({ id: selectedRoom?.id, updatedData: data })}
          />
        )}
        {openDelete && (
          <DeleteModal
            isOpen={openDelete}
            onClose={() => setOpenDelete(false)}
            onSuccess={() => {
              deleteRoomMutation.mutate(selectedRoom);
            }}
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
