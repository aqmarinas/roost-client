import Input from "@/components/form/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronDown, ChevronDownIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Header({ filters, setFilters, locationOptions, facilitiesOptions, facilitiesLoading, isLoading, selectedFacilities, setSelectedFacilities }) {
  const isFilterActive = filters.capacity !== "" || filters.location !== "" || filters.facilities.length > 0;

  const [errMsg, setErrMsg] = useState("");
  const [selected, setSelected] = useState(selectedFacilities || []);

  useEffect(() => {
    setSelected(selectedFacilities || []);
  }, [selectedFacilities]);

  const toggleValue = (val) => {
    setSelected((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  };

  const handleApplyFacilities = () => {
    setSelectedFacilities(selected);
  };

  const handleResetFacilities = () => {
    setSelected([]);
    setSelectedFacilities([]);
  };

  const handleResetAll = () => {
    setFilters({
      capacity: "",
      location: "",
      facilities: [],
    });
    setSelectedFacilities([]);
    setErrMsg("");
  };

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

  const activeCount = selected.length;

  return (
    <div>
      {/* title */}
      <div className="mt-12 mb-8">
        <h1 className="text-center text-4xl md:text-5xl font-bold text-indigo-600">Find Your Perfect Meeting Room</h1>
      </div>

      {/* filters */}
      <div className="p-4 pt-4 md:flex mx-auto justify-center gap-4 border shadow-md rounded-lg w-full md:w-fit md:h-[135px]">
        {/* capacity */}
        <div>
          <p className="font-semibold text-sm">How many people?</p>
          <Input
            id="capacity"
            name="capacity"
            placeholder="5"
            type="number"
            min={1}
            value={filters.capacity}
            onChange={handleCapacityChange}
            className="h-10 md:w-[200px]"
          />
          {errMsg && <div className="text-red-500 mt-2 text-sm">{errMsg}</div>}
        </div>

        {/* location */}
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
              {isLoading ? (
                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
              ) : locationOptions.length === 0 ? (
                <DropdownMenuItem disabled>No items found</DropdownMenuItem>
              ) : (
                locationOptions.map((location) => (
                  <DropdownMenuItem
                    key={location}
                    onClick={() => setFilters({ ...filters, location })}
                  >
                    {location}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {isLoading ? "Load location..." : ""}
        </div>

        {/* facilities */}
        <div>
          <p className="font-semibold mt-3 md:mt-0 mb-3 text-sm">Facilities</p>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-[200px] h-10 flex justify-between items-center"
              >
                Facilities
                {activeCount > 0 ? <span className="text-xs bg-gray-200 text-gray-900 rounded-sm px-2 py-0.5">{activeCount}</span> : <ChevronDownIcon className="ml-1 h-4 w-4" />}
              </Button>
            </PopoverTrigger>
            {facilitiesLoading ? (
              "Load facilities options..."
            ) : facilitiesOptions.length === 0 ? (
              "No items found"
            ) : (
              <PopoverContent className="w-64 p-4 space-y-2">
                <div className="max-h-48 overflow-auto space-y-2">
                  {facilitiesOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Checkbox
                        checked={selected.includes(opt.value)}
                        onCheckedChange={() => toggleValue(opt.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFacilities}
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApplyFacilities}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            )}
          </Popover>
        </div>

        {isFilterActive && (
          <div className="mt-3 md:mt-0 flex items-center gap-2 justify-between">
            <Button
              className="h-10 w-full md:w-auto"
              onClick={handleResetAll}
            >
              <X className="size-4" />
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
