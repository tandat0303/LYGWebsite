import { Check } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import type { DataSubsidy } from "../../../../types/supervisorLeave";
import { useNonTaiwanTranslation } from "../../../../hooks/useNonTaiwanTranslation";
import { useAppSelector } from "../../../../hooks/auth";

interface Props {
  data: DataSubsidy[] | null;
  loading?: boolean;
}

const LOCALE_MAP: Record<string, string> = {
  tw: "zh-tw",
  vi: "en",
  mm: "en",
  en: "en",
};

function getMonthLabel(month: number, locale: string): string {
  return dayjs()
    .locale(locale)
    .month(month - 1)
    .format("MMM");
}

export default function TransportAllowanceCard({ data, loading }: Props) {
  const { tNT } = useNonTaiwanTranslation();
  const langCode = useAppSelector((s) => s.language.current.code);
  const locale = LOCALE_MAP[langCode] ?? "en";

  if (loading || !data) {
    return (
      <div className="h-42 rounded-[18px] bg-slate-100 dark:bg-white/4 animate-pulse" />
    );
  }

  const limitPerYear = data[0]?.SubsidyTime ?? 0;

  return (
    <div className="rounded-[18px] p-5 bg-white border border-slate-200 shadow-[0_2px_12px_rgba(15,37,68,0.07)] dark:bg-[rgba(15,27,48,0.6)] dark:border-white/8 dark:shadow-none transition-[background,border-color] duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4.5">
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-slate-500 dark:text-white/70">
          {tNT("annualTransportationAllowance")}
        </span>
      </div>

      {/* Limit row */}
      <div className="flex items-end justify-end gap-1.5 mb-5">
        <span className="text-[15px] font-bold text-slate-600 dark:text-white/75">
          {tNT("limit")}
        </span>
        <span className="text-[26px] font-extrabold leading-none text-slate-700 dark:text-white/85">
          {limitPerYear}
        </span>
        <span className="text-[13px] text-slate-500 dark:text-white/45">
          {tNT("timeYear")}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative flex items-start justify-between px-1">
        <div className="absolute top-3.25 left-4 right-4 h-0.5 bg-slate-100 dark:bg-white/8 z-0" />

        {data.map((entry, i) => {
          const ticked = entry.IsPaid === 1;
          const label = getMonthLabel(entry.SubsidyMonth ?? 1, locale);
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2 relative z-10"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                  ticked
                    ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.35)]"
                    : "bg-blue-50 border-2 border-blue-200/60 dark:bg-blue-900 dark:border-blue-400/25"
                }`}
              >
                {ticked && (
                  <Check size={13} strokeWidth={3} className="text-white" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-[0.03em] ${
                  ticked
                    ? "text-green-500 dark:text-green-400"
                    : "text-blue-400/70 dark:text-white/30"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
