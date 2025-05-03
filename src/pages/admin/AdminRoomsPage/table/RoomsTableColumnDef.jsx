import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { API_URL } from "@/config/config";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function RoomsTableColumnDef(onAction) {
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
      accessorKey: "name",
      header: "Room",
      enableSorting: true,
      enableHiding: false,
      cell: ({ row }) => {
        const [loading, setLoading] = useState(true);
        const imageSrc = `${API_URL}/${row.original.image}`;
        const roomName = row.original.name;

        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="relative w-24 lg:w-48 aspect-[3/2]">
              {loading && <Skeleton className="absolute inset-0 w-full h-full rounded-lg bg-gray-300" />}
              <img
                src={imageSrc}
                alt={roomName}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
                className="rounded-lg object-cover w-full h-full transition-opacity duration-300"
              />
            </div>
            <p className="text-sm font-semibold line-clamp-2">{roomName}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-gray-500">
          <UserGroupIcon className="size-5" />
          {row.original.capacity}
        </div>
      ),
      enableSorting: true,
      enableHiding: false,
      sortingFn: (rowA, rowB, columnId) => {
        const a = Number(rowA.getValue(columnId));
        const b = Number(rowB.getValue(columnId));

        return a - b;
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span className="text-sm text-gray-500 whitespace-nowrap">{row.original.location}</span>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "facilities",
      header: "Facilities",
      enableSorting: false,
      enableHiding: false,
      enableFilter: true,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.facilities?.map((facility) => (
            <span
              key={facility.id}
              className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
            >
              {facility.name}
            </span>
          ))}
        </div>
      ),
      filterFn: (row, columnId, filterValues) => {
        const facilities = row.getValue(columnId) || []; //  facilities object
        const facilityIds = facilities.map((f) => f.id);
        return filterValues.some((val) => facilityIds.includes(val));
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell
          row={row}
          onAction={onAction}
        />
      ),
      meta: {
        className: "text-center",
      },
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAction(row.original, "edit")}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction(row.original, "delete")}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
