import PublicLayout from "@/components/layout/PublicLayout";
import Hero from "./Hero";
import Rooms from "./Rooms";
import BookingCalendar from "./Calendar";
import FAQ from "./FAQ";
import Tutorial from "./Tutorial";

export default function RoomsPage() {
  return (
    <>
      <PublicLayout>
        <Hero />
        <BookingCalendar />
        <Tutorial />
        <Rooms />
        <FAQ />
      </PublicLayout>
    </>
  );
}
