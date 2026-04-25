import { Clock } from "lucide-react";
import { parseDate } from "../../libs/helper";
import type { OvertimeData } from "../../types/overtime";
import { useTranslation } from "../../hooks/useTranslation";

function fmtDate(iso: string): string {
  const d = parseDate(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getDayOfWeek(iso: string): string {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[parseDate(iso).getDay()];
}

// function ynStyle(yn: string): string {
//   switch (yn) {
//     case "5":
//       return "bg-emerald-500/15 text-emerald-600 border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-400/25";
//     case "3":
//       return "bg-amber-400/15 text-amber-600 border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-400 dark:border-amber-400/25";
//     default:
//       return "bg-blue-500/12 text-blue-600 border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-400/25";
//   }
// }

// function ynLabel(yn: string): string {
//   switch (yn) {
//     case "5":
//       return "Đã duyệt";
//     case "3":
//       return "Chờ duyệt";
//     default:
//       return yn;
//   }
// }

export function OvertimeItem({
  item,
  isLast,
}: {
  item: OvertimeData;
  isLast: boolean;
}) {
  const { t } = useTranslation();
  const dow = getDayOfWeek(item.Check_Day);
  //   const ynCls = ynStyle(item.YN);

  return (
    <div
      className={`flex items-center gap-3
        ${!isLast ? "border-b border-slate-100 dark:border-white/5" : ""}`}
      style={{ padding: "12px 16px" }}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-[12px] font-semibold text-slate-500 dark:text-white/50 flex items-center gap-1">
          <Clock size={11} strokeWidth={2} />
          {fmtDate(item.Check_Day)}
          <span className="text-slate-400 dark:text-white/30">·</span>
          <span className="text-slate-400 dark:text-white/35">{t(dow)}</span>
        </span>

        <p className="text-[13px] font-medium leading-snug m-0 text-slate-800 dark:text-white/80">
          {t("ngayLamThem")}
        </p>
      </div>

      <div
        className="flex flex-col items-end gap-1.5 shrink-0"
        style={{ marginTop: "1px" }}
      >
        {/* <span
          className={`inline-flex items-center rounded-full text-[11px] font-bold tracking-wide border ${ynCls}`}
          style={{ padding: "2px 8px" }}
        >
          {ynLabel(item.YN)}
        </span> */}
        <span
          className="inline-flex items-center rounded-full text-[11px] font-semibold border
            text-violet-600 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-500/15 border-violet-400/25"
          style={{ padding: "2px 8px" }}
        >
          {item.Overtime} {t("gio")}
        </span>
      </div>
    </div>
  );
}
