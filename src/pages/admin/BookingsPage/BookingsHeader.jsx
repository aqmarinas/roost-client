import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function BookingsHeader({ onAdd, isLoading }) {
  return (
    <>
      <div className="space-y-4 md:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="px-2 md:px-0">
            <h1 className="text-2xl font-bold text-gray-900 ">Bookings</h1>
            <p className="text-sm text-gray-500">Manage all meeting room bookings.</p>
          </div>
          {!isLoading && (
            <Button
              variant="default"
              onClick={onAdd}
            >
              <PlusIcon className="size-5" />
              Add Booking
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
