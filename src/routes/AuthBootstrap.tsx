import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/auth";
import storage from "../libs/storage";
import { hydrateAuth } from "../features/authSlice";
import { Outlet } from "react-router-dom";
import Loading from "../components/ui/Loading";
import { fetchTranslations } from "../features/translationSlice";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const { isHydrated } = useAppSelector((s) => s.auth);
  const translationStatus = useAppSelector((s) => s.translation.status);

  useEffect(() => {
    dispatch(fetchTranslations());

    const auth = storage.get("auth");
    dispatch(hydrateAuth(auth ?? null));
  }, [dispatch]);

  const isReady =
    isHydrated &&
    translationStatus !== "idle" &&
    translationStatus !== "loading";

  if (!isReady) {
    return <Loading fullScreen />;
  }

  return <Outlet />;
}
