import { CheckCheck, ChevronRight, Copy, Phone } from "lucide-react";
import { useState } from "react";
import type { ContactRowProps } from "../../types/contact";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <button
      className={`flex items-center justify-center w-7 h-7 rounded-lg border
        cursor-pointer transition-all duration-160 shrink-0
        ${
          copied
            ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-400 dark:text-emerald-400"
            : "bg-transparent border-slate-200 text-slate-400 hover:bg-blue-500/10 hover:border-blue-400/40 hover:text-blue-500 dark:border-white/10 dark:text-white/35 dark:hover:bg-blue-500/15 dark:hover:border-blue-400/30 dark:hover:text-blue-400"
        }`}
      title="Copy"
      onClick={handleCopy}
    >
      {copied ? <CheckCheck size={13} strokeWidth={2.5} /> : <Copy size={13} />}
    </button>
  );
}

export function ContactRow({ item, colorClass, isLast }: ContactRowProps) {
  const initials = getInitials(item.Remark);

  return (
    <a
      href={`tel:${item.Phone_Number}`}
      className={`flex items-center gap-3 group cursor-pointer no-underline
        transition-colors duration-150
        hover:bg-blue-500/5 dark:hover:bg-blue-500/8
        ${!isLast ? "border-b border-slate-100 dark:border-white/5" : ""}`}
      style={{ padding: "13px 16px" }}
    >
      {/* Avatar */}
      <div
        className={`w-[42px] h-[42px] rounded-full shrink-0 flex items-center justify-center
          text-white font-bold text-[13px] tracking-wide
          bg-linear-to-br ${colorClass}
          shadow-[0_2px_8px_rgba(0,0,0,0.18)]`}
      >
        {initials || <Phone size={16} strokeWidth={2} />}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 flex flex-col">
        <span
          className="text-[13px] font-semibold leading-snug truncate
          text-slate-800 dark:text-white/88
          group-hover:text-blue-600 dark:group-hover:text-blue-300
          transition-colors duration-150"
        >
          {item.Phone_Number}
        </span>
        <span
          className="text-[12px] leading-snug line-clamp-2
          text-slate-500 dark:text-white/45"
        >
          {item.Remark}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <CopyBtn text={item.Phone_Number} />
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg
          text-blue-500/50 dark:text-blue-400/35
          group-hover:text-blue-500 dark:group-hover:text-blue-400
          transition-colors duration-150"
        >
          <ChevronRight size={14} strokeWidth={2} />
        </div>
      </div>
    </a>
  );
}
