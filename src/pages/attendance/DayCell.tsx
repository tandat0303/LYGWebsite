import { STATUS_CONFIG } from "../../libs/constance";
import type { DayRecord } from "../../types/attendance";

export function DayCell({
  record,
  isToday,
  onClick,
  selected,
}: {
  record: DayRecord | null;
  isToday: boolean;
  onClick: () => void;
  selected: boolean;
}) {
  if (!record) {
    return <div className="aspect-square" />;
  }

  const cfg = STATUS_CONFIG[record.status];
  const isWeekend = record.status === "weekend";

  return (
    <button
      onClick={onClick}
      className={`
        aspect-square w-full rounded-xl border flex flex-col items-center justify-center
        relative transition-all duration-150 group
        ${
          isWeekend
            ? "border-transparent cursor-default"
            : selected
              ? `${cfg.bgClass} ${cfg.borderClass} ring-2 ring-offset-1 ring-blue-500/60 dark:ring-blue-400/60 dark:ring-offset-slate-900`
              : `${cfg.bgClass} ${cfg.borderClass} hover:scale-[1.06] hover:shadow-md hover:z-10 cursor-pointer`
        }
      `}
      disabled={isWeekend}
    >
      {/* Today indicator */}
      {isToday && (
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
      )}

      {/* Date number */}
      <span
        className={`text-[13px] font-bold leading-none mb-0.5
          ${
            isWeekend
              ? "text-slate-300 dark:text-slate-700"
              : isToday
                ? "text-blue-600 dark:text-blue-400"
                : cfg.textClass
          }
        `}
      >
        {record.date}
      </span>

      {/* Short label */}
      {!isWeekend && cfg.shortLabel && (
        <span
          className={`text-[9px] font-bold tracking-wider ${cfg.textClass} opacity-80`}
        >
          {cfg.shortLabel}
        </span>
      )}

      {/* Overtime dot */}
      {record.status === "overtime" && record.overtimeHours && (
        <span className="text-[8px] text-blue-600 dark:text-blue-300 font-bold mt-px leading-none">
          +{record.overtimeHours}h
        </span>
      )}
    </button>
  );
}
