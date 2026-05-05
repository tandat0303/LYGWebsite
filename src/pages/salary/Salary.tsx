import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import { Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/en";
import "dayjs/locale/my";
import "dayjs/locale/zh-tw";
import type { Salary } from "../../types/salary";
import salaryApi from "../../api/features/salary";
import { useAppSelector } from "../../hooks/auth";
import { AppAlert } from "../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../libs/helper";
import { useClickOutside } from "../../hooks/useClickOutside";
import { SalarySummary } from "./SalarySummary";
import { AdditionSection } from "./AdditionSection";
import { DeductionSection } from "./DeductionSection";
import { useTranslation } from "../../hooks/useTranslation";

const LANG_TO_DAYJS_LOCALE: Record<string, string> = {
  vi: "vi",
  en: "en",
  mm: "my",
  tw: "zh-tw",
};

function getLocalizedMonthNames(langCode: string): string[] {
  const locale = LANG_TO_DAYJS_LOCALE[langCode] ?? "en";
  return Array.from({ length: 12 }, (_, i) =>
    dayjs().locale(locale).month(i).format("MMM"),
  );
}

function toMonthYear(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

interface PickerDropdownProps {
  anchorRef: React.RefObject<HTMLButtonElement>;
  monthNames: string[];
  viewMonth: number;
  viewYear: number;
  yearRange: number[];
  onSelectMonth: (m: number) => void;
  onSelectYear: (y: number) => void;
}

function PickerDropdown({
  anchorRef,
  monthNames,
  viewMonth,
  viewYear,
  yearRange,
  onSelectMonth,
  onSelectYear,
}: PickerDropdownProps) {
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  }, [anchorRef]);

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: pos.top,
        right: pos.right,
        zIndex: 9999,
      }}
      className="rounded-2xl border p-2
        bg-white dark:bg-[rgba(12,22,48,0.98)]
        border-slate-200 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/50
        backdrop-blur-xl
        animate-[sal-drop_0.16s_cubic-bezier(0.22,1,0.36,1)]
        w-65 sm:w-70"
    >
      <div className="grid grid-cols-4 gap-1 mb-2">
        {monthNames.map((name, i) => {
          const m = i + 1;
          return (
            <button
              key={m}
              onClick={() => onSelectMonth(m)}
              className={`rounded-lg text-[12px] font-semibold py-1.5 transition-colors cursor-pointer
                ${
                  viewMonth === m
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-100 dark:border-white/[0.07] pt-2 grid grid-cols-4 gap-1">
        {yearRange.map((y) => (
          <button
            key={y}
            onClick={() => onSelectYear(y)}
            className={`rounded-lg text-[12px] font-semibold py-1.5 transition-colors cursor-pointer
              ${
                viewYear === y
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
              }`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}

export default function Salary() {
  const { t } = useTranslation();

  const currentUser = useAppSelector((s) => s.auth.user);
  const selectedLang = useAppSelector((s) => s.language.current);

  const monthNames = useMemo(
    () => getLocalizedMonthNames(selectedLang.code),
    [selectedLang.code],
  );

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [showPicker, setShowPicker] = useState(false);

  const [salary, setSalary] = useState<Salary | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const pickerWrapRef = useRef<HTMLDivElement>(null);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);
  useClickOutside(pickerWrapRef, () => setShowPicker(false), showPicker);

  const initialized = useRef(false);

  const fetchSalaryFor = useCallback(
    async (year: number, month: number) => {
      setLoading(true);
      setSalary(null);
      try {
        const monthYear = toMonthYear(year, month);
        const salaryData = await salaryApi.getSalary({
          factory: currentUser.factory,
          personId: currentUser.userId,
          monthYear,
        });
        const first = salaryData?.[0];
        const isEmpty =
          !first || Object.values(first).every((v) => v === "" || v == null);
        setSalary(isEmpty ? null : first);
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      } finally {
        setLoading(false);
      }
    },
    [currentUser.factory, currentUser.userId],
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      setLoading(true);
      try {
        const lastMonths = await salaryApi.getLastMonth({
          factory: currentUser.factory,
          personId: currentUser.userId,
        });

        const month = lastMonths?.[0]?.month ?? "";
        if (month) {
          const [y, m] = month.split("-").map(Number);
          setViewYear(y);
          setViewMonth(m);
          await fetchSalaryFor(y, m);
        } else {
          setLoading(false);
        }
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
        setLoading(false);
      }
    };
    init();
  }, [fetchSalaryFor]);

  const goToPrev = () => {
    const newMonth = viewMonth === 1 ? 12 : viewMonth - 1;
    const newYear = viewMonth === 1 ? viewYear - 1 : viewYear;
    setViewMonth(newMonth);
    setViewYear(newYear);
    fetchSalaryFor(newYear, newMonth);
  };

  const goToNext = () => {
    const newMonth = viewMonth === 12 ? 1 : viewMonth + 1;
    const newYear = viewMonth === 12 ? viewYear + 1 : viewYear;
    setViewMonth(newMonth);
    setViewYear(newYear);
    fetchSalaryFor(newYear, newMonth);
  };

  const handleSelectMonth = (m: number) => {
    setViewMonth(m);
    setShowPicker(false);
    fetchSalaryFor(viewYear, m);
  };

  const handleSelectYear = (y: number) => {
    setViewYear(y);
    setShowPicker(false);
    fetchSalaryFor(y, viewMonth);
  };

  const yearRange = Array.from(
    { length: 11 },
    (_, i) => today.getFullYear() - 5 + i,
  );

  const monthYear = toMonthYear(viewYear, viewMonth);

  return (
    <div className="w-full min-h-full flex flex-col box-border overflow-x-hidden">
      <div
        className="shrink-0 flex items-center gap-3 border-b transition-colors duration-300
          bg-white/80 dark:bg-[rgba(15,27,48,0.6)]
          border-black/[0.07] dark:border-white/[0.07]
          backdrop-blur-sm px-4 sm:px-6 py-3.5"
      >
        <div
          className="w-8.5 h-8.5 rounded-[9px] flex items-center justify-center shrink-0
            bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
        >
          <Wallet size={18} />
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-[15px] font-bold leading-none m-0 text-slate-800 dark:text-white/90">
            {t("tongLuongNhan")}
          </h1>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
            {monthNames[viewMonth - 1]} · {viewYear}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1" ref={pickerWrapRef}>
          <button
            onClick={goToPrev}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer
              text-slate-500 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            ref={triggerBtnRef}
            onClick={() => setShowPicker((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl cursor-pointer
              font-bold text-[14px] text-slate-800 dark:text-white
              hover:bg-slate-100 dark:hover:bg-white/8 transition-colors"
          >
            {monthNames[viewMonth - 1]}
            <span className="text-blue-600 dark:text-blue-400">{viewYear}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`text-slate-400 transition-transform duration-200 ${showPicker ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showPicker && (
            <PickerDropdown
              anchorRef={triggerBtnRef}
              monthNames={monthNames}
              viewMonth={viewMonth}
              viewYear={viewYear}
              yearRange={yearRange}
              onSelectMonth={handleSelectMonth}
              onSelectYear={handleSelectYear}
            />
          )}

          <button
            onClick={goToNext}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer
              text-slate-500 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-white/8 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-5">
        {loading ? (
          <div className="flex flex-col gap-4 max-w-5xl mx-auto animate-pulse">
            {[160, 300, 260].map((h, i) => (
              <div
                key={i}
                className="rounded-[22px] bg-slate-100 dark:bg-white/5"
                style={{ height: h }}
              />
            ))}
          </div>
        ) : !salary ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400 dark:text-white/30">
            <Wallet size={40} strokeWidth={1.2} />
            <p className="text-[14px] m-0">{t("khongCoDuLieu")}</p>
          </div>
        ) : (
          <div
            key={monthYear}
            className="flex flex-col gap-4 max-w-5xl mx-auto
              animate-[sal-rise_0.3s_cubic-bezier(0.22,1,0.36,1)_both]"
          >
            <SalarySummary
              data={salary}
              revealed={revealed}
              onToggleReveal={() => setRevealed((v) => !v)}
              monthYear={monthYear}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <AdditionSection data={salary} revealed={revealed} />
              <DeductionSection data={salary} revealed={revealed} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes sal-rise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sal-drop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
