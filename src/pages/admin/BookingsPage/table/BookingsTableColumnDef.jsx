import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function BookingsTableColumnDef(onAction) {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "created_at",
      header: "Request Time",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-gray-900">{format(parseISO(row.original.created_at), "MMMM dd, yyyy")}</span>
          <span className="text-gray-500">{format(parseISO(row.original.created_at), "HH:mm")}</span>
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
      sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.original.date).getTime();
        const b = new Date(rowB.original.date).getTime();
        return a - b;
      },
    },
    {
      header: "Title",
      accessorKey: "eventTitle",
      cell: (row) => <span className="font-semibold text-gray-900 block min-w-[200px] max-w-[250px] break-words whitespace-normal">{row.getValue()}</span>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "room",
      header: "Room",
      accessorKey: "room.name",
      cell: (row) => <span className="text-gray-900 font-semibold">{row.getValue() ?? "undefined (need refresh)"}</span>, //todo: "named" in deeply nested key "room.name" returned undefined while reject/accepted (sometimes)
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        return filterValue.length === 0 || filterValue.includes(row.getValue(columnId));
      },
    },
    {
      header: "Date & Time",
      accessorKey: "date",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-gray-900">{format(parseISO(row.original.date), "MMMM dd, yyyy")}</span>
          <span className="text-gray-500">
            {format(parseISO(row.original.startTime), "HH:mm")} - {format(parseISO(row.original.endTime), "HH:mm")}
          </span>
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
      enableFilter: true,
      sortingFn: (rowA, rowB) => {
        const a = new Date(rowA.original.startTime).getTime();
        const b = new Date(rowB.original.startTime).getTime();
        return a - b;
      },
      filterFn: (row, columnId, filterValue) => {
        const rowDate = new Date(row.original[columnId]);
        const { startDate, endDate } = filterValue?.[0] || {};

        if (!startDate || !endDate) return true;

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return rowDate >= start && rowDate <= end;
      },
    },
    {
      header: "Booker",
      accessorKey: "bookerName",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 max-w-[200px] break-words whitespace-normal">
          <span className="text-gray-900">{row.original.bookerName}</span>
          <span className="text-gray-500">{row.original.bookerPhone}</span>
          <span className="text-gray-500">{row.original.bookerEmail}</span>
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status}>{status}</Badge>;
      },
      enableSorting: false,
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        return filterValue.length === 0 || filterValue.includes(row.getValue(columnId));
      },
    },
    {
      header: "Participants",
      accessorKey: "participants",
      cell: (row) => {
        const participants = row.getValue();
        return <span className={`block min-w-[50px] max-w-[250px] break-words whitespace-normal text-gray-500 ${!participants?.toString().trim() ? "text-center" : ""}`}>{participants?.toString().trim() ? participants : "-"}</span>;
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      header: "Notes",
      accessorKey: "notes",
      cell: (row) => {
        const notes = row.getValue();
        return <span className={`block min-w-[50px] max-w-[250px] break-words whitespace-normal text-gray-500 ${!notes?.toString().trim() ? "text-center" : ""}`}>{notes?.toString().trim() ? notes : "-"}</span>;
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionsCell
          row={row}
          onAction={onAction}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionsCell({ row, onAction }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-center"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {row.original.status === "Pending" && (
          <>
            <DropdownMenuItem onClick={() => onAction(row.original, "approve")}>Approve</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(row.original, "reject")}>Reject</DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        {row.original.status === "Pending" || row.original.status === "Approved"}
        <DropdownMenuItem onClick={() => onAction(row.original, "edit")}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction(row.original, "delete")}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
