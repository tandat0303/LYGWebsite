import { useNonTaiwanTranslation } from "../../../hooks/useNonTaiwanTranslation";
import { useTranslation } from "../../../hooks/useTranslation";
import type { HomeLeaveData } from "../../../types/supervisorLeave";

interface Props {
  data: HomeLeaveData | null;
  loading?: boolean;
  status: number;
}

function StatRow({ label, value }: { label: string; value: number }) {
  const { tNT } = useNonTaiwanTranslation();

  return (
    <div className="flex items-center justify-between py-[7px]">
      <span className="text-[12.5px] text-slate-500 dark:text-white/45">
        {tNT(label)}
      </span>
      <span className="text-[13px] font-bold text-slate-700 dark:text-white/85 flex items-baseline gap-1">
        {value}
        <span className="text-[11px] font-medium text-slate-400 dark:text-white/30">
          {tNT("days")}
        </span>
      </span>
    </div>
  );
}

export default function HomeLeaveQuota({ data, loading, status }: Props) {
  const { tNT } = useNonTaiwanTranslation();
  const { t } = useTranslation();

  if (loading || !data) {
    return (
      <div className="h-[168px] rounded-[18px] bg-slate-100 dark:bg-white/4 animate-pulse" />
    );
  }

  return (
    <div className="rounded-[18px] p-5 bg-white border border-slate-200 shadow-[0_2px_12px_rgba(15,37,68,0.07)] dark:bg-[rgba(15,27,48,0.6)] dark:border-white/8 dark:shadow-none transition-[background,border-color] duration-300">
      <div className="flex items-center gap-2 mb-[18px]">
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-slate-500 dark:text-white/70">
          {status === 2 ? tNT("homeLeave") : t("homeLeave", undefined, true)}
        </span>
      </div>

      {/* Body */}
      <div className="flex gap-4 items-start">
        <div className="flex flex-col items-center justify-center shrink-0 rounded-[14px] px-4 py-3 min-w-20 bg-blue-50 border border-blue-200/60 dark:bg-blue-500/12 dark:border-blue-400/25">
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-blue-400 dark:text-white/40 mb-1">
            {tNT("remaining")}
          </span>
          <span className="text-[32px] font-extrabold leading-none text-blue-600 dark:text-blue-400">
            {data.HomeLeave_Remaining}
          </span>
          <span className="text-[11px] text-blue-400/70 dark:text-white/30 mt-1">
            {tNT("days")}
          </span>
        </div>

        {/* Stats */}
        <div className="flex-1 min-w-0">
          <StatRow label="total" value={data.HomeLeave_Total} />
          <StatRow label="usedApproved" value={data.HomeLeave_UsedApproved} />
          <StatRow label="usedPending" value={data.HomeLeave_UsedPending} />
        </div>
      </div>
    </div>
  );
}
