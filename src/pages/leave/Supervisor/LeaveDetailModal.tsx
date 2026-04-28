import { useEffect, useRef, useState } from "react";
import {
  X,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  MapPin,
} from "lucide-react";
import type {
  DataHistory,
  LeaveDetail,
  LeaveFlightInfo,
  LeaveHomeInfo,
  LeaveTag,
} from "../../../types/supervisorLeave";
import { useAppSelector } from "../../../hooks/auth";
import { useNonTaiwanTranslation } from "../../../hooks/useNonTaiwanTranslation";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { LuTicketsPlane } from "react-icons/lu";

interface Props {
  leave: DataHistory | null;
  detail: LeaveDetail | null;
  loading?: boolean;
  onClose: () => void;
}

function getStatusInfo(code: string, lang: string = "en") {
  switch (code) {
    case "F":
      return {
        label: lang === "tw" ? "已核准" : "Approved",
        Icon: CheckCircle,
        dot: "bg-green-500",
        pill: "bg-green-600/20 text-green-400 border border-green-500/30",
        pillLight: "bg-green-100 text-green-700 border border-green-200",
      };
    case "C":
      return {
        label: lang === "tw" ? "取消" : "Cancel",
        Icon: XCircle,
        dot: "bg-red-500",
        pill: "bg-red-600/20 text-red-400 border border-red-500/30",
        pillLight: "bg-red-100 text-red-700 border border-red-200",
      };
    case "S":
    case "B":
      return {
        label: lang === "tw" ? "簽核中" : "Pending",
        Icon: Clock,
        dot: "bg-amber-400",
        pill: "bg-amber-500/20 text-amber-400 border border-amber-400/30",
        pillLight: "bg-amber-100 text-amber-700 border border-amber-200",
      };
    case "R":
      return {
        label: lang === "tw" ? "退回" : "Return",
        Icon: RotateCcw,
        dot: "bg-violet-500",
        pill: "bg-violet-500/20 text-violet-400 border border-violet-400/30",
        pillLight: "bg-violet-100 text-violet-700 border border-violet-200",
      };
    default:
      return {
        label: lang === "tw" ? "未知" : "Unknown",
        Icon: Clock,
        dot: "bg-slate-400",
        pill: "bg-white/10 text-white/50 border border-white/15",
        pillLight: "bg-slate-100 text-slate-500 border border-slate-200",
      };
  }
}

function getTagClasses(tagType: string): { bg: string; text: string } {
  switch (tagType) {
    case "Home Leave":
    case "Local Leave":
      return {
        bg: "bg-blue-50 dark:bg-blue-500/[0.12]",
        text: "text-blue-700 dark:text-blue-300",
      };
    case "Saturday":
    case "Sunday":
    case "Local Public Holiday":
      return {
        bg: "bg-rose-50 dark:bg-rose-500/[0.12]",
        text: "text-rose-600 dark:text-rose-300",
      };
    // case "Local Public Holiday":
    //   return {
    //     bg: "bg-emerald-50 dark:bg-emerald-500/[0.12]",
    //     text: "text-emerald-700 dark:text-emerald-300",
    //   };
    default:
      return {
        bg: "bg-slate-100 dark:bg-white/[0.07]",
        text: "text-slate-600 dark:text-white/60",
      };
  }
}

// Format "2026-04-25" → "04-25"
function fmtDate(iso: string) {
  if (!iso) return "";
  const parts = iso.split("-");
  return parts.length >= 3 ? `${parts[1]}-${parts[2]}` : iso;
}

