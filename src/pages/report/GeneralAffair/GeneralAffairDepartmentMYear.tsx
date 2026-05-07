import { useState, useEffect, useMemo } from "react";
import type { GeneralAffairDepartmentMYearPayload } from "../../../types/generalAffair";
import generalAffairApi from "../../../api/features/report/generalAffair";
import { AppAlert } from "../../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../../libs/helper";
import { useTranslation } from "../../../hooks/useTranslation";

type RawRow = Record<string, string | number | null>;

interface ParsedRow {
  clbh: string;
  ywpm: string;
  zwpm: string;

  months: Record<string, number | null>;
}

interface MonthColumn {
  prefixKey: string;
  label: string;
  rawKey: string;
}

interface FixedFieldMeta {
  prefix: string;
  rawKey: string;
}

function parseRows(raw: RawRow[]): {
  rows: ParsedRow[];
  columns: MonthColumn[];
  fixedFields: FixedFieldMeta[];
} {
  if (!raw.length) return { rows: [], columns: [], fixedFields: [] };

  const firstRowKeys = Object.keys(raw[0]);

  const fixedFields: FixedFieldMeta[] = ["10", "11", "12"]
    .map((prefix) => ({
      prefix,
      rawKey: firstRowKeys.find((k) => k.startsWith(prefix)) ?? "",
    }))
    .filter((f) => f.rawKey !== "");

  const colMap = new Map<string, MonthColumn>();
  for (const key of firstRowKeys) {
    const m = key.match(/^(9\d)(.+)$/);
    if (m) colMap.set(m[1], { prefixKey: m[1], label: m[2], rawKey: key });
  }

  const columns = [...colMap.values()].sort(
    (a, b) => Number(a.prefixKey) - Number(b.prefixKey),
  );

  const rows: ParsedRow[] = raw.map((row) => {
    const clbhKey = Object.keys(row).find((k) => k.startsWith("10")) ?? "";
    const ywpmKey = Object.keys(row).find((k) => k.startsWith("11")) ?? "";
    const zwpmKey = Object.keys(row).find((k) => k.startsWith("12")) ?? "";

    const months: Record<string, number | null> = {};
    for (const col of columns) {
      const v = row[col.rawKey];
      months[col.prefixKey] = typeof v === "number" ? v : null;
    }

    return {
      clbh: String(row[clbhKey] ?? ""),
      ywpm: String(row[ywpmKey] ?? ""),
      zwpm: String(row[zwpmKey] ?? ""),
      months,
    };
  });

  return { rows, columns, fixedFields };
}

function toYearParam(mmYearTitle: string): string {
  const parts = mmYearTitle.split("/");
  if (parts.length === 2) {
    return parts[0].length === 4
      ? `${parts[0]}${parts[1]}`
      : `${parts[1]}${parts[0]}`;
  }
  return mmYearTitle;
}

function formatNum(v: number | null): string {
  if (v === null || v === undefined) return "—";
  return v.toLocaleString("en-US");
}

function Skeleton() {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse">
      <div className="h-10 w-48 rounded-xl bg-slate-100 dark:bg-[rgba(15,27,48,0.45)]" />
      <div
        className="h-72 w-full rounded-2xl border
          bg-slate-100 border-slate-200
          dark:bg-[rgba(15,27,48,0.4)] dark:border-white/[0.07]"
      />
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="w-full flex items-center justify-center py-16">
      <p className="text-sm text-slate-400 dark:text-white/30">
        {t("khongCoDuLieu")}
      </p>
    </div>
  );
}

interface SummaryBarProps {
  columns: MonthColumn[];
}

function SummaryBar({ columns }: SummaryBarProps) {
  if (!columns.length) return null;
  const from = columns[0].label;
  const to = columns[columns.length - 1].label;
  return (
    <div
      className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl px-4 py-2.5 border
        bg-blue-50/60 border-blue-100
        dark:bg-blue-300/5 dark:border-blue-300/10"
    >
      <span className="text-[13px] font-semibold text-slate-600 dark:text-white/55">
        {from}
      </span>
      <span className="text-[11px] text-slate-400 dark:text-white/25">–</span>
      <span className="text-[13px] font-semibold text-slate-600 dark:text-white/55">
        {to}
      </span>
    </div>
  );
}

interface MYearTableProps {
  rows: ParsedRow[];
  columns: MonthColumn[];
  fixedFields: FixedFieldMeta[];
}

