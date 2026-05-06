import { Star } from "lucide-react";

export default function RatingBadge({
  rating,
  revealed,
}: {
  rating: string | undefined;
  revealed: boolean;
}) {
  if (!revealed) {
    return (
      <span
        className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-bold
        bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/30 tracking-widest"
      >
        ••
      </span>
    );
  }

  const r = rating?.trim() || "—";
  const colorMap: Record<string, string> = {
    A: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 border-emerald-200 dark:border-emerald-400/20",
    B: "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300 border-blue-200 dark:border-blue-400/20",
    C: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300 border-amber-200 dark:border-amber-400/20",
    D: "bg-red-100 text-red-600 dark:bg-red-400/15 dark:text-red-300 border-red-200 dark:border-red-400/20",
  };
  const cls =
    colorMap[r] ??
    "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/60 border-slate-200 dark:border-white/10";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[14px] font-black border ${cls}`}
    >
      <Star size={12} fill="currentColor" strokeWidth={0} />
      {r}
    </span>
  );
}
