import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-date-range";
import { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangePicker({ value, onChange, onReset }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 lg:max-w-64"
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="">{value[0].startDate && value[0].endDate ? `${format(value[0].startDate, "dd MMM yyyy")} - ${format(value[0].endDate, "dd MMM yyyy")}` : "Pick a Date"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-50 p-0 bg-white shadow-lg rounded-md border w-[332px]"
        sideOffset={4}
      >
        <div className="">
          <DateRange
            ranges={value}
            onChange={(item) => onChange(item.selection)}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
            rangeColors={["#000000"]}
            direction="horizontal"
            classNames={{
              day: "text-black",
              daySelected: "bg-black text-white",
              dayToday: "border border-black",
            }}
          />
          <div className="m-2 flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
