import { useTranslation } from "../../hooks/useTranslation";
import type { ContactGroupCardProps } from "../../types/contact";
import { ContactRow } from "./ContactRow";

const AVATAR_COLORS = [
  "from-blue-500 to-blue-700",
  "from-violet-500 to-violet-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-700",
  "from-cyan-500 to-cyan-700",
];

function avatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function ContactGroupCard({
  group,
  globalIndex,
}: ContactGroupCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 pl-1 mb-2">
        <span
          className="text-[11px] font-bold uppercase tracking-[1px]
          text-slate-400 dark:text-white/35"
        >
          {group.name}
        </span>
        <span className="flex-1 h-px bg-slate-200 dark:bg-white/[0.07]" />
        <span className="text-[11px] text-slate-400/60 dark:text-white/25">
          {group.value.length} {t("lienHe")}
        </span>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden
        border
        bg-white border-slate-200/80
        dark:bg-[rgba(15,27,48,0.65)] dark:border-white/[0.07]
        shadow-[0_2px_12px_rgba(0,0,0,0.05)]
        dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
      >
        {group.value.map((item, i) => (
          <ContactRow
            key={`${item.Phone_Number}-${i}`}
            item={item}
            colorClass={avatarColor(globalIndex + i)}
            isLast={i === group.value.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
