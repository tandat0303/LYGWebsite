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
  const current = useAppSelector((s) => s.translation.current);

  const _translate = (key: string): string => {
    return current[key.trim()] ?? key.trim();
  };

  const t = (key: string, separatorOrFallback?: string): string => {
    if (key.includes(" / ")) {
      const keys = key.split(" / ");
      const separator = separatorOrFallback ?? " / ";
      return keys.map(_translate).join(separator);
    }
    return current[key] ?? separatorOrFallback ?? key;
  };

  const tJoin = (keys: string[], separator = " / "): string => {
    return keys.map(_translate).join(separator);
  };

  return { t, tJoin };
};
