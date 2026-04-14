import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/auth";
import storage from "../libs/storage";
import { hydrateAuth } from "../features/authSlice";
import { Outlet } from "react-router-dom";
import Loading from "../components/ui/Loading";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const { isHydrated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    const auth = storage.get("auth");
    dispatch(hydrateAuth(auth));
  }, [dispatch]);

  if (!isHydrated) {
    return <Loading fullScreen overlay />;
  }

  return <Outlet />;
}
