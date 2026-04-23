import { useTranslation } from "../../hooks/useTranslation";

export function InfoLabel({
  label,
  value,
  icon: Icon,
  colorClass,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
      >
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 leading-none mb-0.5">
          {t(label)}
        </p>
        <p className="text-[22px] font-bold text-slate-800 dark:text-white leading-none">
          {value}
        </p>
      </div>
    </div>
  );
}
