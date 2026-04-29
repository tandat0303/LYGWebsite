import { useAppSelector } from "../../../../hooks/auth";
import { useTranslation } from "../../../../hooks/useTranslation";
import type { HomeLeaveData } from "../../../../types/supervisorLeave";

interface Props {
  data: HomeLeaveData | null;
  loading?: boolean;
}

interface PeriodBlockProps {
  titleTW: string | null;
  titleEN: string | null;
  dates: string | null;
  totals: number;
  usedApproved: number;
  usedPending: number;
  remaining: number;
  isTw: boolean;
  ordNum?: number;
}

function PeriodBlock({
  titleTW,
  titleEN,
  dates,
  totals,
  usedApproved,
  usedPending,
  remaining,
  isTw,
  ordNum = 0,
}: PeriodBlockProps) {
  const { t } = useTranslation();

  const periodLabel = isTw ? titleTW : titleEN;

  return (
    <div className="flex-1 min-w-0">
      {(periodLabel || dates) && (
        <div className="flex flex-wrap items-baseline gap-1.5 mb-3">
          <span className="text-[12px] font-semibold text-slate-400 dark:text-white/30">
            {t(`period${ordNum}`, undefined, true)}
          </span>
          {periodLabel && (
            <span className="text-[12px] font-semibold text-slate-400 dark:text-white/30">
              {periodLabel}
            </span>
          )}
          {dates && (
            <span className="text-[12px] font-semibold text-slate-400 dark:text-white/30">
              {dates}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center justify-center shrink-0 rounded-[14px] px-4 py-3 min-w-20 bg-blue-50 border border-blue-200/60 dark:bg-blue-500/12 dark:border-blue-400/25">
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-blue-400 dark:text-white/40 mb-1">
            {t("remaining")}
          </span>
          <span className="text-[32px] font-extrabold leading-none text-blue-600 dark:text-blue-400">
            {remaining}
          </span>
          <span className="text-[11px] text-blue-400/70 dark:text-white/30 mt-1">
            {t("days")}
          </span>
        </div>

        <div className="w-px h-10 bg-slate-100 dark:bg-white/8 shrink-0" />

        <div className="flex flex-1 items-center justify-around gap-1">
          <StatCol
            label={t("total", undefined, true)}
            value={totals}
            isTW={isTw}
          />
          <StatCol
            label={t("usedApproved", undefined, true)}
            value={usedApproved}
            isTW={isTw}
          />
          <StatCol
            label={t("usedPending", undefined, true)}
            value={usedPending}
            isTW={isTw}
          />
        </div>
      </div>
    </div>
  );
}

function StatCol({
  label,
  value,
  isTW = false,
}: {
  label: string;
  value: number;
  isTW: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10.5px] text-slate-400 dark:text-white/35 text-center leading-tight">
        {label}
      </span>
      <div className="flex items-baseline gap-0.5 mt-0.5">
        <span className="text-[18px] font-bold text-slate-700 dark:text-white/85">
          {isTW ? `${value}${t("days")}` : `${value}d`}
        </span>
      </div>
    </div>
  );
}

export default function AnnualLeaveQuota({ data, loading }: Props) {
  const { t } = useTranslation();

  const lang = useAppSelector((s) => s.language.current.code);
  const isTW = lang === "tw";

  if (loading || !data) {
    return (
      <div className="h-[220px] rounded-[18px] bg-slate-100 dark:bg-white/4 animate-pulse" />
    );
  }

  const hasP1 =
    data.AL_P1_Total > 0 ||
    data.AL_P1_UsedApproved > 0 ||
    data.AL_P1_UsedPending > 0 ||
    data.AL_P1_Remaining > 0;

  const hasP2 =
    data.AL_P2_Total > 0 ||
    data.AL_P2_UsedApproved > 0 ||
    data.AL_P2_UsedPending > 0 ||
    data.AL_P2_Remaining > 0;

  return (
    <div className="rounded-[18px] p-5 bg-white border border-slate-200 shadow-[0_2px_12px_rgba(15,37,68,0.07)] dark:bg-[rgba(15,27,48,0.6)] dark:border-white/8 dark:shadow-none transition-[background,border-color] duration-300">
      <div className="flex items-center gap-2 mb-[18px]">
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-slate-500 dark:text-white/70">
          {t("annualLeave", undefined, true)}
        </span>
      </div>

      <div className="flex gap-5 max-sm:flex-col max-sm:gap-0">
        {hasP1 && (
          <PeriodBlock
            titleTW={data.AL_P1_TitleTW}
            titleEN={data.AL_P1_TitleEN}
            dates={data.AL_P1_Dates}
            totals={data.AL_P1_Total}
            usedApproved={data.AL_P1_UsedApproved}
            usedPending={data.AL_P1_UsedPending}
            remaining={data.AL_P1_Remaining}
            isTw={isTW}
            ordNum={1}
          />
        )}

        {hasP1 && hasP2 && (
          <div className="w-px self-stretch bg-slate-100 dark:bg-white/6 shrink-0 max-sm:hidden" />
        )}

        {hasP1 && hasP2 && (
          <div className="hidden max-sm:block h-px w-full bg-slate-100 dark:bg-white/6 my-4" />
        )}

        {hasP2 && (
          <PeriodBlock
            titleTW={data.AL_P2_TitleTW}
            titleEN={data.AL_P2_TitleEN}
            dates={data.AL_P2_Dates}
            totals={data.AL_P2_Total}
            usedApproved={data.AL_P2_UsedApproved}
            usedPending={data.AL_P2_UsedPending}
            remaining={data.AL_P2_Remaining}
            isTw={isTW}
            ordNum={2}
          />
        )}
      </div>

      {!hasP1 && !hasP2 && (
        <p className="text-[13px] text-slate-400 dark:text-white/30 text-center py-4">
          {t("noData")}
        </p>
      )}
    </div>
  );
}
