import NotFoundImage from "@/assets/404.svg";

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-bold text-indigo-700">Roost</h1>
      <img
        className="w-64 mb-6"
        src={NotFoundImage}
        alt="Maintenance"
      />
      <h1 className="text-4xl font-bold text-gray-900">Oops!</h1>
      <p className="mt-2 text-xl font-semibold text-gray-800">Sorry, this page is temporarily unavailable.</p>
      <p className="mt-2 text-sm text-gray-500">The server has been intentionally shut down. Please check back later.</p>
    </div>
  );
}
