import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  accent?: "red";
}

export function Collapsible({
  title,
  defaultOpen = false,
  children,
  accent,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] overflow-hidden mb-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left cursor-pointer transition-colors duration-150
          ${
            open
              ? "bg-slate-50 dark:bg-white/5"
              : "bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/3"
          }`}
      >
        <span
          className={`text-[12px] sm:text-[13px] font-bold uppercase tracking-widest
            ${
              accent === "red"
                ? "text-red-500 dark:text-red-400"
                : "text-slate-600 dark:text-white/60"
            }`}
        >
          {title}
        </span>
        {open ? (
          <ChevronDown
            size={15}
            className="text-slate-400 dark:text-white/30 shrink-0"
          />
        ) : (
          <ChevronRight
            size={15}
            className="text-slate-400 dark:text-white/30 shrink-0"
          />
        )}
      </button>

      {open && (
        <div className="px-3.5 pb-1 pt-0.5 bg-white dark:bg-[rgba(15,27,48,0.5)]">
          {children}
        </div>
      )}
    </div>
  );
}
