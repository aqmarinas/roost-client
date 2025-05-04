import PublicLayout from "@/components/layout/PublicLayout";
import { useRooms } from "@/hooks/useRooms";
import { useState, useEffect } from "react";
import Header from "./Header";
import RoomsList from "./RoomsList";

export default function RoomsPage() {
  const { data: rooms = [], isLoading, error } = useRooms();
  const locations = [...new Set(rooms.map((room) => room.location))];

  const roomsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [errMsg, setErrMsg] = useState("");
  const [filters, setFilters] = useState({
    capacity: "",
    location: "",
  });

  const filteredRooms = rooms.filter((room) => {
    if (filters.capacity && room.capacity < Number(filters.capacity)) return false;
    if (filters.location && room.location !== filters.location) return false;
    return true;
  });

  const paginatedRooms = filteredRooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);

  // reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <PublicLayout>
      <Header
        filters={filters}
        setFilters={setFilters}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
        locations={locations}
      />
      <RoomsList
        isLoading={isLoading}
        error={error}
        filteredRooms={filteredRooms}
        paginatedRooms={paginatedRooms}
        roomsPerPage={roomsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </PublicLayout>
  );
}
