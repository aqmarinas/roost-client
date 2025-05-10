import Card from "@/components/ui/Card/index.jsx";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/config/config";
import { X } from "lucide-react";

export default function RoomsList({ isLoading, error, filteredRooms, paginatedRooms, roomsPerPage, currentPage, setCurrentPage }) {
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  if (isLoading) {
    return (
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Skeleton className="min-h-[200px] w-full rounded-lg" />
        <Skeleton className="min-h-[200px] w-full rounded-lg" />
        <Skeleton className="min-h-[200px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 flex items-center justify-center">
        <div className="text-center space-y-2">
          <X className="size-12 mx-auto mb-4 text-gray-500" />
          <p className="text-2xl text-gray-500 font-semibold">Oops! Something went wrong.</p>
          <p className="text-gray-500 text-base">Sorry, we couldn’t load the rooms. Please try again.</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredRooms && filteredRooms.length > 0 ? (
          paginatedRooms.map((room) => (
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
      {/* pagination */}
      {filteredRooms.length > roomsPerPage && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${currentPage === page ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
              >
                {page}
              </Button>
            );
          })}
        </div>
      )}
    </>
  );
}
