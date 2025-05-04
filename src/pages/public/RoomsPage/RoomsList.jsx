import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/config/config";

export default function RoomsList({ isLoading, roomsError, filteredRooms, paginatedRooms, roomsPerPage, currentPage, setCurrentPage }) {
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  return (
    <>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="min-h-[250px] w-full rounded-lg" />
            <Skeleton className="min-h-[250px] w-full rounded-lg" />
            <Skeleton className="min-h-[250px] w-full rounded-lg" />
          </>
        ) : roomsError ? (
          <div className="col-span-3 h-48 flex items-center justify-center">
            <p className="text-gray-500">No rooms found.</p>
          </div>
        ) : filteredRooms && filteredRooms.length > 0 ? (
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
