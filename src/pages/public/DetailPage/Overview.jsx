import { MapPinIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { API_URL } from "@/config/config";

export default function Overview() {
  const { id } = useParams();

  const { data: response, loading, error } = useFetch(`/rooms/${id}`);
  const room = response?.data || [];

  if (loading) return <p>Loading fetch detail room...</p>;

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="block max-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <img
          className="rounded-lg w-full object-cover aspect-3/2"
          src={`${API_URL}/${room.image}`}
          alt={room.name}
        />
      </div>

      <div className="mt-8 space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">{room.name}</h1>
        <div className="flex gap-4">
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

        <div className="space-y-2 mt-8">
          <h2 className="text-xl font-semibold text-gray-900">Facility</h2>
          <div className="flex flex-wrap gap-2">
            {room.facilities?.length > 0 ? (
              room.facilities?.map((facility, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                >
                  {facility.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">No facilities</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
