import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MultiSelect({ items = [], selectedItems = [], onChange = () => {}, labelKey = "name", valueKey = "id", isLoading = false, id, required = false, label, error }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleItem = (id) => {
    const newSelected = selectedItems.includes(id) ? selectedItems.filter((item) => item !== id) : [...selectedItems, id];
    onChange(newSelected);
  };

  const removeItem = (id) => {
    onChange(selectedItems.filter((item) => item !== id));
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => item[labelKey].toLowerCase().includes(search.toLowerCase()));
  }, [items, labelKey, search]);

  return (
    <>
      <div>
        <label
          htmlFor={id}
          className="block text-sm/6 font-semibold text-gray-900 mt-3"
        >
          {label ?? ""}
          {required && <span className="text-red-500"> *</span>}
        </label>
      </div>
      <div className="my-2">
        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn("w-full justify-between", error ? "border-red-500" : "")}
              disabled={isLoading}
            >
              {isLoading ? <span className="flex items-center gap-2">Loading options...</span> : selectedItems.length > 0 ? `${selectedItems.length} selected` : `Select ${label}`}
              {!isLoading && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full md:w-[400px] max-h-60 p-2 z-50"
            sideOffset={8}
            align="start"
          >
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <Loader2 className="mx-auto animate-spin w-5 h-5" />
                <div>Loading options...</div>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder={`Search ${label}...`}
                  className="w-full mb-2 px-3 py-2 text-sm border rounded"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground px-2">No items found.</p>
                  ) : (
                    filteredItems.map((item) => {
                      const itemId = item[valueKey];
                      const isSelected = selectedItems.includes(itemId);
                      return (
                        <div
                          key={itemId}
                          onClick={() => toggleItem(itemId)}
                          className={cn("flex items-center px-3 py-1.5 text-sm cursor-pointer rounded hover:bg-gray-100", isSelected ? "bg-indigo-50" : "")}
                        >
                          <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-white" : "bg-white")}>{isSelected && <Check className="h-4 w-4" />}</div>
                          {item[labelKey]}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>

        {Array.isArray(selectedItems) && selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedItems.map((id) => {
              const item = items.find((i) => i[valueKey] === id);
              return (
                <Badge
                  key={id}
                  className="flex items-center gap-1 pr-1"
                  variant="indigo"
                >
                  {item?.[labelKey]}
                  <div
                    onClick={() => removeItem(id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-indigo-200 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-indigo-800 hover:text-indigo-700" />
                  </div>
                </Badge>
              );
            })}
          </div>
        )}
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    </>
  );
}
