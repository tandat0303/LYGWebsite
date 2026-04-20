import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import AuthBootstrap from "./routes/AuthBootstrap";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import ChangePassword from "./pages/auth/ChangePassword";
import UserInfo from "./pages/UserInfo";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthBootstrap />}>
        <Route path="/login" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/user-info" element={<UserInfo />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
