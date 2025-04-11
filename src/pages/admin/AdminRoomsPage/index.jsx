import React from "react";
import RoomsCard from "./RoomsTable";
import AdminLayout from "../../../components/layout/AdminLayout";
import Header from "./RoomsHeader";
import RoomsTable from "./RoomsTable";

export default function AdminRoomsPage() {
  return (
    <>
      <AdminLayout>
        <Header />
        <RoomsTable />
      </AdminLayout>
    </>
  );
}
