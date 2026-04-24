import { Megaphone, Newspaper } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

export function Tag({ postType }: { postType: boolean }) {
  const { t } = useTranslation();

  return postType ? (
    <span
      className="inline-flex items-center gap-1 rounded-full text-[11px] font-semibold tracking-wide
        bg-amber-400/15 text-amber-400 border border-amber-400/25
        dark:bg-amber-400/15 dark:text-amber-400 dark:border-amber-400/25"
      style={{ padding: "3px 9px" }}
    >
      <Megaphone size={10} strokeWidth={2.5} />
      {t("thongBao")}
    </span>
  ) : (
    <span
      className="inline-flex items-center gap-1 rounded-full text-[11px] font-semibold tracking-wide
        bg-blue-500/15 text-blue-400 border border-blue-400/25
        dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-400/25"
      style={{ padding: "3px 9px" }}
    >
      <Newspaper size={10} strokeWidth={2.5} />
      {t("banTin")}
    </span>
  );
}
