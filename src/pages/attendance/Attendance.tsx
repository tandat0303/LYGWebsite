import { useState, useMemo, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import type { AttendanceStatus, DayRecord } from "../../types/attendance";
import { StatBadge } from "./StatBadge";
import { InfoLabel } from "./InfoLabel";
import { Legend } from "./Legend";
import { DOW_LABELS } from "../../libs/constance";
import { DayCell } from "./DayCell";
import { DayDetail } from "./DayDetail";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useTranslation } from "../../hooks/useTranslation";

function generateMockData(year: number, month: number): DayRecord[] {
  const records: DayRecord[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  const statusPool: AttendanceStatus[] = [
    "present",
    "present",
    "present",
    "present",
    "present",
    "late",
    "late",
    "absent",
    "overtime",
    "overtime",
    "leave",
  ];

  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    if (dow === 0 || dow === 6) {
      records.push({ date: d, month, year, status: "weekend" });
      continue;
    }
    if (month === 4 && d === 30) {
      records.push({
        date: d,
        month,
        year,
        status: "holiday",
        note: "Ngày Giải phóng",
      });
      continue;
    }
    if (month === 5 && d === 1) {
      records.push({
        date: d,
        month,
        year,
        status: "holiday",
        note: "Quốc tế Lao động",
      });
      continue;
    }
    const status =
      statusPool[
        Math.floor(Math.abs(Math.sin(d * 7 + month * 13)) * statusPool.length)
      ];
    const checkIn =
      status === "late"
        ? `08:${15 + (d % 30) < 60 ? `${15 + (d % 30)}`.padStart(2, "0") : "44"}`
        : status === "present" || status === "overtime"
          ? `07:${30 + (d % 30) < 60 ? `${30 + (d % 30)}`.padStart(2, "0") : "58"}`
          : undefined;
    const checkOut = checkIn
      ? status === "overtime"
        ? `19:${(d % 30).toString().padStart(2, "0")}`
        : `17:${(d % 30).toString().padStart(2, "0")}`
      : undefined;
    const overtimeHours =
      status === "overtime" ? Math.round(1 + (d % 3)) : undefined;

    records.push({
      date: d,
      month,
      year,
      status,
      checkIn,
      checkOut,
      overtimeHours,
    });
  }
  return records;
}

