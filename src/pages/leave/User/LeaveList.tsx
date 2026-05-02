import { useState, useRef } from "react";
import { ChevronDown, CalendarX } from "lucide-react";
import type { LeaveData } from "../../../types/leave";
import { parseDate } from "../../../libs/helper";
import { LeaveItem } from "./LeaveItem";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useTranslation } from "../../../hooks/useTranslation";

function getMonth(iso: string): number {
  return parseDate(iso).getMonth() + 1;
}

function groupByMonth(leaves: LeaveData[]): Map<number, LeaveData[]> {
  const map = new Map<number, LeaveData[]>();
  for (const leaf of leaves) {
    const month = getMonth(leaf.Vacation_From_Date);
    if (!map.has(month)) map.set(month, []);
    map.get(month)!.push(leaf);
  }
  for (const [, items] of map) {
    items.sort(
      (a, b) =>
        parseDate(a.Vacation_From_Date).getTime() -
        parseDate(b.Vacation_From_Date).getTime(),
    );
  }
  return map;
}

interface YearPickerProps {
  year: string;
  onChange: (y: string) => void;
}

function YearPicker({ year, onChange }: YearPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const today = new Date();
  const yearRange = Array.from(
    { length: 11 },
    (_, i) => today.getFullYear() - 5 + i,
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-9 rounded-xl font-bold text-[14px]
          text-slate-800 dark:text-white
          hover:bg-slate-100 dark:hover:bg-white/8
          transition-colors cursor-pointer border-none bg-transparent"
        style={{ padding: "0 10px" }}
      >
        <span className="text-blue-600 dark:text-blue-400">{year}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+6px)] right-0 z-50 rounded-2xl border
            bg-white dark:bg-[rgba(12,22,48,0.98)]
            border-slate-200 dark:border-white/10
            shadow-xl shadow-black/10 dark:shadow-black/50
            backdrop-blur-xl
            animate-[leave-drop_0.16s_cubic-bezier(0.22,1,0.36,1)]"
          style={{ padding: "8px", minWidth: "180px" }}
        >
          <div className="grid grid-cols-4 gap-1">
            {yearRange.map((y) => (
              <button
                key={y}
                onClick={() => {
                  onChange(String(y));
                  setOpen(false);
                }}
                className={`rounded-lg text-[12px] font-semibold transition-colors cursor-pointer border-none
                  ${
                    String(y) === year
                      ? "bg-blue-600 text-white"
                      : "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                style={{ padding: "6px 0" }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MonthAccordion({
  month,
  items,
}: {
  month: number;
  items: LeaveData[];
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const totalDays = items.reduce(
    (acc, i) => acc + (i.Vacation_Hour > 0 ? 0 : i.Vacation_Day),
    0,
  );
  const totalHours = items.reduce((acc, i) => acc + i.Vacation_Hour, 0);
  const durationStr = [
    totalDays > 0 ? `${totalDays} ${t("ngay")}` : "",
    totalHours > 0 ? `${totalHours}.0 ${t("gio")}` : "",
  ]
    .filter(Boolean)
    .join(" + ");

  return (
    <div
      className="rounded-[18px] overflow-hidden border
        bg-white border-slate-200/80
        dark:bg-[rgba(15,27,48,0.65)] dark:border-white/[0.07]
        shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.22)]
        transition-all duration-200"
    >
      {/* Trigger */}
      <button
        className="w-full flex items-center gap-3 cursor-pointer border-none bg-transparent
          transition-colors duration-150
          hover:bg-slate-50 dark:hover:bg-white/3"
        style={{ padding: "14px 16px" }}
        onClick={() => setOpen((v) => !v)}
      >
        {/* Month badge */}
        <div
          className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-[13px]
            bg-blue-500/10 dark:bg-blue-500/18 text-blue-600 dark:text-blue-400
            border border-blue-400/20 dark:border-blue-400/18"
        >
          {month}
        </div>

        <div className="flex-1 text-left min-w-0">
          <p className="text-[14px] font-semibold m-0 text-slate-800 dark:text-white/85">
            {t("thang")} {month}
          </p>
          <p className="text-[11.5px] m-0 text-slate-400/80 dark:text-white/35">
            {/* {items.length} {t("daNghi")} */}
            {/* {durationStr ? ` · ${durationStr}` : ""} */}
            {durationStr ? `${durationStr}` : ""}
          </p>
        </div>

        <ChevronDown
          size={16}
          strokeWidth={2}
          className={`shrink-0 text-slate-400 dark:text-white/30 transition-transform duration-220
            ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Collapsible */}
      <div
        className={`overflow-hidden transition-all duration-260 ease-in-out
          ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-t border-slate-100 dark:border-white/5">
          {items.map((item, i) => (
            <LeaveItem
              key={`${item.Vacation_ID}-${i}`}
              item={item}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface LeaveListProps {
  leaves: LeaveData[];
  loading?: boolean;
  year: string;
  onYearChange: (y: string) => void;
}

export default function LeaveList({
  leaves,
  loading,
  year,
  onYearChange,
}: LeaveListProps) {
  const { t } = useTranslation();

  const grouped = groupByMonth(leaves);
  const months = Array.from(grouped.keys()).sort((a, b) => a - b);

  return (
    <>
      <div
        className="flex items-center gap-3 flex-wrap"
        style={{ marginBottom: "14px" }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[15px] font-bold text-slate-800 dark:text-white/85">
            {t("chiTietPhepNam")}
          </span>
          <span className="flex-1 h-px bg-slate-200 dark:bg-white/[0.07] min-w-5" />
        </div>
        <YearPicker year={year} onChange={onYearChange} />
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-[18px] h-[62px] border animate-pulse
                bg-white border-slate-200 dark:bg-[rgba(15,27,48,0.5)] dark:border-white/[0.07]"
            />
          ))}
        </div>
      )}
      {!loading && leaves.length === 0 && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-16
      text-slate-400 dark:text-white/30"
        >
          <CalendarX size={38} strokeWidth={1.5} />
          <p className="text-[14px] m-0">{t("khongCoDuLieu")}</p>
        </div>
      )}

      {!loading && leaves.length > 0 && (
        <div className="flex flex-col gap-3">
          {months.map((month) => (
            <MonthAccordion
              key={month}
              month={month}
              items={grouped.get(month)!}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes leave-drop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
