import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function LocationFilter({ locations, filters, setFilters }) {
  return (
    <div>
      <p className="font-semibold mt-3 md:mt-0 mb-3 text-sm">Location</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-full md:w-[200px] flex items-center justify-between"
          >
            {filters.location || "Select Location"}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            key="all"
            onClick={() => setFilters({ ...filters, location: "" })}
          >
            All
          </DropdownMenuItem>
          {locations.map((location) => (
            <DropdownMenuItem
              key={location}
              onClick={() => setFilters({ ...filters, location })}
            >
              {location}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
