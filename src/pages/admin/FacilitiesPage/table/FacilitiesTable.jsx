import { DataTable } from "@/components/data-table/data-table";
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
        search="name"
      />
    </div>
  );
}
