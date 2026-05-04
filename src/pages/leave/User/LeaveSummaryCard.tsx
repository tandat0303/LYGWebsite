import { useTranslation } from "../../../hooks/useTranslation";
import type { LeaveSummary } from "../../../types/leave";
import { CalendarDays } from "lucide-react";

interface Props {
  data: LeaveSummary;
  year: string;
  loading?: boolean;
  isLHG: boolean;
}

interface StatItemProps {
  label: string;
  value: number | string;
  sub?: string;
  accent?: "blue" | "green" | "amber" | "red" | "slate";
  icon?: React.ReactNode;
  large?: boolean;
}

const ACCENT_MAP = {
  blue: {
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20 dark:border-blue-400/20",
  },
  green: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20 dark:border-emerald-400/20",
  },
  amber: {
    bg: "bg-amber-400/10 dark:bg-amber-400/15",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-400/20 dark:border-amber-400/20",
  },
  red: {
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/20 dark:border-rose-400/20",
  },
  slate: {
    bg: "bg-slate-500/8 dark:bg-white/[0.05]",
    text: "text-slate-600 dark:text-white/70",
    border: "border-slate-200 dark:border-white/[0.08]",
  },
};

function StatItem({
  label,
  value,
  sub,
  accent = "slate",
  icon,
  large = false,
}: StatItemProps) {
  const { t } = useTranslation();
  const a = ACCENT_MAP[accent];
  return (
    <div
      className={`flex flex-col gap-1.5 rounded-xl border ${a.bg} ${a.border} transition-all duration-200`}
      style={{ padding: "14px 16px" }}
    >
      <div className="flex items-center gap-1.5">
        {icon && <span className={`${a.text} opacity-70`}>{icon}</span>}
        <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-slate-400/80 dark:text-white/35">
          {t(label)}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-bold leading-none ${a.text} ${large ? "text-[28px]" : "text-[22px]"}`}
        >
          {value}
        </span>
        {sub && (
          <span className="text-[11px] text-slate-400/70 dark:text-white/30">
            {t(sub)}
          </span>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-[20px] border bg-white/80 dark:bg-[rgba(15,27,48,0.7)]
      border-slate-200/80 dark:border-white/[0.07] animate-pulse"
      style={{ padding: "20px 24px" }}
    >
      <div className="h-4 w-32 rounded bg-slate-200 dark:bg-white/8 mb-5" />
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl h-[76px] bg-slate-100 dark:bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}

export default function LeaveSummaryCard({
  data,
  year,
  loading,
  isLHG,
}: Props) {
  if (loading) return <SkeletonCard />;
  if (!data) return null;

  return (
    <div
      className="rounded-[20px] border
        bg-white/80 border-slate-200/80
        dark:bg-[rgba(15,27,48,0.7)] dark:border-white/[0.07]
        shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.28)]"
      style={{ padding: "20px 24px 22px" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays
          size={15}
          className="text-blue-500 dark:text-blue-400"
          strokeWidth={2.5}
        />
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-700 dark:text-white/80">
            Summary
          </span>
          <span className="font-semibold">{year}</span>
        </div>
        <span className="ml-auto text-[11px] text-slate-400/60 dark:text-white/25 font-medium">
          {data.Person_Name}
        </span>
      </div>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}
      >
        <style>{`
          @media (max-width: 640px) { .leave-summary-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; } }
        `}</style>
        <div className="leave-summary-grid contents">
          {isLHG ? (
            <>
              <StatItem
                label="tongPhep"
                value={data.TONG_PHEP ? data.TONG_PHEP : 0}
                sub="ngay"
                accent="blue"
                // icon={<CalendarDays size={12} />}
              />
              <StatItem
                label="phepDaNghi"
                value={data.DA_NGHI ? data.DA_NGHI : 0}
                sub="ngay"
                accent="red"
              />
              <StatItem
                label="phepConLai"
                value={data.CON_LAI ? data.CON_LAI : 0}
                sub="ngay"
                accent="green"
              />
            </>
          ) : (
            <>
              <StatItem
                label="tongPhep"
                value={
                  data.TONGPHEPTHUCTE
                    ? data.TONGPHEPTHUCTE
                    : data.TONGPHEPTAMTINH
                      ? data.TONGPHEPTAMTINH
                      : 0
                }
                sub="ngay"
                accent="blue"
                // icon={<CalendarDays size={12} />}
              />
              <StatItem
                label="phepDaNghi"
                value={data.DANGHI ? data.DANGHI : 0}
                sub="ngay"
                accent="red"
              />
              <StatItem
                label="phepConLai"
                value={data.CONLAI ? data.CONLAI : 0}
                sub="ngay"
                accent="green"
              />
              <StatItem
                label="phepTon"
                value={data.TONPHEPNAMTRUOC ? data.TONPHEPNAMTRUOC : 0}
                sub="ngay"
                accent="slate"
                // icon={<ArrowLeftRight size={12} />}
              />
              <StatItem
                label="daNghiPtt"
                value={data.DANGHIPTT ? data.DANGHIPTT : 0}
                sub="ngay"
                accent="amber"
              />
              <StatItem
                label="conLaiPtt"
                value={data.CONLAIPTT ? data.CONLAIPTT : 0}
                sub="ngay"
                accent="amber"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
