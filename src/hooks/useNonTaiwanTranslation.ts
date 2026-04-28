import { useAppSelector } from "./auth";

export const useNonTaiwanTranslation = () => {
  const langCode = useAppSelector((s) => s.language.current.code);
  const all = useAppSelector((s) => s.translation.all);

  const namespace = langCode === "tw" ? "non_taiwan" : "en";
  const map = all[namespace] ?? {};

  const tNT = (key: string, fallback?: string): string => {
    return map[key] ?? fallback ?? key;
  };

  return { tNT };
};
