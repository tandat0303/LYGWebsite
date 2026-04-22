import { useAppSelector } from "./auth";

export const useNonTaiwanTranslation = () => {
  const nonTaiwanMap = useAppSelector(
    (s) => s.translation.all["non_taiwan"] ?? {},
  );

  const tNT = (key: string, fallback?: string): string => {
    return nonTaiwanMap[key] ?? fallback ?? key;
  };

  return { tNT };
};
