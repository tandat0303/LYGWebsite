import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { LogIn, LogOut, Loader2, X } from "lucide-react";
import type {
  CalendarDay,
  TimeCheckingPayload,
  TimeCheckingResponse,
} from "../../types/timeKeeping";
import dayjs from "dayjs";
import { dateToTimestamp } from "../../libs/helper";
import timeKeepingApi from "../../api/timeKeeping";
import { STATUS_META } from "../../libs/constance";
import { useTranslation } from "../../hooks/useTranslation";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function formatTime(isoString: string): string {
  return dayjs(isoString).utc().format("HH:mm:ss");
}

interface Props {
  day: CalendarDay;
  factory: string;
  personId: string;
  open: boolean;
  onClose: () => void;
}

export function DayDetail({ day, factory, personId, open, onClose }: Props) {
  const { t } = useTranslation();

  const [data, setData] = useState<TimeCheckingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Animation states
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dateStr = `${String(day.date).padStart(2, "0")}/${String(day.month).padStart(2, "0")}/${day.year}`;
  const meta = STATUS_META[day.status];

  // Mount → render → animate in
  useEffect(() => {
    if (open) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      // Animate out → unmount
      setVisible(false);
      closeTimerRef.current = setTimeout(() => setRendered(false), 280);
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fetch check-in/out
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setData(null);
    setError(false);
    setLoading(true);

    const payload: TimeCheckingPayload = {
      factory,
      personId,
      date: String(dateToTimestamp(day.date, day.month, day.year)),
    };

    timeKeepingApi
      .getTimeChecking(payload)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, day.date, day.month, day.year, factory, personId]);

  if (!rendered) return null;

  return createPortal(
    <div
      className={[
        "fixed inset-0 z-999 flex items-center justify-center p-4",
        "transition-all duration-280 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 transition-all duration-280 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "bg-black/30 dark:bg-black/50 backdrop-blur-[2px]",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className={[
          "relative z-10 w-full max-w-[320px]",
          "rounded-2xl",
          "bg-white dark:bg-[rgba(14,25,50,0.97)]",
          "border border-slate-200 dark:border-white/10",
          "shadow-2xl shadow-black/15 dark:shadow-black/60",
          "transition-all duration-280 ease-[cubic-bezier(0.22,1,0.36,1)]",
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-[0.96]",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 dark:border-white/8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: meta.bgColor,
                borderColor: meta.borderColor,
              }}
            >
              <span
                className="text-[12px] font-bold"
                style={{ color: meta.color }}
              >
                {day.rawValue || "—"}
              </span>
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-800 dark:text-white leading-none">
                {dateStr}
              </p>
              {/* <p
                className="text-[12px] font-semibold mt-1"
                style={{ color: meta.color }}
              >
                {meta.label}
              </p> */}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0
              text-slate-400 dark:text-slate-500
              hover:bg-slate-100 dark:hover:bg-white/10
              hover:text-slate-600 dark:hover:text-slate-300
              transition-colors duration-150 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-5 gap-2">
              <Loader2
                size={16}
                className="animate-spin text-slate-400 dark:text-slate-500"
              />
              <span className="text-[13px] text-slate-400 dark:text-slate-500">
                Loading...
              </span>
            </div>
          ) : error || !data ? (
            <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/8 p-4 text-center">
              <p className="text-[12px] text-slate-400 dark:text-slate-500">
                {error ? "Can not load data" : t("khongCoDuLieu")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {/* Check-in */}
              <div className="rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/8 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <LogIn
                    size={11}
                    className="text-emerald-500 dark:text-emerald-400"
                  />
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {t("gioVao")}
                  </p>
                </div>
                <p className="text-[16px] font-bold text-slate-800 dark:text-white tabular-nums leading-none">
                  {data.checkIn ? formatTime(data.checkIn) : "—"}
                </p>
              </div>

              {/* Check-out */}
              <div className="rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/8 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <LogOut
                    size={11}
                    className="text-rose-500 dark:text-rose-400"
                  />
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {t("gioRa")}
                  </p>
                </div>
                <p className="text-[16px] font-bold text-slate-800 dark:text-white tabular-nums leading-none">
                  {data.checkOut ? formatTime(data.checkOut) : "—"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
