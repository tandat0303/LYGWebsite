import { useState, useEffect } from "react";
import type { GeneralAffair as GeneralAffairType } from "../../../types/generalAffair";
import generalAffairApi from "../../../api/features/report/generalAffair";
import { useAppSelector } from "../../../hooks/auth";
import { AppAlert } from "../../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../../libs/helper";
import { useBreadcrumb } from "../../../hooks/useBreadcrumb";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import GeneralAffair from "./GeneralAffair";
import { useTranslation } from "../../../hooks/useTranslation";
import { FaDollarSign } from "react-icons/fa";
// Future child views:
// import GeneralAffairDetail from "./GeneralAffairDetail";
// import GeneralAffairSubDetail from "./GeneralAffairSubDetail";

type ViewName = "list" | "detail-list" | "detail" | "sub-detail";

interface ViewData {
  view: ViewName;
  record?: GeneralAffairType;
}

export default function GeneralAffairPage() {
  const { t } = useTranslation();

  const currentUser = useAppSelector((s) => s.auth.user);

  const [data, setData] = useState<GeneralAffairType[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await generalAffairApi.getGeneralAffair({
          factory: currentUser.factory,
          userId: currentUser.userId,
          level: currentUser.level,
        });
        setData(Array.isArray(res) ? res : [res]);
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser]);

  const nav = useBreadcrumb<ViewData>({
    labelKey: "generalAffairs",
    data: { view: "list" },
  });

  const handleSelectRecord = (record: GeneralAffairType) => {
    nav.push({
      label: record.Title_MeNu,
      data: { view: "detail-list", record },
    });
  };

  // Add more handlers as new levels are introduced, e.g.:
  // const handleSelectSubItem = (item: SubItem) => {
  //   nav.push({ labelKey: "subDetailKey", data: { view: "sub-detail", ... } });
  // };

  const activeView = nav.current.data?.view ?? "list";
  const activeRecord = nav.current.data?.record;

  return (
    <div className="w-full min-h-full box-border overflow-x-hidden p-6">
      <div className="w-full max-w-350 mx-auto flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                bg-blue-100 text-blue-600
                dark:bg-blue-300/12 dark:text-blue-300/80"
            >
              <FaDollarSign size={18} strokeWidth={1} />
            </div>
            <h1
              className="m-0 text-[17px] font-bold leading-tight
                text-slate-800 dark:text-white/92"
            >
              {t("generalAffairs")}
            </h1>
          </div>

          <Breadcrumb stack={nav.stack} onNavigate={nav.goTo} />
        </div>

        <div
          key={nav.depth}
          className="animate-[ga-rise_0.32s_cubic-bezier(0.22,1,0.36,1)_both]"
        >
          {activeView === "list" && (
            <GeneralAffair
              data={data}
              loading={loading}
              onSelectRecord={handleSelectRecord}
            />
          )}

          {activeView === "detail-list" && activeRecord && (
            // <GeneralAffairDetail record={activeRecord} onSelectSubItem={handleSelectSubItem} />
            <div
              className="rounded-[20px] border p-6 text-sm
                bg-white border-slate-200 dark:bg-[rgba(15,27,48,0.7)] dark:border-white/[0.07]
                text-slate-600 dark:text-white/60"
            >
              <p className="m-0 font-semibold text-slate-800 dark:text-white/90 mb-1">
                {activeRecord.Title_Fty}
              </p>
              <p className="m-0">
                {activeRecord.Fty} — detail view coming soon.
              </p>
            </div>
          )}

          {activeView === "detail" && (
            // <GeneralAffairSubDetail ... />
            <div
              className="rounded-[20px] border p-6 text-sm
                bg-white border-slate-200 dark:bg-[rgba(15,27,48,0.7)] dark:border-white/[0.07]
                text-slate-600 dark:text-white/60"
            >
              Sub-detail view coming soon.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ga-rise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
