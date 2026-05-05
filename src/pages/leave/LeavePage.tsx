import { useState, useEffect } from "react";
import LeaveSummaryCard from "./User/LeaveSummaryCard";
import LeaveList from "./User/LeaveList";
import SupervisorLeaveTW from "./Supervisor/Taiwan/SupervisorLeaveTW";
import SupervisorLeaveNTW from "./Supervisor/NonTaiwan/SupervisorLeaveNTW";
import { useAppSelector } from "../../hooks/auth";
import type { LeaveData, LeaveSummary } from "../../types/leave";
import leaveApi from "../../api/features/leave/leave";
import supervisorLeaveApi from "../../api/features/leave/supervisorLeave";
import { AppAlert } from "../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../libs/helper";
import { useTranslation } from "../../hooks/useTranslation";
import { TbBeach } from "react-icons/tb";

type ViewType = "tw" | "ntw" | "default" | null;

type Status = 1 | 2 | 3;

export default function LeavePage() {
  const { t } = useTranslation();

  const currentUser = useAppSelector((s) => s.auth.user);
  const currentYear = String(new Date().getFullYear());

  const isLHG = currentUser.factory === "LHG";

  const [year, setYear] = useState(currentYear);

  const [status, setStatus] = useState<Status>(3);
  const [viewType, setViewType] = useState<ViewType>(null);

  const [summary, setSummary] = useState<LeaveSummary | null>(null);
  const [leaves, setLeaves] = useState<LeaveData[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await supervisorLeaveApi.checkTaiwan({
          factory: currentUser.factory,
          employId: currentUser.userId,
        });
        if (res.status === 1) {
          setStatus(res.status);
          setViewType("tw");
        } else if (res.status === 2) {
          setStatus(res.status);
          setViewType("ntw");
        } else {
          setStatus(3);
          setViewType("default");
        }
      } catch {
        setViewType("default");
      }
    };
    check();
  }, []);

  const payload = {
    factory: currentUser.factory,
    userId: currentUser.userId,
    year,
  };

  useEffect(() => {
    if (viewType !== "default") return;
    const fetch = async () => {
      try {
        setLoadingSummary(true);
        const res = await leaveApi.getLeaveSummary(payload);
        setSummary(res?.[0] ?? null);
      } catch (err) {
        AppAlert({ icon: "error", title: getApiErrorMessage(err) });
      } finally {
        setLoadingSummary(false);
      }
    };
    fetch();
  }, [year, viewType]);

  useEffect(() => {
    if (viewType !== "default") return;
    const fetch = async () => {
      try {
        setLoadingLeaves(true);
        const res = await leaveApi.getLeaves(payload);
        setLeaves(res ?? []);
      } catch (err) {
        AppAlert({ icon: "error", title: getApiErrorMessage(err) });
      } finally {
        setLoadingLeaves(false);
      }
    };
    fetch();
  }, [year, viewType]);

  if (viewType === null) {
    return (
      <div className="w-full min-h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (viewType === "tw") {
    return (
      <SupervisorLeaveTW year={year} onYearChange={setYear} status={status} />
    );
  }

  if (viewType === "ntw") {
    return (
      <SupervisorLeaveNTW year={year} onYearChange={setYear} status={status} />
    );
  }

  return (
    <div
      className="w-full min-h-full box-border overflow-x-hidden animate-[leavePageIn_0.28s_cubic-bezier(0.22,1,0.36,1)]"
      style={{ padding: "24px" }}
    >
      <div className="flex items-center gap-3" style={{ marginBottom: "20px" }}>
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0
          bg-blue-500/12 dark:bg-blue-500/18 text-blue-600 dark:text-blue-400"
        >
          <TbBeach size={16} strokeWidth={2} />
        </div>
        <h1 className="text-[20px] font-bold m-0 text-slate-800 dark:text-white/90">
          {t("ngayNghi")}
        </h1>
      </div>

      <div className="mb-7">
        <LeaveSummaryCard
          data={summary}
          year={year}
          loading={loadingSummary}
          isLHG={isLHG}
        />
      </div>

      <LeaveList
        leaves={leaves}
        loading={loadingLeaves}
        year={year}
        onYearChange={setYear}
      />

      <style>{`
        @keyframes leavePageIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
