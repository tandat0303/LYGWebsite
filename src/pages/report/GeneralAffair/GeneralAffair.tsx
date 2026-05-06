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
import type { GeneralAffair } from "../../../types/generalAffair";
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

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; payload: GeneralAffair }[];
  label?: string;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-xl border shadow-xl text-sm
        bg-white/95 border-slate-200/80 text-slate-700
        dark:bg-[rgba(15,27,48,0.95)] dark:border-white/10 dark:text-white/88"
      style={{ padding: "10px 14px", backdropFilter: "blur(8px)" }}
    >
      <p className="font-bold m-0 mb-1 text-slate-800 dark:text-white/92">
        {d.Title_Fty}
      </p>
      {/* <p className="m-0 text-[11.5px] text-slate-500 dark:text-white/44 mb-1">
        {d.Fty}
      </p> */}
      <p className="m-0 font-semibold text-blue-600 dark:text-blue-300">
        {formatAmountFull(d.Amount)}{" "}
        <span className="text-[11px] font-normal opacity-70">USD</span>
      </p>
    </div>
  );
}

function RecordCard({
  item,
  // index,
  onClick,
}: {
  item: GeneralAffair;
  index: number;
  onClick?: () => void;
}) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={`rounded-2xl border transition-all duration-200
        bg-white border-slate-200 shadow-[0_2px_12px_rgba(15,37,68,0.07)]
        dark:bg-[rgba(15,27,48,0.65)] dark:border-white/[0.07]
        dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)]
        ${
          onClick
            ? "cursor-pointer hover:shadow-[0_4px_20px_rgba(15,37,68,0.14)] hover:-translate-y-0.5 dark:hover:shadow-[0_6px_24px_rgba(0,0,0,0.38)] hover:border-blue-200 dark:hover:border-blue-300/[0.18)]"
            : ""
        }`}
      style={{ padding: "16px 20px" }}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold
            bg-blue-100 text-blue-600 dark:bg-blue-300/12 dark:text-blue-300/80"
        >
          {index + 1}
        </span> */}
        <p className="m-0 text-sm font-semibold leading-snug text-slate-800 dark:text-white/90">
          {item.Title_Fty}
        </p>
        {/* <p className="m-0 text-[11.5px] font-medium text-slate-500 dark:text-white/44">
          {item.Title_MeNu}
        </p> */}

        <div
          className="flex items-baseline gap-1 rounded-full px-3 py-0.5
            bg-blue-50 dark:bg-blue-300/8"
        >
          <span className="text-base font-bold text-blue-600 dark:text-blue-300">
            {formatAmountFull(item.Amount)}
          </span>
          <span className="text-[11px] font-semibold text-blue-500/70 dark:text-blue-300/55">
            USD
          </span>
        </div>
      </div>

      <div className="h-px my-3 bg-slate-100 dark:bg-white/6" />

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <MetaItem label="nhaMay" value={item.Fty} />
        <MetaItem
          label="khoangThoiGian"
          value={`${item.StartDate} – ${item.EndDate}`}
        />
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-px">
      <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-blue-600/60 dark:text-blue-300/45">
        {t(label, undefined, true)}
      </span>
      <span className="text-[12px] font-medium text-slate-600 dark:text-white/65">
        {value || "—"}
      </span>
    </div>
  );
}

interface GeneralAffairProps {
  data: GeneralAffair[] | null;
  loading?: boolean;
  onSelectRecord?: (record: GeneralAffair) => void;
}

export default function GeneralAffair({
  data,
  loading,
  onSelectRecord,
}: GeneralAffairProps) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const chartData = useMemo(() => data ?? [], [data]);

  const makeBarShape =
    (colors: string[]) => (props: RectangleProps & { index?: number }) => {
      const { x, y, width, height, index = 0 } = props;
      if (!width || !height || height <= 0) return null;
      const fill = colors[index % colors.length];
      const r = Math.min(6, width / 2);
      return (
        <path
          d={`M${x},${(y as number) + r}
             Q${x},${y} ${(x as number) + r},${y}
             H${(x as number) + (width as number) - r}
             Q${(x as number) + (width as number)},${y} ${(x as number) + (width as number)},${(y as number) + r}
             V${(y as number) + (height as number)}
             H${x}Z`}
          fill={fill}
          opacity={0.88}
        />
      );
    };

  const BAR_COLORS_LIGHT = [
    "#2563eb",
    "#3b82f6",
    "#60a5fa",
    "#1d4ed8",
    "#7c3aed",
    "#0ea5e9",
    "#0284c7",
    "#4f46e5",
    "#0891b2",
    "#1e40af",
  ];
  const BAR_COLORS_DARK = [
    "#60a5fa",
    "#93c5fd",
    "#3b82f6",
    "#818cf8",
    "#7dd3fc",
    "#6366f1",
    "#38bdf8",
    "#a78bfa",
    "#0ea5e9",
    "#4f46e5",
  ];
  const barColors = isDark ? BAR_COLORS_DARK : BAR_COLORS_LIGHT;

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-5 animate-pulse">
        <div className="w-full h-70 rounded-[20px] border bg-slate-100 dark:bg-[rgba(15,27,48,0.5)] dark:border-white/[0.07] border-slate-200" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-100 dark:bg-[rgba(15,27,48,0.4)]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <p className="text-sm text-slate-400 dark:text-white/30">
          No data available.
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
        {/* <p className="m-0 mb-4 text-[11px] font-bold uppercase tracking-[0.6px] text-blue-600/70 dark:text-blue-300/55">
          Amount by Factory
        </p> */}

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
              dataKey="Fty"
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
              shape={makeBarShape(barColors)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        {/* <p className="m-0 mb-3 text-[11px] font-bold uppercase tracking-[0.6px] text-blue-600/70 dark:text-blue-300/55">
          Records ({data.length})
        </p> */}
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          }}
        >
          {data.map((item, i) => (
            <RecordCard
              key={`${item.Fty}-${item.ID_Account}-${i}`}
              item={item}
              index={i}
              onClick={onSelectRecord ? () => onSelectRecord(item) : undefined}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ga-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
