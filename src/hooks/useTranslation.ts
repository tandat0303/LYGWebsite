import { useAppSelector } from "./auth";

/**
 * Hook trả về hàm t() để dịch key sang ngôn ngữ hiện tại.
 *
 * Dùng:
 *   const { t, tJoin } = useTranslation();
 *
 *   t("trangChu")                                        // → "Trang chủ"
 *   t("soTay / quyTrinh")                                // → "Sổ tay / Quy trình"  (tự parse)
 *   t("soTay / quyTrinh", " - ")                         // → "Sổ tay - Quy trình"  (custom separator)
 *   t({ key: "khaiBao", fallbackKey: "khaiBao1" })       // → dùng "khaiBao1" nếu "khaiBao" không có
 *   tJoin(["soTay", "quyTrinh"])                         // → "Sổ tay / Quy trình"
 *   tJoin(["soTay", "quyTrinh"], " | ")                  // → "Sổ tay | Quy trình"
 */

export type TKey = string | { key: string; fallbackKey: string };

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
    input: TKey,
    separatorOrFallback?: string,
    active = false,
  ): string => {
    const map = getMap(active);

    // Dạng object { key, fallbackKey }
    if (typeof input === "object") {
      const { key, fallbackKey } = input;
      if (map[key] !== undefined) return map[key];
      if (map[fallbackKey] !== undefined) return map[fallbackKey];
      return key;
    }

    // Dạng string với " / " separator
    if (input.includes(" / ")) {
      const keys = input.split(" / ");
      const separator = separatorOrFallback ?? " / ";

      return keys.map((k) => _translate(k, active)).join(separator);
    }

    return map[input] ?? separatorOrFallback ?? input;
  };

  const tJoin = (keys: string[], separator = " / ", active = false): string => {
    return keys.map((k) => _translate(k, active)).join(separator);
  };

  return { t, tJoin };
};