function TagGrid({ tags, isTW = false }: { tags: LeaveTag[]; isTW?: boolean }) {
  if (!tags.length) return null;

  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {tags.map((tag, i) => {
        const c = getTagClasses(tag.TagType);
        return (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-3 rounded-xl ${c.bg} ${c.text}`}
          >
            <span className="text-[14px] font-semibold">
              {isTW ? tag.TagNameTW : tag.TagNameEN}
            </span>
            <span className="text-[14px] font-bold">{tag.Days}d</span>
          </div>
        );
      })}
    </div>
  );
}

function LeaveInfoCard({
  info,
  flights,
  isTW = false,
}: {
  info: LeaveHomeInfo;
  flights: LeaveFlightInfo[];
  isTW?: boolean;
}) {
  const startFmt = fmtDate(info.DateRange?.split("~")?.[0]?.trim() ?? "");
  const endFmt = fmtDate(info.DateRange?.split("~")?.[1]?.trim() ?? "");

  return (
    <div className="rounded-2xl bg-slate-100/70 dark:bg-[rgba(15,27,48,0.7)] border border-slate-200/70 dark:border-white/[0.07] p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[15px] font-bold text-slate-800 dark:text-white/90">
          {startFmt} → {endFmt}
        </span>
        <span className="text-[13px] font-semibold text-blue-600 dark:text-blue-400">
          {isTW ? info.PrimaryTagTW : info.PrimaryTagEN}
        </span>
      </div>

      <div className="h-px bg-slate-200 dark:bg-white/[0.07] mb-3" />

      {/* Destination + Arrangement */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/18 flex items-center justify-center">
            <MapPin size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-[15px] font-semibold text-slate-700 dark:text-white/80">
            {info.Destination}
          </span>
        </div>
        {info.ArrangementEN && info.ArrangementTW && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100  dark:bg-blue-500/18">
            <LuTicketsPlane
              size={20}
              className="text-blue-600 dark:text-blue-400"
            />
            <span className="text-[13px] font-semibold text-slate-600 dark:text-blue-300/75">
              {isTW ? info.ArrangementTW : info.ArrangementEN}
            </span>
          </div>
        )}
      </div>

      {/* Flights grid */}
      {flights.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5">
          {flights.map((f, i) => (
            <div
              key={i}
              className="rounded-xl px-3.5 py-3
                bg-white dark:bg-[rgba(20,35,65,0.8)]
                border-l-4 border-l-blue-600
                border border-slate-200/70 dark:border-white/[0.07] dark:border-l-blue-500"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <BiSolidPlaneAlt
                  size={18}
                  className="text-slate-500 dark:text-white"
                />
                <span className="text-[12px] text-slate-500 dark:text-white/45 truncate">
                  {f.Route}
                </span>
              </div>
              <div className="text-[16px] font-bold text-slate-800 dark:text-white/90 mb-0.5">
                {f.FlightNo}
              </div>
              <div className="text-[12px] text-slate-400 dark:text-white/40">
                {f.TimeRange}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LeaveDetailModal({
  leave,
  detail,
  loading,
  onClose,
}: Props) {
  const { tNT } = useNonTaiwanTranslation();

  const langCode = useAppSelector((s) => s.language.current.code);
  const isTW = langCode === "tw";

  const [closing, setClosing] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef<number | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    setClosing(false);
    setDragOffset(0);
  }, [leave]);

  useEffect(() => {
    if (leave) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [leave]);

  function triggerClose() {
    setClosing(true);
    setTimeout(onClose, 240);
  }

  function onTouchStart(e: React.TouchEvent) {
    dragStartY.current = e.touches[0].clientY;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) setDragOffset(delta);
  }
  function onTouchEnd() {
    if (dragOffset > 100) triggerClose();
    else setDragOffset(0);
    dragStartY.current = null;
  }

  if (!leave) return null;

  const s = getStatusInfo(leave.Status, langCode);

  const leaveLabel = isTW ? leave.LeaveLabelTW : leave.LeaveLabelEN;

  const reqInfo = detail?.data?.[0]?.[0];
  const homeInfoList = detail?.data?.[1] ?? [];
  const tags = detail?.data?.[2] ?? [];
  const flights = detail?.data?.[3] ?? [];

  const startFmt = fmtDate(leave.DateRange?.split("~")?.[0]?.trim() ?? "");
  const endFmt = fmtDate(leave.DateRange?.split("~")?.[1]?.trim() ?? "");
  const totalDays = reqInfo?.TotalDays ?? leave.Days;

  return (
    <>
      <style>{`
        @keyframes ldm-fade-in  { from{opacity:0} to{opacity:1} }
        @keyframes ldm-fade-out { from{opacity:1} to{opacity:0} }
        @keyframes ldm-slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ldm-sheet-up { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes ldm-slide-down { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(24px)} }
        @keyframes ldm-sheet-down { from{transform:translateY(0)} to{transform:translateY(100%)} }
      `}</style>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-9999 flex items-end md:items-center justify-center"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          animation: closing
            ? "ldm-fade-out 0.22s ease forwards"
            : "ldm-fade-in 0.22s ease",
        }}
        onClick={triggerClose}
        onTouchStart={isMobile ? onTouchStart : undefined}
        onTouchMove={isMobile ? onTouchMove : undefined}
        onTouchEnd={isMobile ? onTouchEnd : undefined}
      >
        {/* Sheet / Modal */}
        <div
          className="w-full md:max-w-[500px] md:mx-4
            bg-white dark:bg-[#0e1f3b]
            border-t border-slate-200/80 dark:border-white/8
            md:border md:border-slate-200/80 md:dark:border-white/10
            rounded-t-3xl md:rounded-3xl
            overflow-y-auto max-h-[88vh] md:max-h-[82vh]
            relative"
          style={{
            transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
            transition: dragOffset ? "none" : undefined,
            animation: closing
              ? isMobile
                ? "ldm-sheet-down 0.22s ease forwards"
                : "ldm-slide-down 0.22s ease forwards"
              : isMobile
                ? "ldm-sheet-up 0.26s cubic-bezier(0.22,1,0.36,1)"
                : "ldm-slide-up 0.26s cubic-bezier(0.22,1,0.36,1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle (mobile only) */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
          </div>

          {/* Content */}
          <div className="px-5 pb-6 pt-4 md:pt-5">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h2 className="text-[20px] font-extrabold text-blue-600 dark:text-blue-400 m-0 leading-tight">
                {leaveLabel}
              </h2>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold ${s.pillLight} dark:${s.pill}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
                <button
                  className="hidden md:flex w-8 h-8 rounded-full items-center justify-center shrink-0
                    bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.07] dark:hover:bg-white/12
                    text-slate-500 dark:text-white/50 cursor-pointer
                    transition-colors duration-150"
                  onClick={triggerClose}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* {reqInfo?.BPMNO && (
              <p className="text-[11px] text-slate-400 dark:text-white/30 m-0 mb-3">
                {reqInfo.BPMNO}
              </p>
            )} */}

            {/* Divider */}
            <div className="h-px bg-slate-200 dark:bg-white/8 mb-4" />

            {loading ? (
              <div className="flex flex-col gap-3">
                {[80, 130, 100].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse"
                    style={{ height: h }}
                  />
                ))}
              </div>
            ) : (
              <>
                {/* Date range + total days */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[18px] font-bold text-slate-800 dark:text-white/88">
                    {startFmt} → {endFmt}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl text-[14px] font-bold bg-slate-800/8 text-slate-700 border border-slate-300 dark:bg-[rgba(30,55,100,0.8)] dark:text-blue-300 dark:border-blue-500/30">
                    {isTW
                      ? `${tNT("dayss")}${totalDays}${tNT("dayss_")}`
                      : `${totalDays} ${tNT("days")}`}
                  </span>
                </div>

                {/* Tag grid */}
                <TagGrid tags={tags} isTW={isTW} />

                {/* Leave info cards */}
                {homeInfoList.map((info, i) => (
                  <LeaveInfoCard
                    key={i}
                    info={info}
                    flights={flights.filter(
                      (f) => f.LeaveCategoryID === info.LeaveCategoryID,
                    )}
                    isTW={isTW}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
