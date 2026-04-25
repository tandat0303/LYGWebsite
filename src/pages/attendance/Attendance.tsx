import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import type {
  CalendarDay,
  DayCellStatus,
  TimeKeeping,
  TimeKeepingPayload,
} from "../../types/timeKeeping";
import { StatBadge } from "./StatBadge";
import { InfoLabel } from "./InfoLabel";
import { DOW_LABELS, monthNames } from "../../libs/constance";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useTranslation } from "../../hooks/useTranslation";
import timeKeepingApi from "../../api/timeKeeping";
import { useAppSelector } from "../../hooks/auth";
import { DayDetail } from "./DayDetail";
import { DayCell } from "./DayCell";
import { AppAlert } from "../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../libs/helper";

function getDayCellStatus(
  value: string | undefined,
  isSunday: boolean,
): DayCellStatus {
  if (isSunday) return "weekend";
  if (value === undefined || value === "") return "empty";
  if (value === "O") return "red";
  if (Number(value) >= 8) return "green";
  return "yellow";
}

function formatDayKey(d: number): string {
  return String(d).padStart(2, "0");
}

export default function Attendance() {
  const { t } = useTranslation();

  const currentUser = useAppSelector((s) => s.auth.user);
  const FACTORY = currentUser.factory;
  const PERSON_ID = currentUser.userId;

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [modalDay, setModalDay] = useState<CalendarDay | null>(null);
  const [timeKeeping, setTimeKeeping] = useState<TimeKeeping | null>(null);
  const [loading, setLoading] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);
  useClickOutside(selectRef, () => setShowYearPicker(false), showYearPicker);

  const fetchTimeKeeping = useCallback(async () => {
    setLoading(true);
    setModalDay(null);
    try {
      const payload: TimeKeepingPayload = {
        factory: FACTORY,
        personId: PERSON_ID,
        year: String(viewYear),
        month: String(viewMonth),
      };
      const data = await timeKeepingApi.getTimeKeeping(payload);
      setTimeKeeping(data ?? null);
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      setTimeKeeping(null);
    } finally {
      setLoading(false);
    }
  }, [viewYear, viewMonth]);

  useEffect(() => {
    fetchTimeKeeping();
  }, [fetchTimeKeeping]);

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const days: CalendarDay[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(viewYear, viewMonth - 1, d).getDay();
      const isSunday = dow === 0;
      const isSat = dow === 6;
      const key = formatDayKey(d);
      const rawValue = timeKeeping
        ? ((timeKeeping[key as keyof TimeKeeping] as string | undefined) ?? "")
        : "";
      const status = getDayCellStatus(
        isSunday ? undefined : rawValue,
        isSunday,
      );
      days.push({
        date: d,
        month: viewMonth,
        year: viewYear,
        rawValue,
        status,
        isSatOrSun: isSunday || isSat,
      });
    }
    return days;
  }, [viewYear, viewMonth, timeKeeping]);

  const stats = useMemo(
    () => ({
      workdays: Number(timeKeeping?.TOTAL2 ?? 0) / 8,
      totalWorked: timeKeeping?.TOTAL1 ?? 0,
      totalOT: timeKeeping?.TOTAL3 ?? 0,
      late: timeKeeping?.Check_In_Late ?? 0,
    }),
    [timeKeeping, calendarDays],
  );

  const firstDow = new Date(viewYear, viewMonth - 1, 1).getDay();
  const calendarCells: (CalendarDay | null)[] = [
    ...Array(firstDow).fill(null),
    ...calendarDays,
  ];
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const prevMonth = () => {
    setModalDay(null);
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    setModalDay(null);
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const yearRange = Array.from(
    { length: 11 },
    (_, i) => today.getFullYear() - 5 + i,
  );

  return (
    <div className="w-full min-h-full flex flex-col box-border overflow-x-hidden">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 border-b transition-colors duration-300 bg-white/80 border-black/[0.07] backdrop-blur-sm dark:bg-[rgba(15,27,48,0.6)] dark:border-white/[0.07] px-4 sm:px-6 py-3.5">
        <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center shrink-0 bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
          <ClipboardList size={18} />
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-[15px] font-bold leading-none m-0 text-slate-800 dark:text-white/90">
            {t("chamCong")}
          </h1>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
            {t("thang")} {monthNames[viewMonth - 1]} · {viewYear}
          </p>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex-1 p-3 sm:p-5">
        <div className="w-full max-w-[1200px] mx-auto animate-[att-rise_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            <div className="w-full lg:flex-3 min-w-0">
              <div className="rounded-[18px] sm:rounded-[22px] border transition-colors duration-300 bg-white dark:bg-[rgba(15,27,48,0.82)] border-slate-200 dark:border-white/7 shadow-[0_4px_24px_rgba(15,37,68,0.07)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.35)] p-3 sm:p-5">
                {/* Calendar nav row */}
                <div className="flex items-center justify-between gap-2 mb-4 flex-wrap gap-y-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevMonth}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div className="relative" ref={selectRef}>
                      <button
                        onClick={() => setShowYearPicker((v) => !v)}
                        className="flex items-center gap-1.5 px-2 sm:px-3 h-9 rounded-xl font-bold text-[14px] sm:text-[15px] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-colors cursor-pointer"
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
                        <div className="absolute top-[calc(100%+6px)] left-0 z-50 rounded-2xl border p-2 bg-white dark:bg-[rgba(12,22,48,0.98)] border-slate-200 dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-black/50 backdrop-blur-xl animate-[att-drop_0.16s_cubic-bezier(0.22,1,0.36,1)] min-w-[260px] sm:min-w-[280px]">
                          <div className="grid grid-cols-4 gap-1 mb-2">
                            {monthNames.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setViewMonth(i + 1);
                                  setShowYearPicker(false);
                                  setModalDay(null);
                                }}
                                className={`rounded-lg text-[12px] font-semibold py-1.5 transition-colors ${viewMonth === i + 1 ? "bg-blue-600 text-white" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"}`}
                              >
                                T.{i + 1}
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
                                  setModalDay(null);
                                }}
                                className={`rounded-lg text-[12px] font-semibold py-1.5 transition-colors ${viewYear === y ? "bg-blue-600 text-white" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"}`}
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
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* <Legend /> */}
                </div>

                {/* DOW headers */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                  {DOW_LABELS.map((d, i) => (
                    <div
                      key={d}
                      className={`text-center text-[9px] sm:text-[11px] font-bold uppercase tracking-wider py-0.5 sm:py-1 ${i === 0 || i === 6 ? "text-slate-300 dark:text-slate-700" : "text-slate-400 dark:text-slate-600"}`}
                    >
                      {t(d)}
                    </div>
                  ))}
                </div>

                {/* Grid */}
                {loading ? (
                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                    {calendarCells.map((day, idx) => (
                      <DayCell
                        key={idx}
                        day={day}
                        isToday={
                          day !== null &&
                          day.date === today.getDate() &&
                          day.month === today.getMonth() + 1 &&
                          day.year === today.getFullYear()
                        }
                        isActive={
                          modalDay !== null &&
                          day !== null &&
                          modalDay.date === day.date
                        }
                        factory={FACTORY}
                        personId={PERSON_ID}
                        onClickMobile={setModalDay}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[260px] xl:w-[280px] shrink-0 flex flex-col gap-3">
              {/* Stat badges: row on mobile, stacked on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <StatBadge
                  icon={CalendarDays}
                  label="tongGioDiLam"
                  value={stats.totalWorked}
                  accent="blue"
                />
                <StatBadge
                  icon={Clock}
                  label="tongSoGioTangCa"
                  value={`${stats.totalOT}h`}
                  accent="emerald"
                />
              </div>

              {/* Info card */}
              <div className="rounded-2xl border transition-colors duration-300 bg-white dark:bg-[rgba(15,27,48,0.82)] border-slate-200 dark:border-white/7 shadow-[0_4px_24px_rgba(15,37,68,0.07)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.35)] p-4 flex flex-col gap-4">
                <InfoLabel
                  icon={CalendarDays}
                  label="tongNgayLamViec"
                  value={stats.workdays}
                  colorClass="bg-slate-100 dark:bg-white/[0.07] text-slate-500 dark:text-slate-400"
                />
                <div className="h-px bg-slate-100 dark:bg-white/[0.06]" />
                <InfoLabel
                  icon={AlertCircle}
                  label="tongNgayDiTre"
                  value={stats.late}
                  colorClass="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DayDetail portal */}
      {modalDay && (
        <DayDetail
          day={modalDay}
          factory={FACTORY}
          personId={PERSON_ID}
          open={!!modalDay}
          onClose={() => setModalDay(null)}
        />
      )}

      <style>{`
        @keyframes att-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes att-drop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
