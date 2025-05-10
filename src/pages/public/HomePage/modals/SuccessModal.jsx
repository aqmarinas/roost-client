import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function SuccessModal({ data, onClose }) {
  const [meetingDetailsOpen, setMeetingDetailsOpen] = useState(true);
  const [bookerDetailsOpen, setBookerDetailsOpen] = useState(true);

  return (
    <div className="space-y-2 p-0 md:px-4">
      <h2 className="text-center text-2xl font-semibold text-gray-900">Booking Successful!</h2>
      <p className="text-center text-sm text-gray-600 mb-4">Here are your booking details:</p>

      <Alert className="mb-4 border-yellow-200 bg-yellow-50 text-yellow-800">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription className="text-gray-800">This booking requires approval from admin. You will receive an email once approved.</AlertDescription>
      </Alert>

      <Collapsible
        open={meetingDetailsOpen}
        onOpenChange={setMeetingDetailsOpen}
        className="border rounded-lg"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 rounded-t-lg">
            <div className="flex items-center gap-2 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-600" />
                <span>MEETING DETAILS</span>
              </div>
              <Badge variant={data?.status}>Dummy</Badge>
            </div>
            {meetingDetailsOpen ? <ChevronUp className="h-4 w-4 text-slate-600" /> : <ChevronDown className="h-4 w-4 text-slate-600" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-3">
          <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
            <span className="text-sm font-medium text-slate-600">Title</span>
            <span className="text-sm">{data?.eventTitle}</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
            <span className="text-sm font-medium text-slate-600">Room</span>
            <span className="text-sm">{data?.room.name}</span>
          </div>
          {data?.participants && (
            <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
              <span className="text-sm font-medium text-slate-600">Participants</span>
              <span className="text-sm">{data?.participants}</span>
            </div>
          )}
          {data?.notes && (
            <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
              <span className="text-sm font-medium text-slate-600">Notes</span>
              <span className="text-sm">{data?.notes}</span>
            </div>
          )}

          <Separator className="my-2" />

          <div className="space-y-4">
            {data?.schedules?.map((schedule, i) => (
              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-800">Schedule {i + 1}</div>
                <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Calendar className="h-3 w-3" />
                    <span>Date</span>
                  </div>
                  <span className="text-sm">{format(parseISO(schedule?.date), "EEEE, dd MMMM yyyy")}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Clock className="h-3 w-3" />
                    <span>Time</span>
                  </div>
                  <span className="text-sm">
                    {format(parseISO(schedule?.startTime), "HH:mm")} - {format(parseISO(schedule?.endTime), "HH:mm")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={bookerDetailsOpen}
        onOpenChange={setBookerDetailsOpen}
        className="border rounded-lg"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 rounded-t-lg">
            <div className="flex items-center gap-2 font-medium">
              <User className="h-4 w-4 text-slate-600" />
              <span>BOOKER DETAILS</span>
            </div>
            {bookerDetailsOpen ? <ChevronUp className="h-4 w-4 text-slate-600" /> : <ChevronDown className="h-4 w-4 text-slate-600" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-3">
          <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
            <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
              <User className="h-3 w-3" />
              <span>Name</span>
            </div>
            <span className="text-sm">{data?.bookerName}</span>
          </div>

          <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
            <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
              <Phone className="h-3 w-3" />
              <span>Phone</span>
            </div>
            <span className="text-sm">{data?.bookerPhone}</span>
          </div>

          <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
            <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
              <Mail className="h-3 w-3" />
              <span>Email</span>
            </div>
            <span className="text-sm break-all">{data?.bookerPhone}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

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
