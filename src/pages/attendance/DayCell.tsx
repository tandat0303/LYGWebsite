import { useCallback } from "react";
import { Check } from "lucide-react";
import { STATUS_STYLES } from "../../libs/constance";
import type { CalendarDay } from "../../types/timeKeeping";

interface Props {
  day: CalendarDay | null;
  isToday: boolean;
  isActive: boolean;
  // isOvertime: boolean;
  factory: string;
  personId: string;
  onClickMobile: (day: CalendarDay) => void;
}

export function DayCell({
  day,
  isToday,
  // isOvertime,
  isActive,
  onClickMobile,
}: Props) {
  const handleClick = useCallback(() => {
    if (!day || day.status === "weekend") return;
    onClickMobile(day);
  }, [day, onClickMobile]);

  if (!day) return <div className="aspect-square" />;

  const styles = STATUS_STYLES[day.status];
  const isSunday = day.status === "weekend";
  const isGreen = day.status === "green";

  return (
    <button
      disabled={isSunday}
      onClick={handleClick}
      className={[
        "aspect-square w-full rounded-xl border flex flex-col items-end justify-center",
        "relative transition-all duration-150 select-none",
        "p-1 sm:p-1.5",
        isSunday
          ? "border-transparent cursor-default"
          : isActive
            ? `${styles.bg} ${styles.border} ring-2 ring-offset-1 ring-blue-400/60 dark:ring-offset-slate-900 cursor-pointer`
            : `${styles.bg} ${styles.border} hover:scale-[1.05] hover:shadow-md hover:z-10 cursor-pointer`,
      ].join(" ")}
    >
      {/* Today dot — top left */}
      {isToday && (
        <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
      )}

      {/* {isOvertime && (
        <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
      )} */}

      {/* Date number — top right */}
      <span
        className={[
          "absolute right-1 top-1 text-[11px] sm:text-[13px] font-bold leading-none",
          isSunday
            ? "text-slate-300 dark:text-slate-700"
            : isToday
              ? "text-blue-600 dark:text-blue-400"
              : styles.text,
        ].join(" ")}
      >
        {day.date}
      </span>

      {/* Value / checkmark — center */}
      {!isSunday && (
        <div className="w-full flex items-center justify-center pb-0.5 sm:pb-1">
          {isGreen ? (
            <Check
              strokeWidth={3}
              className="text-emerald-500 dark:text-emerald-400 w-3.5 h-3.5"
            />
          ) : day.rawValue ? (
            <span
              className={[
                "font-bold leading-none text-[11px] sm:text-[13px]",
                styles.text,
              ].join(" ")}
            >
              {day.rawValue}
            </span>
          ) : null}
        </div>
      )}
    </button>
  );
}
