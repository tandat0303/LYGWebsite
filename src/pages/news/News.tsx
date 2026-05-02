import { useState } from "react";
import { Newspaper } from "lucide-react";
import type { NewsProps } from "../../types/news";
import { NewsCard } from "./NewsCard";
import { useTranslation } from "../../hooks/useTranslation";

export default function News({ items, onSelect, loading = false }: NewsProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"all" | "thong-bao" | "ban-tin">("all");

  const filtered = items.filter((i) => {
    if (filter === "thong-bao") return i.post_type === true;
    if (filter === "ban-tin") return i.post_type === false;
    return true;
  });

  const tabs = [
    { key: "all", label: "all" },
    { key: "thong-bao", label: "thongBao" },
    { key: "ban-tin", label: "banTin" },
  ] as const;

  return (
    <div className="w-full min-h-full box-border overflow-x-hidden p-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h1 className="text-[20px] font-bold m-0 text-slate-800 dark:text-white/90">
          {t("banTin")}
        </h1>

        <div
          className="flex items-center gap-1 rounded-xl p-1
            bg-slate-100 dark:bg-white/6
            border border-slate-200 dark:border-white/[0.07]"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`rounded-lg text-[12px] font-semibold cursor-pointer border-none
                transition-all duration-160
                ${
                  filter === tab.key
                    ? "bg-white dark:bg-blue-500/25 text-blue-600 dark:text-blue-300 shadow-sm"
                    : "bg-transparent text-slate-500 dark:text-white/45 hover:text-slate-700 dark:hover:text-white/70"
                }`}
              style={{ padding: "5px 14px" }}
              onClick={() => setFilter(tab.key)}
            >
              {t(tab.label)}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse
              bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/[0.07]"
            >
              <div className="aspect-16/10 bg-slate-200 dark:bg-white/8" />
              <div
                style={{ padding: "14px 16px 16px" }}
                className="flex flex-col gap-2"
              >
                <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/[0.07]" />
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-white/[0.07]" />
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-white/[0.07]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <>
          <div className="hidden sm:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            <style>{`
              @media (max-width: 1280px) { .news-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; } }
              @media (max-width: 900px)  { .news-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; } }
            `}</style>
            <div className="news-grid contents">
              {filtered.map((item) => (
                <NewsCard key={item.id} item={item} onSelect={onSelect} />
              ))}
            </div>
          </div>

          <div className="flex sm:hidden flex-col gap-3">
            {filtered.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                onSelect={onSelect}
                horizontal
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              className="flex flex-col items-center justify-center gap-3 py-20
              text-slate-400 dark:text-white/30"
            >
              <Newspaper size={40} strokeWidth={1.5} />
              <p className="text-[14px] m-0">No news available</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
