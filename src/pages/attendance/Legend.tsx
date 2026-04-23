import { STATUS_CONFIG } from "../../libs/constance";
import type { AttendanceStatus } from "../../types/attendance";

export function Legend() {
  const items = [
    "present",
    "late",
    "absent",
    "overtime",
    "leave",
    "holiday",
  ] as AttendanceStatus[];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {items.map((s) => {
        const cfg = STATUS_CONFIG[s];
        return (
          <div key={s} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dotClass}`} />
            <span className="text-[11.5px] text-slate-500 dark:text-slate-400">
              {cfg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
