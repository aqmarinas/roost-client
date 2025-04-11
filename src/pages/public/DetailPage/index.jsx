import React from "react";
import PublicLayout from "../../../components/layout/PublicLayout";
import Overview from "./Overview.jsx";
import { Toaster } from "react-hot-toast";
import BookForm from "../../../components/form/BookForm.jsx";

export default function DetailPage() {
  return (
    <>
      <PublicLayout>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[60%] p-4">
            <Overview />
          </div>

          <div className="w-full md:w-[40%] p-4">
            <div className="border border-indigo-100 shadow-lg rounded-lg p-4">
              <h1 className="text-2xl font-bold mb-4">Book a Meeting</h1>
              <BookForm />
            </div>
          </div>
        </div>

        <Toaster
          position="top-center"
          toastOptions={{ className: "text-sm" }}
        />
      </PublicLayout>
    </>
  );
}
