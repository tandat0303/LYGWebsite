function SkeletonBlock({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl bg-slate-200 dark:bg-slate-700/60 animate-pulse ${className}`}
      style={style}
    />
  );
}

export default function Skeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto">
      {/* Left card */}
      <div
        className="lg:w-85 shrink-0 rounded-[20px] border overflow-hidden
          bg-white dark:bg-[rgba(15,27,48,0.82)]
          border-slate-200 dark:border-white/[0.07]
          shadow-[0_4px_24px_rgba(15,37,68,0.07)]"
      >
        <div className="px-5 pt-5 pb-6 flex flex-col gap-3 border-b border-slate-100 dark:border-white/6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-2.5 w-14" />
            </div>
            {/* <SkeletonBlock className="h-7 w-12 rounded-full" /> */}
          </div>
          <div className="flex flex-col gap-2 mt-1">
            <SkeletonBlock className="h-2.5 w-16" />
            <SkeletonBlock className="h-9 w-52" />
          </div>
          <div className="flex gap-2 mt-1">
            <SkeletonBlock className="h-6 w-24 rounded-lg" />
            <SkeletonBlock className="h-6 w-20 rounded-lg" />
            <SkeletonBlock className="h-6 w-20 rounded-lg" />
          </div>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-2.5 w-28" />
            <SkeletonBlock className="h-7 w-14 rounded-full" />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <SkeletonBlock className="h-2.5 w-20" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div
        className="flex-1 rounded-[20px] border overflow-hidden
          bg-white dark:bg-[rgba(15,27,48,0.82)]
          border-slate-200 dark:border-white/[0.07]
          shadow-[0_4px_24px_rgba(15,37,68,0.07)]"
      >
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 dark:border-white/6">
          <SkeletonBlock className="h-6 w-6 rounded-md" />
          <SkeletonBlock className="h-3 w-28" />
        </div>
        <div className="px-5 pt-3 pb-4 flex flex-col gap-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5"
            >
              <SkeletonBlock
                className="h-3"
                style={{ width: `${90 + (i % 3) * 35}px` }}
              />
              <SkeletonBlock className="h-3 w-24" />
            </div>
          ))}
          <div className="flex flex-col gap-2 mt-3">
            <SkeletonBlock className="h-11 w-full rounded-xl" />
            <SkeletonBlock className="h-9 w-full rounded-xl" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
