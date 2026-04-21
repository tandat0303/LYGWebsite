import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/auth";

export default function ProtectedRoute() {
  const { accessToken, user, isHydrated } = useAppSelector((s) => s.auth);

  if (!isHydrated) return null;

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
