import { DataTable } from "@/components/data-table/data-table";
import { BookingsTableColumnDef } from "./BookingsTableColumnDef";
import { useMemo } from "react";
import { useRooms } from "@/hooks/useRooms";

export default function BookingsTable({ data, onAction }) {
  const columns = useMemo(() => BookingsTableColumnDef(onAction), [onAction]);

  const { data: rooms = [] } = useRooms();
  const roomOptions = rooms.map((item) => ({
    label: item.name,
    value: item.name,
  }));

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Canceled", label: "Canceled" },
    // { value: "Updated", label: "Updated" },
  ];

  const filterableColumns = [
    { id: "status", options: statusOptions },
    { id: "room", options: roomOptions },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      onAction={onAction}
      enableDatePicker
      search="eventTitle"
      filters={filterableColumns}
    />
  );
}
