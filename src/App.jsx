import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import RoomsPage from "./pages/public/RoomsPage";
import LoginPage from "./pages/admin/LoginPage";
import SchedulesPage from "./pages/admin/BookingsPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import AdminRoomsPage from "./pages/admin/AdminRoomsPage";
import DetailPage from "./pages/public/DetailPage";
import FacilitesPage from "./pages/admin/FacilitiesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/*"
          element={<NotFoundPage />}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
