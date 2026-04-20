import { useEffect, useRef, useState } from "react";

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
    <>
      <div ref={ref} className="relative w-full">
        <div
          className="flex items-center gap-[7px] w-full bg-transparent
                      border-none cursor-pointer text-[14px] font-medium
                      transition-colors duration-180 ui-inline-select__trigger"
          style={{ padding: "2px 0 4px" }}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex-1 text-left">
            {current?.label || "Chọn hình thức"}
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
        {open && (
          <div
            className="absolute top-[calc(100%+6px)] left-0 w-full mix-w-160 z-99
                          rounded-[10px] overflow-hidden p-4 animate-[ui-drop_0.16s_cubic-bezier(0.22,1,0.36,1)]
                          ui-inline-select__dropdown"
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`flex items-center justify-between rounded-[7px]
                            text-[13.5px] cursor-pointer transition-colors duration-130
                            ui-inline-select__option 
                            ${opt.value === selected ? "is-selected" : ""}`}
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
      </div>

      <style>
        {`
          .ui-inline-select__trigger {
            border-bottom: 1.5px solid var(--ui-input-border);
          }
          .dark .ui-inline-select__trigger  { color: rgba(255,255,255,0.88); border-bottom-color: #93c5fd; }
          .light .ui-inline-select__trigger { color: #0f172a; border-bottom-color: #2563eb; }
          
          @keyframes ui-drop {
            from { opacity: 0; transform: translateY(-6px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .dark .ui-inline-select__dropdown  {
            background: rgba(12,28,56,0.96);
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 12px 40px rgba(0,0,0,0.5);
            backdrop-filter: blur(20px);
          }
          .light .ui-inline-select__dropdown {
            background: #fff;
            border: 1px solid rgba(0,0,0,0.08);
            box-shadow: 0 12px 40px rgba(15,37,68,0.12);
          }

          .dark .ui-inline-select__option  { color: rgba(255,255,255,0.72); }
          .light .ui-inline-select__option { color: #0f172a; }
          .dark .ui-inline-select__option:hover  { background: rgba(147,197,253,0.1); color: #fff; }
          .light .ui-inline-select__option:hover { background: rgba(37,99,235,0.07); }
          .dark .ui-inline-select__option.is-selected  { background: rgba(37,99,235,0.22); color: #93c5fd; font-weight: 600; }
          .light .ui-inline-select__option.is-selected { background: rgba(37,99,235,0.1); color: #2563eb; font-weight: 600; }
      `}
      </style>
    </>
  );
}
