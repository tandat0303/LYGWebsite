import { Eye, EyeOff } from "lucide-react";
import type { Salary } from "../../../types/salary";
import { useTranslation } from "../../../hooks/useTranslation";

function fmtNum(
  value: number | string | undefined | null,
  revealed: boolean,
): string {
  if (!revealed) return "••";
  if (value === undefined || value === null) return "—";
  return String(value);
}

interface SalarySummaryProps {
  data: Salary;
  revealed: boolean;
  onToggleReveal: () => void;
  monthYear: string;
}

export function SalarySummary({
  data,
  revealed,
  onToggleReveal,
  monthYear,
}: SalarySummaryProps) {
  const { t } = useTranslation();

  const remainLeave =
    data.Annual_Leave != null && data.Leave_Days != null
      ? data.Annual_Leave - data.Leave_Days
      : null;

  const displayMonth = (() => {
    if (!monthYear) return "";
    const [y, m] = monthYear.split("-");
    return `${t("thang")} ${m}/${y}`;
  })();

  const summaryItems = [
    { label: "congTt", value: fmtNum(data.Working_Days, revealed) },
    { label: "tCaLuyKe", value: fmtNum(data.YEARLY_OVERTIME, revealed) },
    {
      label: "loaiBinhBau",
      value: revealed ? data.Rating_ID?.trim() || "—" : "••",
    },
    { label: "soPhepNam", value: fmtNum(data.Annual_Leave, revealed) },
    { label: "daNghi", value: fmtNum(data.Leave_Days, revealed) },
    { label: "conLai", value: fmtNum(remainLeave, revealed) },
    {
      label: "thoiNghiNgoiOT",
      value: fmtNum(data.Night_Working_1, revealed),
    },
  ];

  return (
    <div
      className="rounded-[18px] sm:rounded-[22px] border transition-colors duration-300
        bg-white dark:bg-[rgba(15,27,48,0.82)]
        border-slate-200 dark:border-white/[0.07]
        shadow-[0_4px_24px_rgba(15,37,68,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        overflow-hidden"
    >
      <div
        className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b
          border-slate-100 dark:border-white/6"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0
              bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
          >
            <Banknote size={18} />
          </div> */}
          <div className="min-w-0">
            <p className="text-[15px] font-bold leading-none m-0 text-slate-800 dark:text-white/90">
              {t("tongLuongNhan")}
            </p>
            {displayMonth && (
              <p className="text-[11.5px] text-slate-400 dark:text-slate-500 mt-0.75 leading-none">
                {displayMonth}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            {/* <p className="text-[11px] text-slate-400 dark:text-white/40 m-0 leading-none">
              Thực lĩnh
            </p> */}
            <p className="text-[18px] font-black tabular-nums leading-tight m-0 text-blue-600 dark:text-blue-400">
              {revealed
                ? (data.Final_Salary ?? 0).toLocaleString("vi-VN") + " VNĐ"
                : "•••••••••"}
            </p>
          </div>

          <button
            onClick={onToggleReveal}
            className="inline-flex items-center gap-1.5 border rounded-full text-[12.5px] font-semibold cursor-pointer
              transition-all duration-180 ease-in-out bg-transparent
              border-blue-400/40 dark:border-blue-300/[0.28]
              text-blue-600/80 dark:text-blue-300/82
              hover:bg-blue-400/8 dark:hover:bg-blue-300/7"
            style={{ padding: "6px 14px" }}
          >
            {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
            {/* <span className="hidden sm:inline">{revealed ? "Ẩn" : "Hiện"}</span> */}
          </button>
        </div>
      </div>

      <div className="sm:hidden px-4 pt-3 pb-1">
        <div className="flex items-center justify-center">
          {/* <span className="text-[12px] text-slate-400 dark:text-white/40">
            Thực lĩnh
          </span> */}
          <span className="text-[17px] font-black tabular-nums text-blue-600 dark:text-blue-400">
            {revealed
              ? (data.Final_Salary ?? 0).toLocaleString("vi-VN") + " đ"
              : "•••••••••"}
          </span>
        </div>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7
          gap-0 divide-x divide-y divide-slate-100 dark:divide-white/5"
      >
        {summaryItems.map((item) => (
          <div key={item.label} className="flex flex-col gap-1 px-4 py-3.5">
            <span className="text-[11px] font-medium text-slate-400 dark:text-white/40 leading-snug">
              {t(item.label)}
            </span>
            <span className="text-[15px] font-bold tabular-nums text-slate-800 dark:text-white/90 leading-none">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
