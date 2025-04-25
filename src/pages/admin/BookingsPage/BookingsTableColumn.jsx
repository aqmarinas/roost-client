import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function BookingsTableColumn(onAction) {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
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
      enableHiding: false,
      sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.original.date).getTime();
        const b = new Date(rowB.original.date).getTime();
        return a - b;
      },
    },
    {
      header: "Title",
      accessorKey: "eventTitle",
      cell: (row) => <span className="font-semibold text-gray-900">{row.getValue()}</span>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      header: "Room",
      accessorKey: "room.name",
      cell: (row) => <span className="text-gray-500">{row.getValue()}</span>,
      enableSorting: true,
    },
    {
      header: "Date & Time",
      accessorKey: "date",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-gray-900">{format(parseISO(row.original.date), "MMMM dd, yyyy")}</span>
          <span>
            {format(parseISO(row.original.startTime), "HH:mm")} - {format(parseISO(row.original.endTime), "HH:mm")}
          </span>
        </div>
      ),
      enableSorting: true,
      sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.original.startTime).getTime();
        const b = new Date(rowB.original.startTime).getTime();
        return a - b;
      },
    },
    {
      header: "Booker",
      accessorKey: "bookerName",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-gray-900">{row.original.bookerName}</span>
          <span className="text-gray-500">{row.original.bookerEmail}</span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusColor =
          {
            Pending: "bg-yellow-100 text-yellow-800",
            Approved: "bg-green-100 text-green-800",
            Rejected: "bg-red-100 text-red-800",
          }[status] || "";

        return <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor}`}>{status}</span>;
      },
      enableSorting: false,
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
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Open menu</span>
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
        <DropdownMenuItem onClick={() => onAction(row.original, "edit")}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction(row.original, "delete")}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
