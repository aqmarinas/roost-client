import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Can I cancel my booking?",
    answer: "Yes. You'll receive a confirmation email containing all booking details and a cancellation link.",
  },
  {
    question: "Can I reschedule my booking?",
    answer: "Currently, rescheduling is not supported directly. If you need to change the time or date, please cancel your existing booking using the cancellation link in your email, then make a new booking.",
  },
  {
    question: "Do all bookings require admin approval?",
    answer: (
      <>
        <p className="text-gray-500">No. Only these require admin approval:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Booking for future dates,</li>
          <li>Second or third bookings even if for today,</li>
          <li>or if auto-approval conditions are not met.</li>
        </ul>
      </>
    ),
  },
  {
    question: "What is auto-approval and when does it apply?",
    answer: (
      <>
        <p className="text-gray-500">Auto-approval allows a booking to be approved automatically without admin review. Auto-approval applies in two situations:</p>
        <ol
          className="list-decimal list-inside mt-2 space-y-1"
          type="1"
        >
          <li>You make a same-day (today)/urgent booking and meet the following conditions: the room is still available, you haven't made any other booking today, and you are booking only one time slot,</li>
          <li>
            You made a booking from far away, but it remains unapproved by the admin until the day of the meeting. If the room is still available and you haven't already received an auto-approval for today, the system will approve it
            automatically before the start time.
          </li>
        </ol>
      </>
    ),
  },
  {
    question: "How many bookings can be auto-approved per day?",
    answer: "Only one booking per user per day is eligible for auto-approval. Additional bookings for the same day will remain pending and require admin approval.",
  },
  {
    question: "Why can only one booking be auto-approved per day?",
    answer: "To prioritize urgent or same-day use. Multiple bookings usually involve future planning and require admin validation to prevent scheduling conflicts.",
  },
  {
    question: "What if the user has booked from far away but has not been approved by the admin until the day of the meeting?",
    answer:
      "If the booking is still pending on the day of the meeting, and the room is available, and you haven't received any auto-approval for today, your booking will be automatically approved before the start time. Please stay alert for an email notification.",
  },
  {
    question: "Can I book a meeting room for a urgent meeting?",
    answer: "Yes. If you make a same-day/urgent booking and meet the auto-approval conditions, it will be approved instantly—even for urgent needs.",
  },
  {
    question: "Why is auto-approval limited to same-day bookings only?",
    answer: "To prevent abuse. Auto-approving future bookings could allow users to block time slots unnecessarily.",
  },
  {
    question: "Can I get auto-approved for bookings on future dates?",
    answer: "No. Auto-approval only applies to bookings for today. All bookings for future dates are pending and require admin review.",
  },
  {
    question: "What happens if I book multiple times for the same day?",
    answer: "All of your bookings for that day will remain in pending status and require admin approval.",
  },
  {
    question: "How many time slots can I include in a single booking?",
    answer: "You can include up to 3 time slots in one booking.",
  },
  {
    question: "What are the rules for OTP (One-Time Password) verification?",
    answer: "OTP is only sent if you haven't received one in the last 30 minutes. It's required to verify your booking.",
  },
];

export default function FAQ() {
  return (
    <div className="mx-auto max-w-7xl py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-4xl text-center font-semibold tracking-tight text-balance text-gray-900 mb-8 sm:text-5xl">Frequently Asked Questions (FAQ)</h2>
        <Accordion
          type="single"
          collapsible
          className="w-full"
        >
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
            >
              <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
              <AccordionContent className="text-gray-500 text-sm text-justify">{typeof item.answer === "string" ? <p className="text-gray-500">{item.answer}</p> : item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
