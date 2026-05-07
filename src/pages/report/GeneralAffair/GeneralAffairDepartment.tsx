import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RectangleProps } from "recharts";
import type { GeneralAffairDepartment } from "../../../types/generalAffair";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTranslation } from "../../../hooks/useTranslation";

function formatAmount(amount: number): string {
  if (amount >= 1_000_000)
    return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (amount >= 1_000)
    return `${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(amount);
}

function formatAmountFull(amount: number): string {
  return amount.toLocaleString("en-US");
}

function toMonthLabel(mmYearTitle: string): string {
  const parts = mmYearTitle.split("/");
  if (parts.length === 2) return String(parseInt(parts[1], 10));
  return mmYearTitle;
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; payload: GeneralAffairDepartment }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-xl border shadow-xl text-sm
        bg-white/95 border-slate-200/80
        dark:bg-[rgba(15,27,48,0.95)] dark:border-white/10"
      style={{ padding: "10px 14px", backdropFilter: "blur(8px)" }}
    >
      <p className="font-bold m-0 mb-1 text-slate-800 dark:text-white/92">
        {d.MMYear_Title}
      </p>
      <p className="m-0 font-semibold text-blue-600 dark:text-blue-300">
        {formatAmountFull(d.Amount)}{" "}
        <span className="text-[11px] font-normal opacity-70">USD</span>
      </p>
    </div>
  );
}

function makeBarShape(color: string) {
  return (props: RectangleProps) => {
    const { x, y, width, height } = props;
    if (!width || !height || height <= 0) return null;
    const r = Math.min(6, (width as number) / 2);
    return (
      <path
        d={`M${x},${(y as number) + r}
           Q${x},${y} ${(x as number) + r},${y}
           H${(x as number) + (width as number) - r}
           Q${(x as number) + (width as number)},${y} ${(x as number) + (width as number)},${(y as number) + r}
           V${(y as number) + (height as number)}
           H${x}Z`}
        fill={color}
        opacity={0.88}
      />
    );
  };
}

function SummaryBar({ data }: { data: GeneralAffairDepartment[] }) {
  const { t } = useTranslation();
  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.Amount, 0),
    [data],
  );
  const fromTitle = data[data.length - 1]?.MMYear_Title ?? "";
  const toTitle = data[0]?.MMYear_Title ?? "";

  return (
    <div
      className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 rounded-xl px-4 py-2.5 border
        bg-blue-50/60 border-blue-100
        dark:bg-blue-300/5 dark:border-blue-300/10"
    >
      <span className="text-[16px] font-semibold text-slate-600 dark:text-white/60">
        {t("tong")}:
      </span>
      <span className="text-[16px] font-medium text-slate-500 dark:text-white/40">
        {fromTitle}
      </span>
      <span className="text-[12px] text-slate-400 dark:text-white/25">–</span>
      <span className="text-[16px] font-medium text-slate-500 dark:text-white/40">
        {toTitle}
      </span>
      <span className="text-[16px] text-slate-400 dark:text-white/25">=</span>
      <span className="text-[18px] font-bold text-blue-600 dark:text-blue-300">
        {formatAmountFull(total)}
      </span>
      <span className="text-[12px] font-semibold text-blue-500/60 dark:text-blue-300/50">
        USD
      </span>
    </div>
  );
}

interface PeriodTableProps {
  data: GeneralAffairDepartment[];
  onSelectMMYear?: (mmYearTitle: string) => void;
}

function PeriodTable({ data, onSelectMMYear }: PeriodTableProps) {
  const { t } = useTranslation();

  const labelNamThang = t("namThang");
  const labelTongTien = `${t("tongTien")} (USD)`;

  const pairs = useMemo(() => {
    const result: (GeneralAffairDepartment | null)[][] = [];
    for (let i = 0; i < data.length; i += 2) {
      result.push([data[i], data[i + 1] ?? null]);
    }
    return result;
  }, [data]);

  const thBase =
    "px-3 py-2 text-[12px] font-bold uppercase tracking-[0.45px] text-blue-600/65 dark:text-blue-300/50";
  const borderCol = "border-slate-200 dark:border-white/[0.07]";

  const monthThClass = (hasHandler: boolean) =>
    [
      thBase,
      "text-center whitespace-nowrap border-b border-r last:border-r-0",
      borderCol,
      hasHandler
        ? "cursor-pointer select-none transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-300/10 dark:hover:text-blue-200"
        : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div
      className="w-full rounded-2xl border overflow-hidden
        border-slate-200 dark:border-white/[0.07]
        shadow-[0_2px_12px_rgba(15,37,68,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
    >
      <div className="hidden sm:block overflow-x-auto">
        <table
          className="w-full border-collapse"
          style={{ minWidth: `${data.length * 88 + 20}px` }}
        >
          <thead>
            <tr className="bg-slate-50 dark:bg-[rgba(15,27,48,0.6)]">
              <th
                className={`px-3 py-2 text-[15px] tracking-[0.45px] text-blue-600 dark:text-blue-300 text-center font-bold whitespace-nowrap border-b border-r last:border-r-0 ${borderCol}`}
              >
                {labelNamThang}
              </th>
              {data.map((d) => (
                <th
                  key={d.MMYear}
                  className={monthThClass(!!onSelectMMYear)}
                  onClick={() => onSelectMMYear?.(d.MMYear_Title)}
                  title={onSelectMMYear ? d.MMYear_Title : undefined}
                >
                  <span className="flex items-center justify-center gap-1">
                    {d.MMYear_Title}
                    {onSelectMMYear && (
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 10 10"
                        fill="none"
                        className="opacity-40 shrink-0"
                      >
                        <path
                          d="M2 8L8 2M8 2H3.5M8 2V6.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>

            <tr className="bg-white dark:bg-[rgba(15,27,48,0.45)]">
              <th
                className={`px-3 py-2 text-[15px] tracking-[0.45px] text-blue-600 dark:text-blue-300 text-center font-bold whitespace-nowrap border-b border-r last:border-r-0 ${borderCol}`}
              >
                {labelTongTien}
              </th>
              {data.map((d) => (
                <td
                  key={d.MMYear}
                  className={`px-3 py-2 text-center text-[13px] font-semibold whitespace-nowrap border-r last:border-r-0 ${borderCol}
                    text-blue-600 dark:text-blue-300`}
                >
                  {formatAmountFull(d.Amount)}
                </td>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      <div className="block sm:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[rgba(15,27,48,0.6)]">
              <th
                className={`${thBase} text-left px-4 border-b border-r w-1/4 ${borderCol}`}
              >
                {labelNamThang}
              </th>
              <th
                className={`${thBase} text-left px-4 border-b border-r w-1/4 ${borderCol}`}
              >
                {labelTongTien}
              </th>
              <th
                className={`${thBase} text-left px-4 border-b border-r w-1/4 ${borderCol}`}
              >
                {labelNamThang}
              </th>
              <th
                className={`${thBase} text-left px-4 border-b w-1/4 ${borderCol}`}
              >
                {labelTongTien}
              </th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair, rowIdx) => {
              const [a, b] = pair;
              const isLast = rowIdx === pairs.length - 1;
              const rowBorder = isLast ? "" : `border-b ${borderCol}`;
              const evenBg =
                rowIdx % 2 === 0
                  ? "bg-white dark:bg-[rgba(15,27,48,0.4)]"
                  : "bg-slate-50/60 dark:bg-[rgba(15,27,48,0.55)]";

              const clickableTd =
                "transition-colors " +
                (onSelectMMYear
                  ? "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-300/10 hover:text-blue-700 dark:hover:text-blue-200"
                  : "");

              return (
                <tr key={rowIdx} className={`${evenBg} ${rowBorder}`}>
                  <td
                    className={`px-4 py-2.5 text-[12px] font-semibold whitespace-nowrap border-r ${borderCol} text-slate-600 dark:text-white/65 ${a ? clickableTd : ""}`}
                    onClick={() => a && onSelectMMYear?.(a.MMYear_Title)}
                  >
                    <span className="flex items-center gap-1">
                      {a ? a.MMYear_Title : ""}
                      {a && onSelectMMYear && (
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 10 10"
                          fill="none"
                          className="opacity-35 shrink-0"
                        >
                          <path
                            d="M2 8L8 2M8 2H3.5M8 2V6.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap border-r ${borderCol} text-blue-600 dark:text-blue-300`}
                  >
                    {a ? formatAmountFull(a.Amount) : ""}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-[12px] font-semibold whitespace-nowrap border-r ${borderCol} text-slate-600 dark:text-white/65 ${b ? clickableTd : ""}`}
                    onClick={() => b && onSelectMMYear?.(b.MMYear_Title)}
                  >
                    <span className="flex items-center gap-1">
                      {b ? b.MMYear_Title : ""}
                      {b && onSelectMMYear && (
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 10 10"
                          fill="none"
                          className="opacity-35 shrink-0"
                        >
                          <path
                            d="M2 8L8 2M8 2H3.5M8 2V6.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap text-blue-600 dark:text-blue-300">
                    {b ? formatAmountFull(b.Amount) : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="w-full flex flex-col gap-5 animate-pulse">
      <div className="w-full h-67 rounded-[20px] border bg-slate-100 dark:bg-[rgba(15,27,48,0.5)] dark:border-white/[0.07] border-slate-200" />
      <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-[rgba(15,27,48,0.4)]" />
      <div className="h-20 w-full rounded-2xl bg-slate-100 dark:bg-[rgba(15,27,48,0.4)]" />
    </div>
  );
}

interface GeneralAffairDepartmentProps {
  data: GeneralAffairDepartment[] | null;
  loading?: boolean;
  onSelectMMYear?: (mmYearTitle: string) => void;
}

export default function GeneralAffairDepartment({
  data,
  loading,
  onSelectMMYear,
}: GeneralAffairDepartmentProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === "dark";
  const barColor = isDark ? "#60a5fa" : "#2563eb";

  const chartData = useMemo(
    () =>
      [...(data ?? [])].reverse().map((d) => ({
        ...d,
        monthLabel: toMonthLabel(d.MMYear_Title),
      })),
    [data],
  );

  if (loading) return <Skeleton />;

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <p className="text-sm text-slate-400 dark:text-white/30">
          {t("khongCoDuLieu")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5 animate-[ga-rise_0.38s_cubic-bezier(0.22,1,0.36,1)_both]">
      <div
        className="w-full rounded-[20px] border transition-[background,border-color,box-shadow] duration-300
          bg-white border-slate-200 shadow-[0_4px_20px_rgba(15,37,68,0.08)]
          dark:bg-[rgba(15,27,48,0.7)] dark:border-white/[0.07] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        style={{ padding: "24px 24px 16px" }}
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(15,37,68,0.08)"}
            />
            <XAxis
              dataKey="monthLabel"
              tick={{
                fontSize: 11,
                fontWeight: 600,
                fill: isDark ? "rgba(255,255,255,0.45)" : "rgba(15,37,68,0.5)",
              }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tickFormatter={formatAmount}
              tick={{
                fontSize: 11,
                fill: isDark ? "rgba(255,255,255,0.35)" : "rgba(15,37,68,0.4)",
              }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(37,99,235,0.05)",
                radius: 6,
              }}
            />
            <Bar
              dataKey="Amount"
              maxBarSize={56}
              shape={makeBarShape(barColor)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <SummaryBar data={data} />

      <PeriodTable data={data} onSelectMMYear={onSelectMMYear} />

      <style>{`
        @keyframes ga-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
