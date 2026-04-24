import { useTranslation } from "../../hooks/useTranslation";

export function StatBadge({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent: "blue" | "emerald";
}) {
  const { t } = useTranslation();

  const accentCls =
    accent === "blue"
      ? {
          wrap: "border-blue-100 dark:border-blue-500/15",
          iconWrap:
            "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
          value: "text-blue-700 dark:text-blue-300",
        }
      : {
          wrap: "border-emerald-100 dark:border-emerald-500/15",
          iconWrap:
            "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          value: "text-emerald-700 dark:text-emerald-300",
        };

  return (
    <div
      className={`
        flex items-center gap-3.5 rounded-2xl border
        bg-white dark:bg-[rgba(15,27,48,0.7)]
        ${accentCls.wrap}
        shadow-[0_2px_8px_rgba(15,37,68,0.05)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)]
        p-4 min-w-0 transition-colors duration-300
      `}
    >
      <div
        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${accentCls.iconWrap}`}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-wide uppercase mb-1 truncate text-slate-400 dark:text-slate-500">
          {t(label)}
        </p>
        <p className={`text-[24px] font-bold leading-none ${accentCls.value}`}>
          {value}
        </p>
        {sub && (
          <p className="text-[11px] mt-1 text-slate-400 dark:text-slate-500 truncate">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
