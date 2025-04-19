import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import RoomsPage from "./pages/public/RoomsPage";
import LoginPage from "./pages/admin/LoginPage";
import SchedulesPage from "./pages/admin/BookingsPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import AdminRoomsPage from "./pages/admin/AdminRoomsPage";
import DetailPage from "./pages/public/DetailPage";
import FacilitesPage from "./pages/admin/FacilitiesPage";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoutes from "./components/layout/ProtectedRoutes";
import PersistLogin from "./components/auth/PersistLogin";

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

          {/* Admin */}
          <Route
            path="/admin/login"
            element={<LoginPage />}
          />

          <Route element={<PersistLogin />}>
            <Route element={<ProtectedRoutes />}>
              <Route
                path="/admin/schedules"
                element={<SchedulesPage />}
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
            element={<NotFoundPage />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
