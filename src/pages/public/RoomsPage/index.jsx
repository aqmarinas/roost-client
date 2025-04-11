import React from "react";
import PublicLayout from "../../../components/layout/PublicLayout";
import RoomCards from "./RoomCards";
import SearchFilters from "./SearchFilters";
import Header from "./Header";

export default function RoomsPage() {
  return (
    <>
      <PublicLayout>
        <Header />
        <SearchFilters />
        <RoomCards />
      </PublicLayout>
    </>
  );
}
