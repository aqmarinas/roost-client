import Card from "@/components/ui/Card/index.jsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/config";
import { useRooms } from "@/hooks/useRooms";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

export default function Rooms() {
  const navigate = useNavigate();
  const { data: rooms = [], isLoading, error } = useRooms();

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Our Meeting Spaces</h2>
          <p className="text-base text-gray-500">Discover the perfect space for your meeting.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="min-h-[200px] w-full rounded-lg" />
            <Skeleton className="min-h-[200px] w-full rounded-lg" />
            <Skeleton className="min-h-[200px] w-full rounded-lg" />
          </>
        ) : error ? (
          <div className="col-span-3 mt-12 flex items-center justify-center">
            <div className="text-center space-y-2">
              <X className="size-12 mx-auto mb-4 text-gray-500" />
              <p className="text-2xl text-gray-500 font-semibold">Oops! Something went wrong.</p>
              <p className="text-gray-500 text-base">Sorry, we couldn’t load the rooms. Please try again.</p>
            </div>
          </div>
        ) : rooms && rooms.length > 0 ? (
          rooms.slice(0, 3).map((room) => (
            <Card
              key={room.id}
              id={room.id}
              name={room.name}
              capacity={room.capacity}
              location={room.location}
              link={`/rooms/${room.id}`}
              imgSrc={`${API_URL}/${room.image}`}
            />
          ))
        ) : (
          <div className="col-span-3 text-center my-8">
            <p className="text-gray-500">No rooms found.</p>
          </div>
        )}
      </div>

      {/* navigate to rooms */}
      {rooms.length > 3 && (
        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            className="mt-4"
            onClick={() => {
              navigate("/rooms", { replace: true });
            }}
          >
            Explore More Rooms
          </Button>
        </div>
      )}
    </>
  );
}
