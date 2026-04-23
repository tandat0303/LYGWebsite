import { Clock } from "lucide-react";
import { STATUS_CONFIG } from "../../libs/constance";
import type { DayRecord } from "../../types/attendance";

export function DayDetail({
  record,
  onClose,
}: {
  record: DayRecord;
  onClose: () => void;
}) {
  const cfg = STATUS_CONFIG[record.status];
  const dateStr = `${String(record.date).padStart(2, "0")}/${String(record.month).padStart(2, "0")}/${record.year}`;

  return (
    <div
      className="rounded-2xl border transition-all duration-200
        bg-white dark:bg-[rgba(15,27,48,0.9)]
        border-slate-200 dark:border-white/8
        shadow-xl shadow-black/8 dark:shadow-black/40
        p-5 animate-[detail-in_0.18s_cubic-bezier(0.22,1,0.36,1)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bgClass} border ${cfg.borderClass}`}
          >
            <span className={`text-sm font-bold ${cfg.textClass}`}>
              {cfg.shortLabel || "—"}
            </span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-none">
              {dateStr}
            </p>
            <p className={`text-[11px] font-semibold mt-0.5 ${cfg.textClass}`}>
              {cfg.label}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {(record.checkIn || record.checkOut) && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          {record.checkIn && (
            <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/6 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
                Check-in
              </p>
              <p className="text-[16px] font-bold text-slate-800 dark:text-white">
                {record.checkIn}
              </p>
            </div>
          )}
          {record.checkOut && (
            <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/6 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
                Check-out
              </p>
              <p className="text-[16px] font-bold text-slate-800 dark:text-white">
                {record.checkOut}
              </p>
            </div>
          )}
        </div>
      )}

      {record.overtimeHours && (
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-700/40 p-3">
          <Clock
            size={14}
            className="text-blue-600 dark:text-blue-400 shrink-0"
          />
          <span className="text-[13px] font-semibold text-blue-700 dark:text-blue-300">
            Tăng ca {record.overtimeHours} giờ
          </span>
        </div>
      )}

      {record.note && (
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-3 italic">
          {record.note}
        </p>
      )}
    </div>
  );
}
