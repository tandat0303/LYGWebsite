import { useAppSelector } from "./auth";

/**
 * Hook trả về hàm t() để dịch key sang ngôn ngữ hiện tại.
 *
 * Dùng:
 *   const { t, tJoin } = useTranslation();
 *
 *   t("trangChu")                     // → "Trang chủ"
 *   t("soTay / quyTrinh")             // → "Sổ tay / Quy trình"  (tự parse)
 *   t("soTay / quyTrinh", " - ")      // → "Sổ tay - Quy trình"  (custom separator)
 *   tJoin(["soTay", "quyTrinh"])       // → "Sổ tay / Quy trình"
 *   tJoin(["soTay", "quyTrinh"], " | ")// → "Sổ tay | Quy trình"
 */
export const useTranslation = () => {
  const langCode = useAppSelector((s) => s.language.current.code);
  const all = useAppSelector((s) => s.translation.all);

  const getMap = (active = false) => {
    const namespace = active ? (langCode === "tw" ? "tw" : "en") : langCode;

    return all[namespace] ?? all.en ?? {};
  };

  const _translate = (key: string, active = false): string => {
    const map = getMap(active);
    return map[key.trim()] ?? key.trim();
  };

  const t = (
    key: string,
    separatorOrFallback?: string,
    active = false,
  ): string => {
    const map = getMap(active);

    if (key.includes(" / ")) {
      const keys = key.split(" / ");
      const separator = separatorOrFallback ?? " / ";

      return keys.map((k) => _translate(k, active)).join(separator);
    }

    return map[key] ?? separatorOrFallback ?? key;
  };

  const tJoin = (keys: string[], separator = " / ", active = false): string => {
    return keys.map((k) => _translate(k, active)).join(separator);
  };

  return { t, tJoin };
};
