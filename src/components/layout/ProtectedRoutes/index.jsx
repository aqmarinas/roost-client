import React from "react";
import useAuth from "../../../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoutes() {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate
      to="/admin/login"
      state={{ from: location, error: "You must be logged in" }}
      replace
    />
  );
}
