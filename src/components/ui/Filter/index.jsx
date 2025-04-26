import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";

export default function Filter({ columnFilters, setColumnFilters, filterType, filterData }) {
  const filterValues = columnFilters.find((filter) => filter.id === filterType)?.value || [];

  const handleClearFilter = () => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== filterType));
  };

  const handleFilterChange = (value) => {
    setColumnFilters((prev) => {
      const filter = prev.find((f) => f.id === filterType);
      const selected = filter?.value || [];
      const newSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];

      return prev
        .filter((f) => f.id !== filterType)
        .concat({
          id: filterType,
          value: newSelected,
        });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="capitalize space-x-1.5"
        >
          {filterType}
          {filterValues.length > 0 && <span className="ml-1.5 rounded-sm bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-700 tabular-nums">{filterValues.length}</span>}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        <div className="px-3 py-2 text-sm font-semibold">Filter</div>
        <div className="max-h-56 overflow-auto">
          {filterData?.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.value}
              className="capitalize"
              checked={filterValues.includes(item.value)}
              onCheckedChange={() => handleFilterChange(item.value)}
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          ))}
        </div>

        {filterValues.length > 0 && (
          <>
            <div className="border-t" />
            <DropdownMenuItem
              onClick={handleClearFilter}
              className=" hover:bg-red-50 cursor-pointer mt-1"
            >
              <X className="text-red-600" />
              <span className="text-red-600">Reset</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
