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
          bg: "from-blue-600 to-[#1a3a6e] dark:from-blue-700 dark:to-[#0f2544]",
          iconBg: "bg-white/15",
          subText: "text-blue-200/80",
        }
      : {
          bg: "from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-900",
          iconBg: "bg-white/15",
          subText: "text-emerald-100/80",
        };

  return (
    <div
      className={`relative flex items-center gap-4 rounded-2xl bg-linear-to-br ${accentCls.bg}
        p-5 overflow-hidden shadow-lg shadow-black/10 dark:shadow-black/30 min-w-0`}
    >
      <div
        className={`shrink-0 w-11 h-11 rounded-xl ${accentCls.iconBg} flex items-center justify-center`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold tracking-wide text-white/60 uppercase mb-0.5 truncate">
          {t(label)}
        </p>
        <p className="text-[28px] font-bold text-white leading-none">{value}</p>
        {sub && (
          <p className={`text-[12px] mt-1 ${accentCls.subText} truncate`}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
