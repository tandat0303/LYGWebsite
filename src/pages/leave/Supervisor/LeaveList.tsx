import {
  ChevronRight,
  // CheckCircle,
  // Clock,
  // XCircle,
  // RotateCcw,
} from "lucide-react";
import type { DataHistory } from "../../../types/supervisorLeave";
import { useNonTaiwanTranslation } from "../../../hooks/useNonTaiwanTranslation";
import { useAppSelector } from "../../../hooks/auth";

function getStatusInfo(code: string, lang: string = "en") {
  switch (code) {
    case "F":
      return {
        label: lang === "tw" ? "已核准" : "Approved",
        // Icon: CheckCircle,
        pill: "bg-green-100 text-green-700 border border-green-200/70 dark:bg-green-500/[0.12] dark:text-green-400 dark:border-green-400/25",
      };
    case "C":
      return {
        label: lang === "tw" ? "取消" : "Cancel",
        // Icon: XCircle,
        pill: "bg-red-100 text-red-600 border border-red-200/70 dark:bg-red-500/[0.12] dark:text-red-400 dark:border-red-400/25",
      };
    case "S":
    case "B":
      return {
        label: lang === "tw" ? "簽核中" : "Pending",
        // Icon: Clock,
        pill: "bg-amber-100 text-amber-700 border border-amber-200/70 dark:bg-amber-500/[0.12] dark:text-amber-400 dark:border-amber-400/25",
      };
    case "R":
      return {
        label: lang === "tw" ? "退回" : "Return",
        // Icon: RotateCcw,
        pill: "bg-violet-100 text-violet-700 border border-violet-200/70 dark:bg-violet-500/[0.12] dark:text-violet-400 dark:border-violet-400/25",
      };
    default:
      return {
        label: lang === "tw" ? "未知" : "Unknown",
        // Icon: Clock,
        pill: "bg-slate-100 text-slate-500 border border-slate-200/70 dark:bg-white/[0.06] dark:text-white/40 dark:border-white/[0.1]",
      };
  }
}

function LeaveItem({
  item,
  index,
  onClick,
}: {
  item: DataHistory;
  index: number;
  onClick: (item: DataHistory) => void;
}) {
  const { tNT } = useNonTaiwanTranslation();

  const langCode = useAppSelector((s) => s.language.current.code);

  const isTW = langCode === "tw";

  const leaveLabel = isTW ? item.LeaveLabelTW : item.LeaveLabelEN;
  const leaveInfo = isTW ? item.LeaveInfoTW : item.LeaveInfoEN;

  const s = getStatusInfo(item.Status, langCode);
  // const { Icon } = s;

  return (
    <div
      className="flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] cursor-pointer
        bg-slate-50 border border-slate-200/80
        hover:bg-slate-100 hover:border-slate-300/60
        dark:bg-white/3 dark:border-white/7
        dark:hover:bg-white/6 dark:hover:border-white/12
        transition-[background,border-color] duration-150
        animate-[leave-item-in_0.3s_ease_both]"
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={() => onClick(item)}
    >
      {/* Left: label + badge */}
      <div className="min-w-[76px]">
        <div className="text-[13px] font-bold text-slate-800 dark:text-white/88 mb-1.5">
          {leaveLabel}
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-bold ${s.pill}`}
        >
          {/* <Icon size={10} strokeWidth={2.5} /> */}
          {s.label}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-slate-600 dark:text-white/75 mb-0.5 truncate">
          {item.DateRange}
        </div>
        <div className="flex items-center text-[12px] gap-2 text-slate-400 dark:text-white/40">
          <div>{leaveInfo}</div>
          <div>
            ({item.Days} {tNT("days")})
          </div>
        </div>
      </div>

      <ChevronRight
        size={15}
        className="text-slate-300 dark:text-white/20 shrink-0"
      />
    </div>
  );
}

interface Props {
  items: DataHistory[];
  loading?: boolean;
  onSelect: (item: DataHistory) => void;
}

export default function DataHistory({ items, loading, onSelect }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2.5">
        <style>{`@keyframes leave-item-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[76px] rounded-[14px] bg-slate-100 dark:bg-white/[0.04] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-[14px] text-slate-400 dark:text-white/25">
        No leave records found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <style>{`@keyframes leave-item-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
      {items.map((item, i) => (
        <LeaveItem key={item.ID} item={item} index={i} onClick={onSelect} />
      ))}
    </div>
  );
}
