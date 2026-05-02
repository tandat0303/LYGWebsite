import { PhoneCall } from "lucide-react";
import type { ContactProps } from "../../types/contact";
import { ContactGroupCard } from "./ContactGroupCard";
import { useTranslation } from "../../hooks/useTranslation";

export default function Contact({ groups, loading = false }: ContactProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-full box-border overflow-x-hidden p-6">
      {/* Page header */}
      <div className="flex items-center gap-3" style={{ marginBottom: "22px" }}>
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0
          bg-blue-500/15 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400"
        >
          <PhoneCall size={16} strokeWidth={2} />
        </div>
        <h1 className="text-[20px] font-bold m-0 text-slate-800 dark:text-white/90">
          {t("lienHe")}
        </h1>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-6">
          {[3, 2].map((rows, gi) => (
            <div key={gi} className="flex flex-col gap-2">
              <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-white/[0.07] animate-pulse ml-1" />
              <div
                className="rounded-2xl overflow-hidden border bg-white dark:bg-[rgba(15,27,48,0.65)]
                border-slate-200 dark:border-white/[0.07]"
              >
                {Array.from({ length: rows }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 animate-pulse
                      ${i < rows - 1 ? "border-b border-slate-100 dark:border-white/5" : ""}`}
                    style={{ padding: "13px 16px" }}
                  >
                    <div className="w-[42px] h-[42px] rounded-full bg-slate-200 dark:bg-white/8 shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-3 w-32 rounded bg-slate-200 dark:bg-white/8" />
                      <div className="h-3 w-48 rounded bg-slate-200 dark:bg-white/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Groups */}
      {!loading && groups.length === 0 && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-20
      text-slate-400 dark:text-white/30"
        >
          <PhoneCall size={40} strokeWidth={1.5} />
          <p className="text-[14px] m-0">No contact available</p>
        </div>
      )}

      {!loading && groups.length > 0 && (
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 420px), 1fr))",
          }}
        >
          {groups.map((group, index) => {
            const globalIndex = groups
              .slice(0, index)
              .reduce((sum, g) => sum + g.value.length, 0);
            return (
              <ContactGroupCard
                key={group.name}
                group={group}
                globalIndex={globalIndex}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
