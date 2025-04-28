import React from "react";
import Card from "../../../components/ui/Card";
import useFetch from "../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { API_URL } from "@/config/config";

export default function Rooms() {
  const navigate = useNavigate();

  const { data: response, loading, error } = useFetch(`/rooms`);
  const rooms = response?.data || [];

  if (loading) return <p>Loading fetch rooms...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Our Meeting Spaces</h2>
          <p className="text-base text-gray-500">Discover the perfect space for your meeting.</p>
        </div>
      </div>
      {rooms && rooms.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.slice(0, 3).map((room) => (
              <Card
                key={room.id}
                id={room.id}
                name={room.name}
                capacity={room.capacity}
                location={room.location}
                link={`/rooms/${room.id}`}
                imgSrc={`${API_URL}/${room.image}`}
              />
            ))}
          </div>
          {rooms.length > 3 && (
            <div className="flex justify-center mt-8">
              <Button
                variant="default"
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
      ) : (
        <div className="flex items-center justify-center h-44">
          <p className="text-gray-500">No rooms found.</p>
        </div>
      )}
    </>
  );
}
