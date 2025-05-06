import { Check, MapPinIcon, X } from "lucide-react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { API_URL } from "@/config/config";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import { useRooms } from "@/hooks/useRooms";

export default function RoomDetail() {
  const { id } = useParams();
  const { getRoomByIdQuery } = useRooms();
  const { data: room, isLoading, error } = getRoomByIdQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[320px] w-full rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    <div className="flex h-full items-center justify-center">
      <div className="text-center space-y-2">
        <X className="size-12 mx-auto mb-4 text-gray-500" />
        <p className="text-2xl text-gray-500 font-semibold">Oops! Something went wrong.</p>
        <p className="text-gray-500 text-base">Sorry, we couldn’t load the room details. Please try again later.</p>
      </div>
    </div>;
  }

  return (
    <div className="space-y-2">
      <div className="block max-w-full bg-white  border-gray-200 overflow-hidden">
        <img
          className="rounded-lg w-full object-cover aspect-3/2"
          src={`${API_URL}/${room.image}`}
          alt={room.name}
        />
      </div>

      <div className="space-y-4 p-6">
        <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>

        <div className="flex gap-4 text-gray-500">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="size-5" />
            {room.capacity} people
          </div>
          <span className="text-sm "> | </span>
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-5" />
            {room.location}
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-gray-900">Facilities</h2>
          <div className="flex flex-wrap gap-2">
            {room.facilities?.length > 0 ? (
              room.facilities?.map((facility, index) => (
                <div
                  key={index}
                  className="flex items-center rounded-md p-2 lg:p-3 text-sm font-medium border gap-2 lg:gap-3"
                >
                  <Check />
                  <span className="text-base">{facility.name}</span>
                </div>
              ))
            ) : (
              <p className="text-base text-gray-500">No facilities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
