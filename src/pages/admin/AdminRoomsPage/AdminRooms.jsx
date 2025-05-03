import { Suspense, lazy, useState } from "react";
import useAuth from "@/hooks/useAuth";
import RoomsHeader from "./RoomsHeader";
import RoomsTable from "./table/RoomsTable";
import { useRooms } from "@/hooks/useRooms";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";

const CreateModal = lazy(() => import("./modals/CreateRoom"));
const UpdateModal = lazy(() => import("./modals/UpdateRoom"));
const DeleteModal = lazy(() => import("./modals/DeleteRoom"));

export default function AdminRooms() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { auth } = useAuth();
  const { data: rooms = [], isLoading, error, createRoomMutation, updateRoomMutation, deleteRoomMutation } = useRooms(auth);

  const handleActionClick = (room, actionType) => {
    setSelectedRoom(room);
    actionType === "edit" ? setOpenUpdate(true) : setOpenDelete(true);
  };
  return (
    <>
      <RoomsHeader
        isLoading={isLoading}
        onAdd={() => setOpenCreate(true)}
      />

      {isLoading ? (
        <DataTableSkeleton columnCount={3} />
      ) : error ? (
        <p className="py-4 text-red-500 text-sm">Error: Cannot get rooms data</p>
      ) : (
        <RoomsTable
          data={rooms}
          onAction={handleActionClick}
        />
      )}

      <Suspense fallback={<div>Load modal...</div>}>
        {openCreate && (
          <CreateModal
            isOpen={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreate={(data) => createRoomMutation.mutateAsync(data)}
          />
        )}
        {openUpdate && (
          <UpdateModal
            room={selectedRoom}
            isOpen={openUpdate}
            onClose={() => setOpenUpdate(false)}
            onSuccess={(data) => updateRoomMutation.mutateAsync({ id: selectedRoom?.id, updatedData: data })}
          />
        )}
        {openDelete && (
          <DeleteModal
            isOpen={openDelete}
            onClose={() => setOpenDelete(false)}
            onSuccess={() => {
              deleteRoomMutation.mutateAsync(Array.isArray(selectedRoom) ? selectedRoom : [selectedRoom?.id]);
            }}
          />
        )}
      </Suspense>
    </>
  );
}
