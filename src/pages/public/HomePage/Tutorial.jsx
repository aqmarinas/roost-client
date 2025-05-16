const steps = [
  {
    title: "Find a Room",
    description: "Search for available rooms based on date, time, and capacity.",
  },
  {
    title: "Book It",
    description: "Select your preferred room and confirm your booking with a few clicks.",
  },
  {
    title: "Meet",
    description: "Receive a confirmation with all details. Show up and have a productive meeting!",
  },
];

export default function Tutorial() {
  return (
    <div className=" w-full py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Tutorial</h2>
          <p className="text-base text-gray-500">Book a meeting room in three simple steps.</p>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-2 rounded-lg p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-xl font-bold">{index + 1}</div>
            <h3 className="text-xl font-bold text-indigo-600">{step.title}</h3>
            <p className="text-center text-gray-500">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
