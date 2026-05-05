import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../../../hooks/useTranslation";

export default function InlineSelect({
  initial,
  options,
  onSave,
  //   onCancel,
}: {
  initial: string;
  options: { label: string; value: string }[];
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onSave(selected);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onSave, selected]);

  const current = options.find((o) => o.value === selected);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <div
        className="
          flex items-center gap-1.75 w-full bg-transparent border-x-0 border-t-0
          border-b-[1.5px] cursor-pointer text-[14px] font-medium
          transition-colors duration-180
          text-slate-800 border-b-blue-500/50
          dark:text-white/88 dark:border-b-[#93c5fd]
        "
        style={{ padding: "2px 0 4px" }}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex-1 text-left truncate">
          {t(current?.label || "chonPhuongTienDiChuyen")}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            flexShrink: 0,
            opacity: 0.5,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.18s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute bottom-[calc(100%+6px)] left-0 w-full min-w-40 z-99
            rounded-[10px] overflow-hidden p-1
            animate-[ui-drop_0.16s_cubic-bezier(0.22,1,0.36,1)]
            bg-white border border-black/8 shadow-[0_12px_40px_rgba(15,37,68,0.12)]
            dark:bg-[rgba(12,28,56,0.96)] dark:border-white/10 dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] dark:backdrop-blur-xl
          "
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`
                flex items-center justify-between rounded-[7px]
                text-[13.5px] cursor-pointer transition-colors duration-130
                ${
                  opt.value === selected
                    ? "bg-blue-500/10 text-blue-600 font-semibold dark:bg-blue-500/22 dark:text-[#93c5fd]"
                    : "text-slate-800 hover:bg-blue-500/[0.07] dark:text-white/72 dark:hover:bg-blue-300/10 dark:hover:text-white"
                }
              `}
              style={{ padding: "9px 11px" }}
              onMouseDown={(e) => {
                e.preventDefault();
                setSelected(opt.value);
                onSave(opt.value);
              }}
            >
              {opt.label}
              {opt.value === selected && (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes ui-drop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
