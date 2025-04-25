import { DataTable } from "@/components/ui/datatable";
import { BookingsTableColumn, statusOptions } from "./BookingsTableColumn";
import { useMemo } from "react";

export function BookingsTable2({ data, onAction }) {
  const columns = useMemo(() => BookingsTableColumn(onAction), [onAction]);

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
