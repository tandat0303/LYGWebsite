import { useState } from "react";
import { Search, X } from "lucide-react";
import type { GeneralAffairFactory } from "../../../types/generalAffair";
import { useTranslation } from "../../../hooks/useTranslation";

function formatAmountFull(amount: number): string {
  return amount.toLocaleString("en-US");
}

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

function SearchInput({ value, onChange, disabled }: SearchInputProps) {
  const { t } = useTranslation();

  return (
    <div className="relative w-full">
      <Search
        size={14}
        strokeWidth={2.3}
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none
          text-slate-400 dark:text-white/30"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={t("timKiem", undefined, true)}
        className="w-full h-9 rounded-xl border pl-8 pr-8 text-[13px] font-medium
          outline-none transition-all duration-150
          bg-white border-slate-200 text-slate-700 placeholder:text-slate-400
          focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15
          dark:bg-[rgba(15,27,48,0.6)] dark:border-white/8
          dark:text-white/85 dark:placeholder:text-white/25
          dark:focus:border-blue-400/60 dark:focus:ring-blue-400/10
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2
            flex items-center justify-center w-4 h-4 rounded-full
            text-slate-400 hover:text-slate-600
            dark:text-white/30 dark:hover:text-white/60
            bg-transparent border-0 cursor-pointer p-0
            transition-colors duration-150"
          aria-label="Clear search"
        >
          <X size={11} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

function FactoryCard({
  item,
  onClick,
}: {
  item: GeneralAffairFactory;
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
            ? "cursor-pointer hover:shadow-[0_4px_20px_rgba(15,37,68,0.14)] hover:-translate-y-0.5 hover:border-blue-200 dark:hover:border-blue-300/18 dark:hover:shadow-[0_6px_24px_rgba(0,0,0,0.38)]"
            : ""
        }`}
      style={{ padding: "14px 16px" }}
    >
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <p className="m-0 text-[13px] font-bold leading-snug text-slate-800 dark:text-white/90 mb-0.5">
          {item.Names}
        </p>
        <div className="flex items-baseline gap-1 rounded-full px-3 py-0.5 bg-blue-50 dark:bg-blue-300/8">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-300">
            {formatAmountFull(item.Amount)}
          </span>
          <span className="text-[11px] font-semibold text-blue-500/70 dark:text-blue-300/55">
            USD
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10.5px] font-medium text-slate-400 dark:text-white/30">
          {item.DepID}
        </span>
        {/* <span className="text-[10.5px] font-medium text-slate-400 dark:text-white/30">
          {item.StartDate} – {item.EndDate}
        </span> */}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border animate-pulse h-27.5
        bg-slate-100 border-slate-200
        dark:bg-[rgba(15,27,48,0.4)] dark:border-white/[0.07]"
    />
  );
}

interface GeneralAffairFactoryProps {
  data: GeneralAffairFactory[] | null;
  loading?: boolean;
  onSelectItem?: (item: GeneralAffairFactory) => void;
}

export default function GeneralAffairFactory({
  data,
  loading,
  onSelectItem,
}: GeneralAffairFactoryProps) {
  const { t } = useTranslation();

  const [query, setQuery] = useState("");

  const filtered = data
    ? query.trim() === ""
      ? data
      : data.filter((d) => d.Names.toLowerCase().includes(query.toLowerCase()))
    : null;

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <SearchInput value="" onChange={() => {}} disabled />
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <p className="text-sm text-slate-400 dark:text-white/30">
          {t("khongCoDuLieu")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-[ga-rise_0.36s_cubic-bezier(0.22,1,0.36,1)_both]">
      <SearchInput value={query} onChange={setQuery} />

      {filtered && filtered.length > 0 ? (
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
          }}
        >
          {filtered.map((item, i) => (
            <FactoryCard
              key={`${item.DepID}-${i}`}
              item={item}
              onClick={onSelectItem ? () => onSelectItem(item) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-14 gap-2">
          <Search size={30} className="text-slate-300 dark:text-white/20" />
          <p className="text-sm text-slate-400 dark:text-white/30 m-0">
            No results for &ldquo;{query}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-[12px] font-medium text-blue-500 dark:text-blue-400
              bg-transparent border-0 cursor-pointer p-0 mt-0.5
              hover:underline focus-visible:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
