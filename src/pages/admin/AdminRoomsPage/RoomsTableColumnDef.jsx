import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { API_URL } from "@/config/config";

export function RoomsTableColumnDef(onAction) {
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
      accessorKey: "name",
      header: "Room",
      enableSorting: true,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <img
            className="rounded-lg object-cover aspect-3/2 w-24 lg:w-48"
            src={`${API_URL}/${row.original.image}`}
            alt={row.original.name}
          />
          <p className="text-sm font-semibold line-clamp-2">{row.original.name}</p>
        </div>
      ),
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
      filterFn: (row, columnId, filterValue) => {
        const facilities = row.getValue(columnId) || [];
        const facilityNames = facilities.map((facility) => facility.name);
        return filterValue.length === 0 || facilityNames.some((name) => filterValue.includes(name));
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
