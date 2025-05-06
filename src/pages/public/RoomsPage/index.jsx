import PublicLayout from "@/components/layout/PublicLayout";
import { useRooms } from "@/hooks/useRooms";
import { useState, useEffect } from "react";
import Header from "./Header";
import RoomsList from "./RoomsList";
import { useFacilities } from "@/hooks/useFacilities";

export default function RoomsPage() {
  const { data: rooms = [], isLoading, error } = useRooms();
  const { data: facilities = [] } = useFacilities();

  const locationOptions = [...new Set(rooms.map((room) => room.location))];
  const facilitiesOptions = facilities.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    capacity: "",
    location: "",
    facilities: [],
  });

  const filteredRooms = rooms.filter((room) => {
    if (filters.capacity && room.capacity < Number(filters.capacity)) return false;
    if (filters.location && room.location !== filters.location) return false;
    if (filters.facilities.length > 0) {
      const facilityIds = room.facilities.map((f) => f.id);
      const hasAll = filters.facilities.every((f) => facilityIds.includes(f));
      if (!hasAll) return false;
    }
    return true;
  });

  const roomsPerPage = 6;
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
        locationOptions={locationOptions}
        facilitiesOptions={facilitiesOptions}
        selectedFacilities={filters.facilities}
        setSelectedFacilities={(val) => setFilters((prev) => ({ ...prev, facilities: val }))}
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
