import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { AlertCircle, Calendar, User } from "lucide-react";

export default function SuccessModal({ data, onClose }) {
  return (
    <div className="space-y-2 p-0 md:px-4">
      <h2 className="text-center text-2xl font-semibold text-gray-900">Booking Successful!</h2>
      <p className="text-center text-sm text-gray-600 mb-4">Here are your booking details:</p>

      <Alert className="mb-4 border-yellow-200 bg-yellow-50 text-yellow-800">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription className="text-gray-800">This booking requires approval from admin. You will receive an email once approved.</AlertDescription>
      </Alert>

      <div className="bg-gray-100 p-4 rounded-md text-sm space-y-6">
        {/* Meeting Details */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Meeting Details
            </h3>
            <Badge variant={data?.status}>{data?.status}</Badge>
          </div>

          <div className="grid [grid-template-columns:auto_1fr] gap-x-4 gap-y-2">
            <span className="font-semibold text-gray-900">Title</span>
            <span>: {data?.eventTitle}</span>

            <span className="font-semibold text-gray-900">Room</span>
            <span>: {data?.room?.name}</span>

            <span className="font-semibold text-gray-900">Date</span>
            <span>: {format(parseISO(data?.date), "EEEE, dd MMMM yyyy")}</span>

            <span className="font-semibold text-gray-900">Time</span>
            <span>
              : {format(parseISO(data?.startTime), "HH:mm")} - {format(parseISO(data?.endTime), "HH:mm")}
            </span>
          </div>
        </section>

        {/* Booker Information */}
        <section>
          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Booker Details
          </h3>
          <div className="grid [grid-template-columns:auto_1fr] gap-x-4 gap-y-2">
            <span className="font-semibold text-gray-900">Name</span>
            <span>: {data?.bookerName}</span>

            <span className="font-semibold text-gray-900">Phone</span>
            <span>: {data?.bookerPhone}</span>

            <span className="font-semibold text-gray-900">Email</span>
            <span>: {data?.bookerEmail}</span>
          </div>
        </section>
      </div>

      <Button
        className="mt-4 mb-2"
        fullWidth
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  );
}
