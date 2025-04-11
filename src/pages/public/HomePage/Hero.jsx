import { Button } from "@headlessui/react";
import { Calendar } from "lucide-react";
import React, { useState } from "react";
import BookModal from "./BookModal.jsx";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative pt-14">
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                Book Meeting Rooms With <span className="text-indigo-600 font-bold">Roost</span>
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                Simplify your workday with our intuitive meeting room booking system. Find and reserve the perfect space in seconds. Save time and make your meetings more productive.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Book a Room
                </button>
              </div>

              <BookModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