export default function Attendance() {
  const { t } = useTranslation();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<DayRecord | null>(null);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);
  useClickOutside(selectRef, () => setShowYearPicker(false), showYearPicker);

  const records = useMemo(
    () => generateMockData(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const stats = useMemo(() => {
    const workdays = records.filter(
      (r) => r.status !== "weekend" && r.status !== "holiday",
    );
    const present = records.filter(
      (r) => r.status === "present" || r.status === "overtime",
    ).length;
    const late = records.filter((r) => r.status === "late").length;
    const totalWorked = present + late;
    const totalOT = records.reduce((sum, r) => sum + (r.overtimeHours ?? 0), 0);
    return { workdays: workdays.length, totalWorked, late, totalOT };
  }, [records]);

  // Build calendar grid
  const firstDow = new Date(viewYear, viewMonth - 1, 1).getDay();
  const calendarCells: (DayRecord | null)[] = [
    ...Array(firstDow).fill(null),
    ...records,
  ];
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const monthNames = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const yearRange = Array.from(
    { length: 11 },
    (_, i) => today.getFullYear() - 5 + i,
  );

  return (
    <div
      className="w-full min-h-full flex items-start justify-center box-border overflow-x-hidden"
      style={{ padding: "24px" }}
    >
      <div className="w-full max-w-[1100px] flex flex-col gap-5 animate-[att-rise_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
          <StatBadge
            icon={CalendarDays}
            label="tongGioDiLam"
            value={stats.totalWorked}
            // sub={`/ ${stats.workdays} ngày công`}
            accent="blue"
          />
          <StatBadge
            icon={Clock}
            label="tongSoGioTangCa"
            value={`${stats.totalOT}h`}
            // sub={`Tháng ${viewMonth} / ${viewYear}`}
            accent="emerald"
          />
        </div>

        <div
          className="rounded-[22px] border transition-colors duration-300
            bg-white dark:bg-[rgba(15,27,48,0.82)]
            border-slate-200 dark:border-white/7
            shadow-[0_4px_24px_rgba(15,37,68,0.07)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
          style={{ padding: "24px 24px 28px" }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap gap-y-3">
            {/* Month nav */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                  text-slate-500 dark:text-slate-400
                  hover:bg-slate-100 dark:hover:bg-white/8
                  transition-colors duration-150"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Month/Year selector */}
              <div className="relative" ref={selectRef}>
                <button
                  onClick={() => setShowYearPicker((v) => !v)}
                  className="flex items-center gap-2 px-3 h-9 rounded-xl
                    font-bold text-[15px] text-slate-800 dark:text-white
                    hover:bg-slate-100 dark:hover:bg-white/8
                    transition-colors duration-150"
                >
                  {t("thang")} {monthNames[viewMonth - 1]}
                  <span className="text-blue-600 dark:text-blue-400">
                    {viewYear}
                  </span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={`text-slate-400 transition-transform duration-200 ${showYearPicker ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {showYearPicker && (
                  <div
                    className="absolute top-[calc(100%+6px)] left-0 z-50 rounded-2xl border p-2
                    bg-white dark:bg-[rgba(12,22,48,0.98)]
                    border-slate-200 dark:border-white/10
                    shadow-xl shadow-black/10 dark:shadow-black/50
                    backdrop-blur-xl
                    animate-[att-drop_0.16s_cubic-bezier(0.22,1,0.36,1)]
                    min-w-[280px]"
                  >
                    {/* Month grid */}
                    <div className="grid grid-cols-4 gap-1 mb-2">
                      {monthNames.map((mn, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setViewMonth(i + 1);
                            setShowYearPicker(false);
                            setSelectedDay(null);
                          }}
                          className={`rounded-lg text-[12px] font-semibold py-1.5 transition-colors
                            ${
                              viewMonth === i + 1
                                ? "bg-blue-600 text-white dark:bg-blue-500"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                            }`}
                        >
                          {mn.replace("Tháng ", "T.")}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/[0.07] pt-2 grid grid-cols-4 gap-1">
                      {yearRange.map((y) => (
                        <button
                          key={y}
                          onClick={() => {
                            setViewYear(y);
                            setShowYearPicker(false);
                            setSelectedDay(null);
                          }}
                          className={`rounded-lg text-[12px] font-semibold py-1.5 transition-colors
                            ${
                              viewYear === y
                                ? "bg-blue-600 text-white dark:bg-blue-500"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                            }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                  text-slate-500 dark:text-slate-400
                  hover:bg-slate-100 dark:hover:bg-white/8
                  transition-colors duration-150"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Info labels */}
            <div className="flex items-center gap-5 flex-wrap gap-y-2">
              <InfoLabel
                icon={CalendarDays}
                label="tongNgayLamViec"
                value={stats.workdays}
                colorClass="bg-slate-100 dark:bg-white/[0.07] text-slate-500 dark:text-slate-400"
              />
              <div className="w-px h-8 bg-slate-200 dark:bg-white/8" />
              <InfoLabel
                icon={AlertCircle}
                label="tongNgayDiTre"
                value={stats.late}
                colorClass="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              />
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4">
            <Legend />
          </div>

          {/* DOW headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {DOW_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-bold uppercase tracking-wider py-1
                text-slate-400 dark:text-slate-600"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((record, idx) => (
              <DayCell
                key={idx}
                record={record}
                isToday={
                  record !== null &&
                  record.date === today.getDate() &&
                  record.month === today.getMonth() + 1 &&
                  record.year === today.getFullYear()
                }
                selected={
                  selectedDay !== null &&
                  record !== null &&
                  selectedDay.date === record.date
                }
                onClick={() => {
                  if (!record || record.status === "weekend") return;
                  setSelectedDay((prev) =>
                    prev?.date === record.date ? null : record,
                  );
                }}
              />
            ))}
          </div>

          {/* Day detail panel */}
          {selectedDay && (
            <div className="mt-4">
              <DayDetail
                record={selectedDay}
                onClose={() => setSelectedDay(null)}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes att-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes att-drop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes detail-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
