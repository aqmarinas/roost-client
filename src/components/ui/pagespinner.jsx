import { useEffect, useState } from "react";
import Spinner from "./spinner";

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
      <Spinner />
    </div>
  );
}

export default PageSpinner;
