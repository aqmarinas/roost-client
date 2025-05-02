import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";

export default function Filter({ id, options = [], columnFilters = [], setColumnFilters = () => {} }) {
  const currentValue = useMemo(() => {
    const found = columnFilters.find((f) => f.id === id);
    return Array.isArray(found?.value) ? found.value : [];
  }, [columnFilters, id]);

  const [selected, setSelected] = useState(currentValue);

  useEffect(() => {
    setSelected(currentValue);
  }, [currentValue]);

  const toggleValue = (val) => {
    setSelected((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  };

  // const handleApply = () => {
  //   setColumnFilters((prev) => [...prev.filter((f) => f.id !== id), { id, value: selected }]);
  // };

  const handleApply = () => {
    if (selected.length === 0) {
      setColumnFilters((prev) => prev.filter((f) => f.id !== id));
    } else {
      setColumnFilters((prev) => [...prev.filter((f) => f.id !== id), { id, value: selected }]);
    }
  };

  const handleReset = () => {
    setSelected([]);
    setColumnFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const activeCount = currentValue.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full md:w-32 flex justify-between items-center"
        >
          <span className="capitalize">{id}</span>
          {activeCount > 0 ? <span className="text-xs bg-gray-200 text-gray-900 rounded-sm px-2 py-0.5">{activeCount}</span> : <ChevronDownIcon />}
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
            variant="default"
            size="sm"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
