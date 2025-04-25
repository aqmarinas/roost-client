import { useEffect, useState } from "react";

function PageSpinner() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-gray-700 text-lg font-medium">Loading{dots}</p>
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-700"></div>
    </div>
  );
}

export default PageSpinner;
