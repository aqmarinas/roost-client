import { DataTable } from "@/components/ui/datatable";
import { RoomsTableColumnDef } from "./RoomsTableColumnDef";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { API_URL } from "@/config/config";

export default function RoomsTable({ data, onAction }) {
  const columns = useMemo(() => RoomsTableColumnDef(onAction), [onAction]);

  // filter
  const { data: facilities = [] } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/facilities`);
      const json = await res.json();
      return (json.data || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
    },
  });

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        onAction={onAction}
        enableSearch
        enableFilter
        searchKey="name"
        filterType={"facilities"}
        filterData={facilities}
      />
    </div>
  );
}
