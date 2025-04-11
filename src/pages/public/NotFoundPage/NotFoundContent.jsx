import React from "react";
import { useNavigate } from "react-router-dom";
import NotFoundImage from "../../../assets/404.svg";

export default function NotFoundContent() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <img
          className="w-64"
          src={NotFoundImage}
          alt="404 Not Found"
        />
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl ">Page Not Found</p>
        <p className="mt-2 text-sm text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
        <button
          onClick={handleGoHome}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-sm"
        >
          Go to Homepage
        </button>
      </div>
    </>
  );
}
