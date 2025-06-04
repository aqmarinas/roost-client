import { Link, useParams } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, Users, NotepadText, MapPin, CircleCheck, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import Input from "@/components/form/input";
import { useCallback, useEffect } from "react";
import PageSpinner from "@/components/ui/pagespinner";
import { validateDate, validateEndTime, validateStartTime } from "@/validations/validationBookings";

export default function ReschedulePage() {
  const { data: bookings, error: bookingsError } = useBookings();

  const { token } = useParams();
  const { getBookingByTokenQuery, rescheduleBookingMutation } = useBookings();
  const { data: booking, isLoading, error } = getBookingByTokenQuery(token);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    shouldFocusError: true,
    mode: "onChange",
  });

  useEffect(() => {
    if (booking) {
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
      };

      const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toTimeString().substring(0, 5); // HH:MM
      };

      setValue("date", formatDate(booking.date));
      setValue("startTime", formatTime(booking.startTime));
      setValue("endTime", formatTime(booking.endTime));
    }
  }, [booking, setValue]);

  const date = watch("date");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const checkConflict = useCallback(() => {
    if (!date || !startTime || !endTime || !bookings || !Array.isArray(bookings)) {
      clearErrors("startTime");
      return false;
    }

    const newStart = new Date(`${date}T${startTime}:00`);
    const newEnd = new Date(`${date}T${endTime}:00`);

    const hasConflict = bookings
      .filter((b) => !["Canceled", "Rejected"].includes(b.status))
      .some((b) => {
        if (b.id === booking?.id) return false;
        if (b.room_id !== booking?.room_id) return false;

        const inputDateUTC = new Date(date);
        const bookingDateUTC = new Date(b.date);
        if (inputDateUTC.toISOString().split("T")[0] !== bookingDateUTC.toISOString().split("T")[0]) return false;

        const existingStart = new Date(b.startTime);
        const existingEnd = new Date(b.endTime);

        return (newStart >= existingStart && newStart < existingEnd) || (newEnd > existingStart && newEnd <= existingEnd) || (newStart <= existingStart && newEnd >= existingEnd);
      });

    if (hasConflict) {
      setError("startTime", {
        type: "manual",
        message: "Room already booked",
      });
      return true;
    } else {
      clearErrors("startTime");
      return false;
    }
  }, [date, startTime, endTime, bookings]);

  // trigger check conflict
  useEffect(() => {
    if (date && startTime && endTime && startTime !== "" && endTime !== "") {
      checkConflict();
    }
  }, [date, startTime, endTime, checkConflict, setError, clearErrors]);

  const onSubmit = async (data) => {
    // re-check conflict cz handleSubmit clear setError
    let hasError = false;

    const conflict = checkConflict(data);
    if (conflict) {
      setError("startTime", {
        type: "manual",
        message: "Room already booked",
      });
      hasError = true;
    }

    const sameDate = data.date === new Date(booking.date).toISOString().split("T")[0];
    const sameStartTime = data.startTime === new Date(booking.startTime).toTimeString().substring(0, 5);
    const sameEndTime = data.endTime === new Date(booking.endTime).toTimeString().substring(0, 5);

    if (sameDate && sameStartTime && sameEndTime) {
      setError("startTime", {
        type: "manual",
        message: "You must choose a different schedule",
      });
      hasError = true;
    }

    if (hasError) return;

    const updatedFields = {
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    await rescheduleBookingMutation.mutateAsync({ id: booking.id, updatedData: updatedFields });
  };

  if (isLoading) return <PageSpinner />;

  if (error)
    return (
      <PublicLayout>
        <div className="max-w-xl mx-auto text-center mt-12">
          <CircleCheck className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Oops! Something went wrong</h1>
          <p className="text-muted-foreground"> We couldn't load the booking information right now. Please try again later or contact support if the problem persists.</p>
          <div className="mt-6">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    );

  if (error?.data?.message === "Booking not found")
    return (
      <PublicLayout>
        <div className="max-w-xl mx-auto text-center mt-12">
          <CircleCheck className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Invalid Link</h1>
          <p className="text-muted-foreground">The reschedule link you're trying to use has expired or is no longer valid. If you think this is a mistake, please contact support.</p>
          <div className="mt-6">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    );

  const displayStatus = booking.status === "Updated" ? "Rescheduled" : booking.status;
  if (booking.status === "Canceled" || booking.status === "Updated") {
    return (
      <PublicLayout>
        <div className="max-w-xl mx-auto text-center mt-12">
          <AlertCircle className="w-12 h-12 text-indigo-700 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Booking Already {displayStatus}</h1>
          <p className="text-muted-foreground">If you think this is a mistake, please contact support.</p>
          <div className="mt-6">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <>
      <PublicLayout>
        <div className="flex-1 container mx-auto p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-semibold text-2xl mb-6">Reschedule Booking</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{booking.eventTitle}</CardTitle>
                      <CardDescription>Booking ID: {booking.id}</CardDescription>
                    </div>
                    <Badge variant={booking.status}>{booking.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* non-editable */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <User className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Name</p>
                          <p className="text-muted-foreground">{booking.bookerName}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-muted-foreground">{booking.bookerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-muted-foreground">{booking.bookerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Room</p>
                          <p className="text-muted-foreground">{booking.room?.name}</p>
                        </div>
                      </div>
                      {booking.participants && (
                        <div className="flex items-start">
                          <Users className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Participants</p>
                            <p className="text-muted-foreground">{booking.participants}</p>
                          </div>
                        </div>
                      )}
                      {booking.notes && (
                        <div className="flex items-start">
                          <NotepadText className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Notes</p>
                            <p className="text-muted-foreground">{booking.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* editable  */}
                    <Input
                      id="date"
                      label="Date"
                      type="date"
                      min="1900-01-01"
                      max="2099-12-31"
                      {...register("date", {
                        required: "Date is required",
                        validate: validateDate,
                      })}
                      error={errors.date?.message}
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          id="startTime"
                          label="Start Time"
                          type="time"
                          {...register("startTime", {
                            required: "Start time is required",
                            validate: (value) => validateStartTime(value, date),
                          })}
                          error={errors.startTime?.message}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          id="endTime"
                          label="End Time"
                          type="time"
                          {...register("endTime", {
                            required: "End time is required",
                            validate: (value) => validateEndTime(value, date, startTime),
                          })}
                          error={errors.endTime?.message}
                          required
                        />
                      </div>
                    </div>
                    {bookingsError && <p className="text-sm text-red-500">Failed to check availability of bookings</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 items-center">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <Link to="/">Return to Home</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Reschedule"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}
