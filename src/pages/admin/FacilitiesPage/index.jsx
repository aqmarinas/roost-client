import React from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import FacilitiesHeader from "./FacilitiesHeader";
import FacilitiesTable from "./FacilitiesTable";

export default function FacilitesPage() {
  return (
    <>
      <AdminLayout>
        <FacilitiesHeader />
        <FacilitiesTable />
      </AdminLayout>
    </>
  );
}
