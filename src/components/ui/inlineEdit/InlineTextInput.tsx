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
    <input
      ref={ref}
      className="
        w-full bg-transparent border-x-0 border-t-0 border-b-[1.5px] outline-none
        text-[14px] font-medium transition-colors duration-180
        text-slate-800 placeholder:text-black/25
        border-b-blue-500/50 caret-blue-600
        focus:border-b-blue-600
        dark:text-white/92 dark:placeholder:text-white/22]
        dark:border-b-blue-300/50 dark:caret-[#93c5fd]
        dark:focus:border-b-[#93c5fd]
      "
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
  );
}
