import React from "react";
import useFetch from "../../../hooks/useFetch";
import Card from "../../../components/ui/Card";

export default function RoomCards() {
  const { data: response, loading, error } = useFetch(`/rooms`);
  const rooms = response?.data || [];

  if (loading) return <p>Loading fetch rooms...</p>;
  if (error) return <p>Error</p>;

  return (
    <>
      {rooms && rooms.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Card
              key={room.id}
              id={room.id}
              name={room.name}
              capacity={room.capacity}
              location={room.location}
              link={`/rooms/${room.id}`}
              imgSrc={`http://localhost:3000/${room.image}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-44">
          <p className="text-gray-500">No rooms found.</p>
        </div>
      )}
    </>
  );
}
