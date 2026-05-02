import { useRef, useState } from "react";
import { formatDateRaw } from "../../../libs/helper";

function useDateInput(initial: string, onChange?: (v: string) => void) {
  const [value, setValue] = useState(initial);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const set = (v: string) => {
    setValue(v);
    onChange?.(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isAllSelected) {
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        set("");
        setIsAllSelected(false);
        return;
      }
      if (/^\d$/.test(e.key)) {
        e.preventDefault();
        set(formatDateRaw(e.key));
        setIsAllSelected(false);
        return;
      }

      setIsAllSelected(false);
    }

    if (
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      if (e.key === "Backspace") {
        e.preventDefault();
        const digits = value.replace(/\//g, "");
        const trimmed = digits.slice(0, -1);
        set(formatDateRaw(trimmed));
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
    set(formatDateRaw(next));
  };

  return { value, setValue, ref, handleKeyDown, setIsAllSelected };
}

export default function InlineDateInput({
  initial,
  onSave,
  onCancel,
  onChange,
}: {
  initial: string;
  onSave: (v: string) => void;
  onCancel: () => void;
  onChange: (v: string) => void;
}) {
  const { value, ref, handleKeyDown, setIsAllSelected } = useDateInput(
    initial,
    onChange,
  );

  return (
    <input
      ref={ref}
      className="
        w-full bg-transparent border-x-0 border-t-0 border-b-[1.5px] outline-none
        text-[14px] font-medium transition-colors duration-180
        text-slate-800 placeholder:text-black/25
        border-b-blue-500/50 caret-blue-600
        focus:border-b-blue-600
        dark:text-white/92 dark:placeholder:text-white/22
        dark:border-b-blue-300/50 dark:caret-[#93c5fd]
        dark:focus:border-b-[#93c5fd]
      "
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
        } else if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          ref.current?.select();
          setIsAllSelected(true);
        } else handleKeyDown(e);
      }}
      onBlur={() => onSave(value)}
      onChange={() => {}}
      autoFocus
      maxLength={10}
      inputMode="numeric"
    />
  );
}
