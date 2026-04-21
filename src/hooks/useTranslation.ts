import { useAppSelector } from "./auth";

export const useTranslation = () => {
  const current = useAppSelector((s) => s.translation.current);

  const t = (key: string, fallback?: string): string => {
    return current[key] ?? fallback ?? key;
  };

  return { t };
};
