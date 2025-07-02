import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import RoomsPage from "./pages/public/RoomsPage";
import LoginPage from "./pages/admin/LoginPage";
import BookingsPage from "./pages/admin/BookingsPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import AdminRoomsPage from "./pages/admin/AdminRoomsPage";
import DetailPage from "./pages/public/DetailPage";
import FacilitesPage from "./pages/admin/FacilitiesPage";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoutes from "./components/auth/ProtectedRoutes.jsx";
import PersistLogin from "./components/auth/PersistLogin.jsx";
import CancelPage from "./pages/public/CancelationPage";
import ReschedulePage from "./pages/public/ReschedulePage";
import MaintenancePage from "./pages/public/MaintenancePage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/rooms"
            element={<RoomsPage />}
          />
          <Route
            path="/rooms/:id"
            element={<DetailPage />}
          />
          <Route
            path="/bookings/cancel/:token"
            element={<CancelPage />}
          />
          <Route
            path="/bookings/reschedule/:token"
            element={<ReschedulePage />}
          />

          {/* Admin */}

          <Route element={<PersistLogin />}>
            <Route
              path="/admin/login"
              element={<LoginPage />}
            />
            <Route element={<ProtectedRoutes />}>
              <Route
                path="/admin/bookings"
                element={<BookingsPage />}
              />
              <Route
                path="/admin/rooms"
                element={<AdminRoomsPage />}
              />
              <Route
                path="/admin/facilities"
                element={<FacilitesPage />}
              />
            </Route>
          </Route>

          <Route
            path="/*"
            element={<MaintenancePage />}
            // element={<NotFoundPage />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
