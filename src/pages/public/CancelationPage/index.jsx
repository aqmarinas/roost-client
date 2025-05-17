import { Link, useParams } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ModalDialog from "@/components/ui/ModalDialog";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Clock, MapPin, User, Phone, Mail, Users, NotepadText } from "lucide-react";
import PageSpinner from "@/components/ui/pagespinner";

export default function CancelationPage() {
  const { token } = useParams();
  const { getBookingByTokenQuery, cancelBookingMutation } = useBookings();
  const { data: booking, isLoading, error } = getBookingByTokenQuery(token);

  const [openModal, setOpenModal] = useState(false);

  const handleCancel = async () => {
    await cancelBookingMutation.mutateAsync({ id: booking.id });
    setOpenModal(false);
  };

  if (isLoading) return <PageSpinner />;

  if (error)
    return (
      <PublicLayout>
        <div className="max-w-xl mx-auto text-center mt-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Invalid Link</h1>
          <p className="text-muted-foreground">The cancellation link you're trying to use has expired or is no longer valid. If you think this is a mistake, please contact support.</p>
          <div className="mt-6">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    );

  if (booking.status === "Canceled") {
    return (
      <PublicLayout>
        <div className="max-w-xl mx-auto text-center mt-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Booking Already Canceled </h1>
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

  const isPastBooking = new Date(parseISO(booking.startTime)) < new Date();
  if (isPastBooking) {
    return (
      <PublicLayout>
        <div className="max-w-xl mx-auto text-center mt-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Booking Expired</h1>
          <p className="text-muted-foreground">This booking has already passed and can no longer be canceled. If you have any issues, please contact support.</p>
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
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Cancel Booking</h1>
              <p className="text-muted-foreground">Please review your booking details before cancellation. This action cannot be undone.</p>
            </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Room</p>
                        <p className="text-muted-foreground">{booking.room.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-muted-foreground">{format(parseISO(booking.date), "EEEE, dd MMMM yyyy")}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-muted-foreground">
                          {format(parseISO(booking.startTime), "HH:mm")} - {format(parseISO(booking.endTime), "HH:mm")}
                        </p>
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
                  </div>
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
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => setOpenModal(true)}
                  disabled={cancelBookingMutation.isLoading}
                >
                  Cancel Booking
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </PublicLayout>

      {openModal && (
        <ModalDialog
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onConfirm={handleCancel}
          title="Are you sure you want to cancel?"
          message="This action cannot be undone. The room will be made available for others to book."
        />
      )}
    </>
  );
}
