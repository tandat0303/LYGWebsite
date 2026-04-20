import { useRef, useState } from "react";
import { formatDateRaw } from "../../../libs/helper";

function useDateInput(initial: string) {
  const [value, setValue] = useState(initial);
  const ref = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // const input = ref.current!;
    // const pos = input.selectionStart ?? 0;
    // const raw = value.replace(/\//g, "");

    if (
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      if (e.key === "Backspace") {
        e.preventDefault();
        const digits = value.replace(/\//g, "");
        const trimmed = digits.slice(0, -1);
        setValue(formatDateRaw(trimmed));
      }
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const digits = value.replace(/\//g, "");
    if (digits.length >= 8) return;
    const next = digits + e.key;
    setValue(formatDateRaw(next));
  };

  return { value, setValue, ref, handleKeyDown };
}

export default function InlineDateInput({
  initial,
  onSave,
  onCancel,
}: {
  initial: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const { value, ref, handleKeyDown } = useDateInput(initial); //setValue

  return (
    <>
      <input
        ref={ref}
        className="w-full bg-transparent border-none outline-none
                    transition-colors duration-180 text-[14px] font-medium
                    ui-inline-input"
        style={{ padding: "2px 0 4px" }}
        value={value}
        placeholder="DD/MM/YYYY"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSave(value);
          } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          } else handleKeyDown(e);
        }}
        onBlur={() => onSave(value)}
        onChange={() => {}}
        autoFocus
        maxLength={10}
        inputMode="numeric"
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
