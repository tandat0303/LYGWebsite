import { useRef, useState } from "react";

export default function InlineTextInput({
  initial,
  onSave,
  onCancel,
  onChange,
  placeholder = "",
}: {
  initial: string;
  onSave: (v: string) => void;
  onCancel: () => void;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState(initial);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={ref}
        className="w-full bg-transparent border-none outline-none
                    transition-colors duration-180 text-[14px] font-medium
                    ui-inline-input"
        style={{ padding: "2px 0 4px" }}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSave(value);
          } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        onBlur={() => onSave(value)}
        autoFocus
      />

      <style>
        {`
          .ui-inline-input {
            border-bottom: 1.5px solid var(--ui-input-border);
            caret-color: var(--ui-caret);
          }
          .dark  { --ui-input-border: rgba(147,197,253,0.5); --ui-caret: #93c5fd; }
          .light { --ui-input-border: rgba(37,99,235,0.5);   --ui-caret: #2563eb; }
          .dark .ui-inline-input  { color: rgba(255,255,255,0.92); }
          .light .ui-inline-input { color: #0f172a; }
          .ui-inline-input::placeholder {
            transition: color 0.3s;
          }
          .dark .ui-inline-input::placeholder  { color: rgba(255,255,255,0.22); }
          .light .ui-inline-input::placeholder { color: rgba(0,0,0,0.25); }
          .ui-inline-input:focus {
            border-bottom-color: var(--ui-input-focus);
          }
          .dark  { --ui-input-focus: #93c5fd; }
          .light { --ui-input-focus: #2563eb; }`}
      </style>
    </>
  );
}
