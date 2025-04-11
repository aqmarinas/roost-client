import React from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import SchedulesTable from "./BookingsTable";
import Header from "./BookingsHeader";

export default function SchedulesPage() {
  return (
    <div>
      <AdminLayout>
        <Header />
        <SchedulesTable />
      </AdminLayout>
    </div>
  );
}