function MYearTable({ rows, columns, fixedFields }: MYearTableProps) {
  const borderCol = "border-slate-200 dark:border-white/[0.07]";

  const thBase =
    `px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.5px] whitespace-nowrap ` +
    `text-blue-600/70 dark:text-blue-300/55 border-b border-r last:border-r-0 ${borderCol}`;

  const fixedLabel = (prefix: string) => {
    const rawKey =
      fixedFields.find((f) => f.prefix === prefix)?.rawKey ?? prefix;
    return rawKey.replace(/^\d+/, "");
  };

  return (
    <div
      className={
        "w-full rounded-2xl border overflow-hidden " +
        "border-slate-200 dark:border-white/[0.07] " +
        "shadow-[0_2px_12px_rgba(15,37,68,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
      }
    >
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse"
          style={{ minWidth: `${Math.max(560, columns.length * 96 + 500)}px` }}
        >
          <thead>
            <tr className="bg-slate-50 dark:bg-[rgba(15,27,48,0.65)]">
              // sticky left-0 z-10
              <th
                className={
                  `${thBase} text-left  ` +
                  "bg-slate-50 dark:bg-[rgba(15,27,48,0.65)] min-w-27 w-27"
                }
              >
                {fixedLabel("10")}
              </th>
              <th className={`${thBase} text-left min-w-50`}>
                {fixedLabel("11")}
              </th>
              <th className={`${thBase} text-left min-w-50`}>
                {fixedLabel("12")}
              </th>
              {columns.map((col) => (
                <th
                  key={col.prefixKey}
                  className={`${thBase} text-center min-w-20`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIdx) => {
              const isEven = rowIdx % 2 === 0;
              const isLast = rowIdx === rows.length - 1;
              const rowBg = isEven
                ? "bg-white dark:bg-[rgba(15,27,48,0.4)]"
                : "bg-slate-50/60 dark:bg-[rgba(15,27,48,0.55)]";

              return (
                <tr
                  key={`${row.clbh}-${rowIdx}`}
                  className={
                    `${rowBg} group transition-colors ` +
                    "hover:bg-blue-50/40 dark:hover:bg-blue-300/4 " +
                    (!isLast ? `border-b ${borderCol}` : "")
                  }
                >
                  // sticky left-0 z-10
                  <td
                    className={
                      "px-3 py-2.5 font-mono text-[11px] font-semibold " +
                      "whitespace-nowrap border-r " +
                      `${borderCol} ${rowBg} ` +
                      "text-slate-500 dark:text-white/45 " +
                      "group-hover:bg-blue-50/40 dark:group-hover:bg-blue-300/4"
                    }
                  >
                    {row.clbh}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-[12px] font-medium border-r ${borderCol} text-slate-700 dark:text-white/80 wrap-break-words`}
                  >
                    {row.ywpm}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-[12px] font-medium border-r ${borderCol} text-slate-700 dark:text-white/80 warp-break-words`}
                  >
                    {row.zwpm}
                  </td>
                  {columns.map((col) => {
                    const val = row.months[col.prefixKey];
                    return (
                      <td
                        key={col.prefixKey}
                        className={
                          "px-3 py-2.5 text-center text-[12px] font-semibold " +
                          "tabular-nums whitespace-nowrap border-r last:border-r-0 " +
                          borderCol +
                          " " +
                          (val !== null
                            ? "text-blue-600 dark:text-blue-300"
                            : "text-slate-300 dark:text-white/15")
                        }
                      >
                        {formatNum(val)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface GeneralAffairDepartmentMYearProps {
  depId: string;
  factory: string;
  initialMMYear: string;
}

export default function GeneralAffairDepartmentMYear({
  depId,
  factory,
  initialMMYear,
}: GeneralAffairDepartmentMYearProps) {
  const [rawData, setRawData] = useState<RawRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  const yearParam = useMemo(() => toYearParam(initialMMYear), [initialMMYear]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setRawData(null);
      try {
        const res = await generalAffairApi.getGeneralAffairDepartmentMYear({
          depId,
          factory,
          year: yearParam,
        } as GeneralAffairDepartmentMYearPayload);
        if (!cancelled) setRawData(res as RawRow[]);
      } catch (error) {
        if (!cancelled) {
          AppAlert({ icon: "error", title: getApiErrorMessage(error) });
          setRawData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [depId, factory, yearParam]);

  const { rows, columns, fixedFields } = useMemo(
    () => parseRows(rawData ?? []),
    [rawData],
  );

  return (
    <div className="w-full flex flex-col gap-4 animate-[ga-rise_0.36s_cubic-bezier(0.22,1,0.36,1)_both]">
      {!loading && columns.length > 0 && <SummaryBar columns={columns} />}

      {loading ? (
        <Skeleton />
      ) : !rawData || rawData.length === 0 ? (
        <EmptyState />
      ) : (
        <MYearTable rows={rows} columns={columns} fixedFields={fixedFields} />
      )}

      <style>{`
        @keyframes ga-rise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
