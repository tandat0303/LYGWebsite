import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import { useAppSelector } from "../../../../hooks/auth";
import supervisorLeaveApi from "../../../../api/features/leave/supervisorLeave";
import { AppAlert } from "../../../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../../../libs/helper";
import type {
  HomeLeaveData,
  DataHistory,
  LeaveDetail,
} from "../../../../types/supervisorLeave";
import HomeLeaveQuota from "../HomeLeaveQuota";
import AnnualLeaveQuota from "./AnnualLeaveQuota";
import LeaveList from "../LeaveList";
import LeaveDetailModal from "../LeaveDetailModal";
import { TbBeach } from "react-icons/tb";
import { useTranslation } from "../../../../hooks/useTranslation";
import AnnualTicketQuota from "./AnnualTicketQuota";

function YearPicker({
  year,
  onChange,
}: {
  year: string;
  onChange: (y: string) => void;
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  const cur = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => cur - 5 + i);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 px-3.5 py-1.75 rounded-[10px] border border-slate-900/[0.14] bg-slate-900/4 text-slate-800 text-[13px] font-semibold cursor-pointer transition-[background] duration-150 hover:bg-slate-900/8 dark:border-white/12] dark:bg-white/6 dark:text-white dark:hover:bg-white/9"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-[12px] font-medium text-slate-400 dark:text-[rgba(180,200,255,0.6)]">
          {t("year")}
        </span>
        <span className="border-l border-slate-900/15 pl-2 text-slate-800 dark:border-white/15 dark:text-white">
          {year}
        </span>
        <ChevronDown
          size={13}
          className={`opacity-50 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      {open && (
        <div className="absolute top-[calc(100%+6px)] right-0 z-50 bg-white border border-slate-900/10 rounded-[14px] p-2 min-w-47.5 shadow-[0_8px_30px_rgba(15,37,68,0.12)] grid grid-cols-3 gap-1 dark:bg-[#0f1f3d] dark:border-white/10 dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          {years.map((y) => (
            <button
              key={y}
              className={`py-1.5 rounded-lg border-none cursor-pointer text-[12px] font-semibold transition-[background] duration-120] ${
                String(y) === year
                  ? "bg-blue-500 text-white"
                  : "bg-transparent text-slate-500 dark:text-white/55 hover:bg-blue-400/20 hover:text-black dark:hover:bg-white/10 dark:hover:text-white"
              }`}
              onClick={() => {
                onChange(String(y));
                setOpen(false);
              }}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  year: string;
  onYearChange: (y: string) => void;
  status: number;
}

export default function SupervisorLeaveTW({
  year,
  onYearChange,
  status,
}: Props) {
  const { t } = useTranslation();

  const currentUser = useAppSelector((s) => s.auth.user);
  const payload = {
    factory: currentUser.factory,
    userId: currentUser.userId,
    year,
  };

  const [leaveInfo, setLeaveInfo] = useState<HomeLeaveData | null>(null);
  const [leaveHistory, setLeaveHistory] = useState<DataHistory[]>([]);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState<DataHistory | null>(null);
  const [leaveDetail, setLeaveDetail] = useState<LeaveDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoadingInfo(true);
        const res = await supervisorLeaveApi.getLeaveInfo(payload);
        if (res.status) setLeaveInfo(res.listData);
      } catch (err) {
        AppAlert({ icon: "error", title: getApiErrorMessage(err) });
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchInfo();
  }, [year]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await supervisorLeaveApi.getLeaveList(payload);
        if (res.status) {
          const mapped: DataHistory[] = (res.dataHistory ?? []).map(
            (d: DataHistory) => ({
              ID: d.ID,
              LeaveLabelEN: d.LeaveLabelEN,
              LeaveLabelTW: d.LeaveLabelTW,
              DateRange: d.DateRange,
              LeaveInfoEN: d.LeaveInfoEN,
              LeaveInfoTW: d.LeaveInfoTW,
              Days: d.Days,
              Status: d.Status,
            }),
          );
          setLeaveHistory(mapped);
        }
      } catch (err) {
        AppAlert({ icon: "error", title: getApiErrorMessage(err) });
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [year]);

  const handleSelectLeave = async (item: DataHistory) => {
    setSelectedLeave(item);
    setLeaveDetail(null);
    setLoadingDetail(true);
    try {
      const res = await supervisorLeaveApi.getLeaveDetail(item.ID);
      setLeaveDetail(res);
    } catch (err) {
      AppAlert({ icon: "error", title: getApiErrorMessage(err) });
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes tw-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes q-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .tw-page { animation: tw-in 0.28s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      <div className="tw-page w-full min-h-full box-border p-6 overflow-x-hidden max-sm:p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[9px] bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0 dark:bg-blue-500/12 dark:text-blue-400">
              <TbBeach size={16} />
            </div>
            <h1 className="text-[20px] font-bold m-0 text-slate-800 tracking-[-0.3px] dark:text-white/92">
              {t("ngayNghi")}
            </h1>
          </div>
          <YearPicker year={year} onChange={onYearChange} />
        </div>

        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3.5 mb-3.5">
          <HomeLeaveQuota
            data={leaveInfo}
            loading={loadingInfo}
            status={status}
          />
          <AnnualTicketQuota data={leaveInfo} loading={loadingInfo} />
        </div>

        <div className="mb-5">
          <AnnualLeaveQuota data={leaveInfo} loading={loadingInfo} />
        </div>

        <LeaveList
          items={leaveHistory}
          loading={loadingHistory}
          onSelect={handleSelectLeave}
        />
      </div>

      <LeaveDetailModal
        leave={selectedLeave}
        detail={leaveDetail}
        loading={loadingDetail}
        onClose={() => setSelectedLeave(null)}
      />
    </>
  );
}
