import { useBookings } from "@/hooks/useBookings";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Clock, MapPin, User, X } from "lucide-react";
import { startOfMonth, subMonths, addMonths, format, eachDayOfInterval, endOfWeek, startOfWeek, endOfMonth, isToday, isSameMonth, parseISO } from "date-fns";
import { Suspense, lazy, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRooms } from "@/hooks/useRooms";
import { useParams } from "react-router-dom";
const CreateModal = lazy(() => import("@/pages/public/HomePage/BookModal"));

const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BookingsList() {
  const { id } = useParams();
  const { getBookingsByRoomId } = useRooms();
  const { data: bookings, isLoading, error } = getBookingsByRoomId(id);

  const [openCreate, setOpenCreate] = useState(false);
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
    if (!bookings || bookings.length === 0) return [];

    const todayStr = format(new Date(), "yyyy-MM-dd");

    // default: today
    if (!selectedDate) {
      return bookings.filter((booking) => {
        const bookingDateStr = format(parseISO(booking.date), "yyyy-MM-dd");
        return bookingDateStr === todayStr;
      });
    }

    const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
    return bookings.filter((booking) => {
      const bookingDateStr = format(parseISO(booking.date), "yyyy-MM-dd");
      return bookingDateStr === selectedDateStr;
    });
  }, [bookings, selectedDate]);

  return (
    <>
      {/* calendar */}
      <div className="text-center h-full">
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

      <Button
        className="my-4"
        fullWidth
        onClick={() => setOpenCreate(true)}
      >
        Book a room
      </Button>
      {/* bookings list */}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="w-full rounded-lg h-24" />
          <Skeleton className="w-full rounded-lg h-24" />
        </div>
      ) : error ? (
        <div className="my-4 flex h-full items-center justify-center">
          <div className="text-center space-y-2">
            <X className="size-12 mx-auto mb-4 text-gray-500" />
            <p className="text-xl text-gray-500 font-semibold">Oops! Something went wrong.</p>
            <p className="text-gray-500 text-sm">Sorry, we couldn’t load the booking schedule. Please refresh the page or try again later.</p>
          </div>
        </div>
      ) : (
        <div className="text-sm/6 h-fit max-h-[40vh] overflow-y-auto">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-xl my-4 p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold mb-2 text-base">{booking.eventTitle}</h2>
                  <Badge>{booking.status}</Badge>
                </div>

                <div className="space-y-2 text-gray-600">
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-2 pr-2">
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
              <div className="text-center py-12">
                <CalendarIcon className="size-12 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-500 text-sm">No bookings on this day.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* book modal */}
      <Suspense fallback={<p>Load modal...</p>}>
        {openCreate && (
          <CreateModal
            isOpen={openCreate}
            onClose={() => setOpenCreate(false)}
          />
        )}
      </Suspense>
    </>
  );
}
