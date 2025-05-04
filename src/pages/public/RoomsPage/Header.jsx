import Input from "@/components/form/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Header({ filters, setFilters, errMsg, setErrMsg, locations }) {
  const handleCapacityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrMsg("");
    } else if (value < 1) {
      setErrMsg("Capacity must be at least 1");
    } else {
      setErrMsg("");
    }
    setFilters({ ...filters, capacity: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* title */}
      <div className="md:max-w-md flex items-center justify-center">
        <h1 className="mt-8 text-center md:text-left md:mt-0 text-4xl md:text-5xl font-bold text-indigo-600">
          Find Your Perfect <br /> Meeting Room
        </h1>
      </div>

      {/* filters */}
      <div className="col-span-2 rounded-lg shadow-md flex mx-auto gap-4 p-4 h-fit lg:px-8 lg:py-6 mb-4">
        <div>
          <p className="font-semibold">How many people?</p>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            value={filters.capacity}
            onChange={handleCapacityChange}
            className="h-10 w-[200px]"
          />
          {errMsg && <div className="text-red-500 mt-2 text-sm">{errMsg}</div>}
        </div>
        <div>
          <p className="font-semibold mb-3">Location</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-[200px] flex items-center justify-between"
              >
                {filters.location || "Select Location"}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent akigh="start">
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
      </div>
    </div>
  );
}
