import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Gift, ChevronDown, Eye, EyeOff } from "lucide-react";
import type { ThirteenthSalary as ThirteenthSalaryType } from "../../../types/salary";
import salaryApi from "../../../api/features/salary";
import { useAppSelector } from "../../../hooks/auth";
import { AppAlert } from "../../../components/ui/AppAlert";
import { fmt, getApiErrorMessage } from "../../../libs/helper";
import Skeleton from "./Skeleton";
import RatingBadge from "./RatingBadge";
import { DetailRow } from "./DetailRow";
import { useTranslation } from "../../../hooks/useTranslation";

interface YearSelectProps {
  value: number;
  onChange: (year: number) => void;
}

function YearSelect({ value, onChange }: YearSelectProps) {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        btnRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  };

  return (
    <div>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="flex items-center gap-1.5 h-9 rounded-xl font-bold text-[14px] cursor-pointer
          bg-blue-50 dark:bg-blue-500/10
          text-blue-700 dark:text-blue-300
          border border-blue-200 dark:border-blue-400/20
          hover:bg-blue-100 dark:hover:bg-blue-500/15
          transition-colors"
        style={{ padding: "0 10px" }}
      >
        <span>{value}</span>
        <ChevronDown
          size={10}
          className={`text-blue-500 dark:text-blue-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-9999 rounded-2xl border
            bg-white dark:bg-[rgba(12,22,48,0.98)]
            border-slate-200 dark:border-white/10
            shadow-xl shadow-black/10 dark:shadow-black/50
            backdrop-blur-xl
            animate-[leave-drop_0.16s_cubic-bezier(0.22,1,0.36,1)]"
            style={{
              padding: "8px",
              minWidth: "180px",
              top: dropdownPos.top,
              right: dropdownPos.right,
            }}
          >
            <div className="grid grid-cols-4 gap-1">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    onChange(y);
                    setOpen(false);
                  }}
                  className={`rounded-lg text-[12px] font-semibold transition-colors cursor-pointer border-none
                  ${
                    y === value
                      ? "bg-blue-600 text-white"
                      : "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                  style={{ padding: "6px 0" }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

interface ThirteenthSalaryProps {
  revealed: boolean;
  onToggleReveal: () => void;
}

export default function ThirteenthSalary({
  revealed,
  onToggleReveal,
}: ThirteenthSalaryProps) {
  const { t } = useTranslation();

  const currentUser = useAppSelector((s) => s.auth.user);

  const defaultYear = new Date().getFullYear() - 1;
  const [year, setYear] = useState(defaultYear);
  const [data, setData] = useState<ThirteenthSalaryType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (y: number) => {
    setLoading(true);
    setData(null);
    try {
      const res = await salaryApi.getThirteenthSalary({
        factory: currentUser.factory,
        personId: currentUser.userId,
        year: String(y),
      });
      if (Array.isArray(res) && res.length === 0) {
        setData(null);
        return;
      }
      const obj = Array.isArray(res) ? res[0] : res;
      const isEmpty =
        !obj ||
        Object.values(obj).every(
          (v) => v === "" || v === null || v === undefined,
        );
      setData(isEmpty ? null : obj);
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(defaultYear);
  }, []);

  const handleYearChange = (y: number) => {
    setYear(y);
    fetchData(y);
  };

  return (
    <div className="w-full flex flex-col box-border">
      <div
        className="shrink-0 flex items-center gap-3 border-b transition-colors duration-300
          bg-white/80 dark:bg-[rgba(15,27,48,0.6)]
          border-black/[0.07] dark:border-white/[0.07]
          backdrop-blur-sm px-4 sm:px-6 py-3.5"
      >
        <div
          className="w-8.5 h-8.5 rounded-[9px] flex items-center justify-center shrink-0
            bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
        >
          <Gift size={18} />
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-[15px] font-bold leading-none m-0 text-slate-800 dark:text-white/90">
            {t("luongThuong")}
          </h1>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
            {year}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <YearSelect value={year} onChange={handleYearChange} />
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

      <div className="flex-1 min-h-[85vh] p-3 sm:p-5 flex items-center justify-center">
        {loading ? (
          <Skeleton />
        ) : !data ? (
          <div
            className="flex flex-col items-center justify-center gap-3 py-20
            text-slate-400 dark:text-white/30"
          >
            <Gift size={40} strokeWidth={1.2} />
            <p className="text-[14px] m-0">{t("khongCoDuLieu")}</p>
          </div>
        ) : (
          <div
            key={year}
            className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto
              animate-[t13-rise_0.3s_cubic-bezier(0.22,1,0.36,1)_both]"
          >
            <div
              className="lg:w-85 shrink-0 rounded-[18px] sm:rounded-[22px] border
                overflow-hidden flex flex-col
                bg-white dark:bg-[rgba(15,27,48,0.82)]
                border-slate-200 dark:border-white/[0.07]
                shadow-[0_4px_24px_rgba(15,37,68,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
            >
              <div
                className="px-5 pt-5 pb-6 flex flex-col gap-3
                  bg-linear-to-br from-amber-50 to-orange-50
                  dark:from-amber-900/20 dark:to-orange-900/10
                  border-b border-amber-100 dark:border-amber-500/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="text-[11px] font-semibold uppercase tracking-widest
                      text-amber-600/70 dark:text-amber-400/60 m-0 leading-none"
                    >
                      {t("luongThang13")}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 m-0">
                      {data.Year}
                    </p>
                  </div>

                  {/* <RatingBadge rating={data.Rating} revealed={revealed} /> */}
                </div>

                <div>
                  <p className="text-[11px] text-slate-400 dark:text-white/40 m-0 mb-1">
                    {t("thucLanh")}
                  </p>
                  <p
                    className="text-[28px] sm:text-[32px] font-black tabular-nums m-0 leading-none
                      text-amber-600 dark:text-amber-400"
                  >
                    {revealed
                      ? (data.Actually_Received ?? 0).toLocaleString("vi-VN") +
                        " VNĐ"
                      : "•••••••••"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    { label: "hoVaTen", value: data.Person_Name },
                    { label: "donVi", value: data.Department_Name },
                    // { label: "Chức vụ", value: data.Position_ID },
                    // { label: "Loại HĐ", value: data.Standard_Type || "—" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                        bg-white/70 dark:bg-white/5
                        border border-amber-300 dark:border-white/6"
                    >
                      <span className="text-[10px] text-slate-400 dark:text-white/40">
                        {t(item.label)}:
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-white/80">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 dark:text-white/40 m-0">
                    {t("xepLoai")}
                  </p>
                  <div className="mt-1.5">
                    <RatingBadge rating={data.Rating} revealed={revealed} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 dark:text-white/40 m-0">
                    {t("ngayVaoCongTy")}
                  </p>
                  <p className="text-[13px] font-bold text-slate-700 dark:text-white/80 mt-0.5 m-0">
                    {data.Date_Come_In}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="flex-1 rounded-[18px] sm:rounded-[22px] border
                overflow-hidden
                bg-white dark:bg-[rgba(15,27,48,0.82)]
                border-slate-200 dark:border-white/[0.07]
                shadow-[0_4px_24px_rgba(15,37,68,0.07)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
            >
              <div
                className="flex items-center gap-2.5 px-5 py-3.5 border-b
                  border-slate-100 dark:border-white/6
                  bg-slate-50/60 dark:bg-white/3"
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0
                    bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400"
                >
                  <Gift size={13} />
                </div>
                <h2
                  className="text-[12px] font-bold m-0 uppercase tracking-wider
                  text-slate-600 dark:text-white/60"
                >
                  {t("thuongThang13")}
                </h2>
              </div>

              <div className="px-5 pb-4 pt-1">
                <DetailRow
                  label="soThangDuocThuong"
                  value={fmt(data.Number_Month_Bonus, revealed, true)}
                />
                <DetailRow
                  label="luongPhuCap"
                  value={fmt(data.Salary_And_Allowance, revealed)}
                  accent="blue"
                />
                <DetailRow
                  label="luongThang13"
                  value={fmt(data.Salary_Month_13, revealed)}
                  accent="amber"
                  bold
                />
                <DetailRow
                  label="heSoBinhBau"
                  value={fmt(data.Rating_Coefficient, revealed, true)}
                />
                <DetailRow
                  label="thuongBinhBau"
                  value={fmt(data.Rating_Bonus, revealed)}
                  accent="green"
                />
                <DetailRow
                  label="thuongNgayCongCao"
                  value={fmt(data.High_Workday_Bonus, revealed)}
                  accent="green"
                />

                <div
                  className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl
                    bg-amber-50 dark:bg-amber-900/15
                    border border-amber-200/70 dark:border-amber-500/20"
                >
                  <span className="text-[13px] font-bold text-amber-700 dark:text-amber-300">
                    {t("tongTienThuong")}
                  </span>
                  <span className="text-[15px] font-black tabular-nums text-amber-600 dark:text-amber-400">
                    {fmt(data.Total_Bonus, revealed)}
                  </span>
                </div>

                <div
                  className="mt-2 flex items-center justify-between px-4 py-2.5 rounded-xl
                  bg-red-50/70 dark:bg-red-900/10
                  border border-red-100 dark:border-red-500/15"
                >
                  <span className="text-[12.5px] font-semibold text-red-500 dark:text-red-400">
                    {t("thueTNCN")}
                  </span>
                  <span className="text-[13px] font-bold tabular-nums text-red-500 dark:text-red-400">
                    {fmt(data.Personal_Income_Tax, revealed)}
                  </span>
                </div>

                {/* <div
                  className="mt-2 flex items-center justify-between px-4 py-3.5 rounded-xl
                    bg-blue-600 dark:bg-blue-700/80"
                >
                  <span className="text-[13px] font-bold text-white/90">
                    Thực lĩnh
                  </span>
                  <span className="text-[17px] font-black tabular-nums text-white">
                    {fmt(data.Actually_Received, revealed)}
                  </span>
                </div> */}

                {data.Note && (
                  <p className="mt-3 text-[11.5px] text-slate-400 dark:text-white/30 italic leading-relaxed m-0">
                    * {data.Note}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes t13-rise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
