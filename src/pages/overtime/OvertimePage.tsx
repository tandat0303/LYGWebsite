import { useState, useEffect } from "react";
import OvertimeSummaryCard from "./OvertimeSummaryCard";
import OvertimeList from "./OvertimeList";
import { useAppSelector } from "../../hooks/auth";
import type { OvertimeData } from "../../types/overtime";
import overtimeApi from "../../api/features/overtime";
import { AppAlert } from "../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../libs/helper";
import { useTranslation } from "../../hooks/useTranslation";
import { TbClockBolt } from "react-icons/tb";

export default function OvertimePage() {
  const { t } = useTranslation();

  const currentUser = useAppSelector((s) => s.auth.user);
  const currentYear = String(new Date().getFullYear());

  const [year, setYear] = useState(currentYear);
  const [overtimeData, setOvertimeData] = useState<OvertimeData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const payload = {
    factory: currentUser.factory,
    userId: currentUser.userId,
    year,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingData(true);
        const res = await overtimeApi.getOvertimeData(payload);
        setOvertimeData(res ?? []);
      } catch (err) {
        AppAlert({ icon: "error", title: getApiErrorMessage(err) });
      } finally {
        setLoadingData(false);
      }
    };
    fetch();
  }, [year]);

  return (
    <div
      className="w-full min-h-full box-border overflow-x-hidden animate-[overtimePageIn_0.28s_cubic-bezier(0.22,1,0.36,1)]"
      style={{ padding: "24px" }}
    >
      <div className="flex items-center gap-3" style={{ marginBottom: "20px" }}>
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0
            bg-orange-500/12 dark:bg-orange-500/18 text-orange-600 dark:text-orange-400"
        >
          <TbClockBolt size={16} strokeWidth={2} />
        </div>
        <h1 className="text-[20px] font-bold m-0 text-slate-800 dark:text-white/90">
          {t("tangCa")}
        </h1>
      </div>

      <div className="mb-7">
        <OvertimeSummaryCard
          data={overtimeData}
          year={year}
          loading={loadingData}
        />
      </div>

      <OvertimeList
        items={overtimeData}
        loading={loadingData}
        year={year}
        onYearChange={setYear}
      />

      <style>{`
        @keyframes overtimePageIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
