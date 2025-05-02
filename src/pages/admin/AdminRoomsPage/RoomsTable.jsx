import { DataTable } from "@/components/ui/datatable";
import { RoomsTableColumnDef } from "./RoomsTableColumnDef";
import { useMemo } from "react";
import { useFacilities } from "@/hooks/useFacilities";

export default function RoomsTable({ data, onAction }) {
  const columns = useMemo(() => RoomsTableColumnDef(onAction), [onAction]);

  // filter
  const { data: facilities = [] } = useFacilities();
  const facilitiesOptions = facilities.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        onAction={onAction}
        enableSearch
        enableFilter
        searchKey="name"
        id="facilities"
        options={facilitiesOptions}
      />
    </div>
  );
}
