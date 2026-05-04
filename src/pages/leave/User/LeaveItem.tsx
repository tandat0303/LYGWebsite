import { Clock } from "lucide-react";
import { parseDate } from "../../../libs/helper";
import type { LeaveData } from "../../../types/leave";
import { useTranslation } from "../../../hooks/useTranslation";

function fmtDate(iso: string): string {
  const d = parseDate(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function isSameDay(a: string, b: string): boolean {
  const da = parseDate(a),
    db = parseDate(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function extractTag(vacationId: string): string {
  return vacationId.split(" ")[0] ?? vacationId;
}

function tagStyle(tag: string): string {
  if (tag.startsWith("P"))
    return "bg-emerald-500/15 text-emerald-600 border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-400/25";
  if (tag.startsWith("NO") || tag.startsWith("N"))
    return "bg-amber-400/15 text-amber-600 border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-400 dark:border-amber-400/25";
  if (tag.startsWith("RO"))
    return "bg-red-400/15 text-red-600 border-red-400/30 dark:bg-red-400/15 dark:text-red-400 dark:border-red-400/25";
  return "bg-blue-500/12 text-blue-600 border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-400/25";
}

export function LeaveItem({
  item,
  isLast,
}: {
  item: LeaveData;
  isLast: boolean;
}) {
  const { t } = useTranslation();

  const tag = extractTag(item.Vacation_ID);
  const tagCls = tagStyle(tag);
  const sameDay = isSameDay(item.Vacation_From_Date, item.Vacation_To_Date);
  const dateLabel = sameDay
    ? fmtDate(item.Vacation_From_Date)
    : `${fmtDate(item.Vacation_From_Date)} → ${fmtDate(item.Vacation_To_Date)}`;

  const durationLabel =
    item.Vacation_Day > 0.5
      ? `${item.Vacation_Day} ${t("ngay")}`
      : `${item.Vacation_Hour}.0 ${t("gio")}`;

  const durationAccent =
    item.Vacation_Day > 0.5
      ? "text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/15 border-blue-400/25"
      : "text-violet-600 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-500/15 border-violet-400/25";

  return (
    <div
      className={`flex items-start gap-3
        ${!isLast ? "border-b border-slate-100 dark:border-white/5" : ""}`}
      style={{ padding: "12px 16px" }}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-[12px] font-semibold text-slate-500 dark:text-white/50 flex items-center gap-1">
          <Clock size={11} strokeWidth={2} />
          {dateLabel}
        </span>

        <p className="text-[13px] font-medium leading-snug m-0 text-slate-800 dark:text-white/80 line-clamp-2">
          {item.Vacation_ID}
        </p>
      </div>

      <div
        className="flex flex-col items-end gap-1.5 shrink-0"
        style={{ marginTop: "1px" }}
      >
        <span
          className={`inline-flex items-center rounded-full text-[11px] font-bold tracking-wide border ${tagCls}`}
          style={{ padding: "2px 8px" }}
        >
          {tag}
        </span>
        <span
          className={`inline-flex items-center rounded-full text-[11px] font-semibold border ${durationAccent}`}
          style={{ padding: "2px 8px" }}
        >
          {durationLabel}
        </span>
      </div>
    </div>
  );
}
