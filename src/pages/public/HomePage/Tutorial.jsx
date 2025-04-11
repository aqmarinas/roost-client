import React from "react";

export default function Tutorial() {
  return (
    <>
      <section className="w-full py-12 md:py-24 ">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">How It Works</h2>
              <p className="text-base text-gray-500">Book a meeting room in three simple steps.</p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-xl font-bold text-primary-foreground">1</div>
              <h3 className="text-xl font-bold text-indigo-600">Find a Room</h3>
              <p className="text-center text-muted-foreground text-gray-500">Search for available rooms based on date, time, and capacity.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-xl font-bold text-primary-foreground">2</div>
              <h3 className="text-xl font-bold text-indigo-600">Book It</h3>
              <p className="text-center text-muted-foreground text-gray-500">Select your preferred room and confirm your booking with a few clicks.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-xl font-bold text-primary-foreground">3</div>
              <h3 className="text-xl font-bold text-indigo-600">Meet</h3>
              <p className="text-center text-muted-foreground text-gray-500">Receive a confirmation with all details. Show up and have a productive meeting!</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
