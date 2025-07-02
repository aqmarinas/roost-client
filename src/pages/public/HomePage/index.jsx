import PublicLayout from "@/components/layout/PublicLayout";
import Hero from "./Hero";
import Rooms from "./Rooms";
import BookingCalendar from "./Calendar";
import FAQ from "./FAQ";
import Tutorial from "./Tutorial";
import MaintenancePage from "../MaintenancePage";

export default function RoomsPage() {
  return (
    <>
      <MaintenancePage />
      {/* <PublicLayout>
        <Hero />
        <BookingCalendar />
        <Tutorial />
        <Rooms />
        <FAQ />
      </PublicLayout> */}
    </>
  );
}
