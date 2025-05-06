import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function FacilitiesFilter({ options, selectedFacilities, setSelectedFacilities }) {
  const [selected, setSelected] = useState(selectedFacilities || []);

  useEffect(() => {
    setSelected(selectedFacilities || []);
  }, [selectedFacilities]);

  const toggleValue = (val) => {
    setSelected((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  };

  const handleApply = () => {
    setSelectedFacilities(selected);
  };

  const handleReset = () => {
    setSelected([]);
    setSelectedFacilities([]);
  };

  const activeCount = selected.length;

  return (
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
        <PopoverContent className="w-64 p-4 space-y-2">
          <div className="max-h-48 overflow-auto space-y-2">
            {options.map((opt) => (
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
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
