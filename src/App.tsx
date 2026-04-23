import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import AuthBootstrap from "./routes/AuthBootstrap";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import ChangePassword from "./pages/auth/ChangePassword";
import UserInfo from "./pages/UserInfo";
import Guide from "./pages/Guide";
import Note from "./pages/Note";
import Attendance from "./pages/attendance/Attendance";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthBootstrap />}>
        <Route path="/login" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/attendance" element={<Attendance />} />

            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/user-info" element={<UserInfo />} />
            <Route path="note" element={<Note />} />
            <Route path="/guide" element={<Guide />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
