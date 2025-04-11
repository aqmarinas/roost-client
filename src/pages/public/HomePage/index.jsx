import React from "react";
import PublicLayout from "../../../components/layout/PublicLayout";
import Hero from "./Hero";
import Rooms from "./Rooms";
import Calendar from "./Calendar";
import FAQ from "./FAQ";
import Tutorial from "./Tutorial";

export default function RoomsPage() {
  return (
    <>
      <PublicLayout>
        <Hero />
        <Calendar />
        <Tutorial />
        <Rooms />
        <FAQ />
      </PublicLayout>
    </>
  );
}
