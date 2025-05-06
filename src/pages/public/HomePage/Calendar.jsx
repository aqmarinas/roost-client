import { useBookings } from "@/hooks/useBookings";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Clock, MapPin, User } from "lucide-react";
import { startOfMonth, subMonths, addMonths, format, eachDayOfInterval, endOfWeek, startOfWeek, endOfMonth, isToday, isSameMonth, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calendar() {
  const { data: bookings = [], isLoading, error } = useBookings();

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });

    return eachDayOfInterval({ start, end }).map((date) => ({
      date,
      iso: format(date, "yyyy-MM-dd"),
      isToday: isToday(date),
      isCurrentMonth: isSameMonth(date, currentMonth),
      isSelected: selectedDate ? format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") : false,
    }));
  }, [currentMonth, selectedDate]);

  const filteredBookings = useMemo(() => {
    if (!selectedDate) return bookings;

    const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

    return bookings.filter((booking) => {
      const bookingDateStr = format(parseISO(booking.date), "yyyy-MM-dd");
      return bookingDateStr === selectedDateStr;
    });
  }, [bookings, selectedDate]);

  return (
    <div className="">
      <h2 className="text-xl font-bold text-gray-900">Upcoming Meetings</h2>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:h-[430px] lg:max-h-[600px]">
        {/* calendar */}
        <div className="mt-4 py-8 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 h-full">
          {/* navigation */}
          <div className="flex items-center justify-between text-gray-900">
            {/* Prev button */}
            <Button
              variant="ghost"
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <ChevronLeftIcon className="size-5" />
            </Button>

            <div className="flex items-center gap-6">
              <div className="text-sm font-semibold">{format(currentMonth, "MMMM yyyy")}</div>
              <Button
                variant="outline"
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(startOfMonth(today));
                  setSelectedDate(today);
                }}
              >
                Today
              </Button>
            </div>

            {/* Next button */}
            <Button
              variant="ghost"
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <ChevronRightIcon className="size-5" />
            </Button>
          </div>

          {/* day list */}
          <div className="mt-6 grid grid-cols-7 text-xs/6 text-gray-500">
            {dayNames.map((day, idx) => (
              <div key={idx}>{day}</div>
            ))}
          </div>

          {/* date */}
          <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200">
            {days.map((day, dayIdx) => (
              <button
                key={day.iso}
                type="button"
                onClick={() => setSelectedDate(day.date)}
                className={classNames(
                  "py-1.5 hover:bg-gray-100 focus:z-10",
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                  (day.isSelected || day.isToday) && "font-semibold",
                  day.isSelected && "text-white",
                  !day.isSelected && day.isCurrentMonth && !day.isToday && "text-gray-900",
                  !day.isSelected && !day.isCurrentMonth && !day.isToday && "text-gray-400",
                  day.isToday && !day.isSelected && "text-indigo-600",
                  dayIdx === 0 && "rounded-tl-lg",
                  dayIdx === 6 && "rounded-tr-lg",
                  dayIdx === days.length - 7 && "rounded-bl-lg",
                  dayIdx === days.length - 1 && "rounded-br-lg"
                )}
              >
                <time
                  dateTime={day.iso}
                  className={classNames("mx-auto flex size-7 items-center justify-center rounded-full", day.isSelected && day.isToday && "bg-indigo-600", day.isSelected && !day.isToday && "bg-gray-900")}
                >
                  {format(day.date, "d")}
                </time>
              </button>
            ))}
          </div>
        </div>

        {isLoading && <p>Loading bookings...</p>}
        {error && <p className="text-red-500">Failed to load bookings</p>}

        {/* bookings list */}
        <div className="mt-4 text-sm/6 lg:col-span-7 h-[60vh] lg:h-full overflow-y-auto">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-xl m-2 p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold mb-2 text-base">{booking.eventTitle}</h2>
                  <Badge>{booking.status}</Badge>
                </div>

                <div className="space-y-2 text-gray-600">
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                      <span>{format(parseISO(booking.date), "EEEE, dd MMMM yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span>{booking.room.name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span>
                        {format(parseISO(booking.startTime), "HH:mm")} - {format(parseISO(booking.endTime), "HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span>{booking.bookerName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div className="text-center">
                <CalendarIcon className="size-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">No bookings on this day.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
