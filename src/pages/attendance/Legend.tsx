export function Legend() {
  const items = [
    { label: "Đủ công (8h)", dot: "bg-emerald-500" },
    { label: "Vắng mặt", dot: "bg-red-500" },
    { label: "Khác", dot: "bg-amber-500" },
    { label: "Không có dữ liệu", dot: "bg-slate-300 dark:bg-slate-600" },
  ];

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
          <span className="text-[11.5px] text-slate-500 dark:text-slate-400">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
