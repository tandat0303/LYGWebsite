import { useTranslation } from "../../../hooks/useTranslation";

export function DetailRow({
  label,
  value,
  accent = "default",
  bold = false,
}: {
  label: string;
  value: string;
  accent?: "green" | "red" | "blue" | "amber" | "default";
  bold?: boolean;
}) {
  const { t } = useTranslation();

  const valClass =
    accent === "green"
      ? "text-emerald-600 dark:text-emerald-400"
      : accent === "red"
        ? "text-red-500 dark:text-red-400"
        : accent === "blue"
          ? "text-blue-600 dark:text-blue-400"
          : accent === "amber"
            ? "text-amber-600 dark:text-amber-400"
            : "text-slate-800 dark:text-white/90";

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-white/5 last:border-0">
      <span
        className={`text-[12.5px] sm:text-[13px] leading-snug min-w-0
        ${bold ? "font-semibold text-slate-700 dark:text-white/80" : "text-slate-500 dark:text-white/50"}`}
      >
        {t(label)}
      </span>
      <span
        className={`text-[12.5px] sm:text-[13px] font-semibold tabular-nums text-right shrink-0
        ${valClass} ${bold ? "text-[13.5px]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
