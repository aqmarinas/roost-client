import PublicLayout from "@/components/layout/PublicLayout";
import RoomDetail from "./RoomDetail";
import BookingsList from "./BookingsList";

export default function DetailPage() {
  return (
    <PublicLayout>
      <div className="flex flex-col lg:flex-row space-x-4 space-y-8 lg:space-y-0">
        <div className="w-full lg:w-[50%]">
          <RoomDetail />
        </div>
        <div className="w-full lg:w-[50%]">
          <div className="border rounded-lg p-4">
            <BookingsList />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
