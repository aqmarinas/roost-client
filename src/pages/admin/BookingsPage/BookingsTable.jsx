import { DataTable } from "@/components/ui/datatable";
import { BookingsTableColumnDef, statusOptions } from "./BookingsTableColumnDef";
import { useMemo } from "react";

export default function BookingsTable({ data, onAction }) {
  const columns = useMemo(() => BookingsTableColumnDef(onAction), [onAction]);

  return (
    <DataTable
      data={data}
      columns={columns}
      onAction={onAction}
      enableSearch
      enableFilter
      enableDatePicker
      searchKey="eventTitle"
      filterType="status"
      filterData={statusOptions}
    />
  );
}
