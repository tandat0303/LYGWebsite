import { BanknoteX } from "lucide-react";
import { useTranslation } from "../../../hooks/useTranslation";

export default function SeveranceSalary() {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col box-border">
      <div
        className="shrink-0 flex items-center gap-3 border-b transition-colors duration-300
          bg-white/80 dark:bg-[rgba(15,27,48,0.6)]
          border-black/[0.07] dark:border-white/[0.07]
          backdrop-blur-sm px-4 sm:px-6 py-3.5"
      >
        <div
          className="w-8.5 h-8.5 rounded-[9px] flex items-center justify-center shrink-0
            bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
        >
          <BanknoteX size={18} />
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-[15px] font-bold leading-none m-0 text-slate-800 dark:text-white/90">
            {t("luongThoiViec")}
          </h1>
        </div>
      </div>

      <div className="flex-1 min-h-[85vh] p-3 sm:p-5 flex items-center justify-center">
        <div
          className="flex flex-col items-center justify-center gap-3 py-20
            text-slate-400 dark:text-white/30"
        >
          <BanknoteX size={40} strokeWidth={1.2} />
          <p className="text-[14px] m-0">{t("khongCoDuLieu")}</p>
        </div>
      </div>
    </div>
  );
}
