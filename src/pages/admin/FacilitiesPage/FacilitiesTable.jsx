import { DataTable } from "@/components/ui/datatable";
import { useMemo } from "react";
import { FacilitiesTableColumnDef } from "./FacilitiesTableColumnDef";

export default function FacilitiesTable({ data, onAction }) {
  const columns = useMemo(() => FacilitiesTableColumnDef(onAction), [onAction]);

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        onAction={onAction}
        enableSearch
        searchKey="name"
      />
    </div>
  );
}
