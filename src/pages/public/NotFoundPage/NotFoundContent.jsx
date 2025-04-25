import React from "react";
import { useNavigate } from "react-router-dom";
import NotFoundImage from "../../../assets/404.svg";
import { Button } from "@/components/ui/button";

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
        <Button
          variant="default"
          onClick={handleGoHome}
          size="lg"
          className="mt-4"
        >
          Go to Homepage
        </Button>
      </div>
    </>
  );
}
