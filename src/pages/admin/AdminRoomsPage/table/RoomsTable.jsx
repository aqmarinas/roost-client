import { DataTable } from "@/components/data-table/data-table";
import { RoomsTableColumnDef } from "./RoomsTableColumnDef";
import { useMemo } from "react";
import { useFacilities } from "@/hooks/useFacilities";

export default function RoomsTable({ data, onAction }) {
  const columns = useMemo(() => RoomsTableColumnDef(onAction), [onAction]);

  const { data: facilities = [] } = useFacilities();
  const facilitiesOptions = facilities.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const filterableColumns = [{ id: "facilities", options: facilitiesOptions }];

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        onAction={onAction}
        search="name"
        filters={filterableColumns}
      />
    </div>
  );
}
