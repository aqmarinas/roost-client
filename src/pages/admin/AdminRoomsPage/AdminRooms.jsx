import { useState } from "react";
import RoomsHeader from "./RoomsHeader";
import RoomsTable from "./table/RoomsTable";
import { useRooms } from "@/hooks/useRooms";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import CreateModal from "./modals/CreateRoom";
import UpdateModal from "./modals/UpdateRoom";
import DeleteModal from "./modals/DeleteRoom";

export default function AdminRooms() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { data: rooms = [], isLoading, error, createRoomMutation, updateRoomMutation, deleteRoomMutation } = useRooms();

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
    </>
  );
}
