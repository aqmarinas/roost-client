import Filter from "@/components/ui/Filter";
import { DatePicker } from "@/components/ui/datepicker";
import { DataTable } from "@/components/ui/datatable";
import { BookingsTableColumn } from "./BookingsTableColumn";
import { useMemo } from "react";

export function BookingsTable2({ data, onAction }) {
  const columns = useMemo(() => BookingsTableColumn(onAction), []);

  return (
    <DataTable
      data={data}
      columns={columns}
      onAction={onAction}
      enableGlobalFilter
      globalFilterKey="eventTitle"
      datePicker={<DatePicker />}
      // customFilters={
      //   <Filter
      //     filterType="status"
      //     filterData={[
      //       { value: "pending", label: "Pending" },
      //       { value: "approved", label: "Approved" },
      //       { value: "rejected", label: "Rejected" },
      //     ]}
      //   />
      // }
    />
  );
}
