import { useState, useEffect } from "react";
import type {
  GeneralAffair as GeneralAffairType,
  GeneralAffairFactory as GeneralAffairFactoryType,
  GeneralAffairDepartment as GeneralAffairDepartmentType,
} from "../../../types/generalAffair";
import generalAffairApi from "../../../api/features/report/generalAffair";
import { useAppSelector } from "../../../hooks/auth";
import { AppAlert } from "../../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../../libs/helper";
import { useBreadcrumb } from "../../../hooks/useBreadcrumb";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import GeneralAffair from "./GeneralAffair";
import GeneralAffairFactory from "./GeneralAffairFactory";
import GeneralAffairDepartment from "./GeneralAffairDepartment";
import GeneralAffairDepartmentMYear from "./GeneralAffairDepartmentMYear";
import { useTranslation } from "../../../hooks/useTranslation";
import { BiDollar } from "react-icons/bi";

type ViewName = "list" | "factory" | "department" | "mYear";

interface ViewData {
  view: ViewName;
  record?: GeneralAffairType;
  factoryItem?: GeneralAffairFactoryType;
  selectedMMYear?: string;
}

export default function GeneralAffairPage() {
  const { t } = useTranslation();
  const currentUser = useAppSelector((s) => s.auth.user);

  const [listData, setListData] = useState<GeneralAffairType[] | null>(null);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      setListLoading(true);
      try {
        const res = await generalAffairApi.getGeneralAffair({
          factory: currentUser.factory,
          userId: currentUser.userId,
          level: currentUser.level,
        });
        setListData(res);
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
        setListData([]);
      } finally {
        setListLoading(false);
      }
    };
    load();
  }, [currentUser]);

  const [factoryData, setFactoryData] = useState<
    GeneralAffairFactoryType[] | null
  >(null);
  const [factoryLoading, setFactoryLoading] = useState(false);

  const fetchFactory = async (record: GeneralAffairType) => {
    if (!currentUser) return;
    setFactoryData(null);
    setFactoryLoading(true);
    try {
      const res = await generalAffairApi.getGeneralAffairFactory({
        userId: "ALL",
        factory: record.Fty,
        startDate: record.StartDate,
        endDate: record.EndDate,
      });
      setFactoryData(res);
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      setFactoryData([]);
    } finally {
      setFactoryLoading(false);
    }
  };

  const [departmentData, setDepartmentData] = useState<
    GeneralAffairDepartmentType[] | null
  >(null);
  const [departmentLoading, setDepartmentLoading] = useState(false);

  const fetchDepartment = async (
    record: GeneralAffairType,
    factoryItem: GeneralAffairFactoryType,
  ) => {
    if (!currentUser) return;
    setDepartmentData(null);
    setDepartmentLoading(true);
    try {
      const res = await generalAffairApi.getGeneralAffairDepartment({
        depId: factoryItem.DepID,
        factory: record.Fty,
        startDate: factoryItem.StartDate,
        endDate: factoryItem.EndDate,
      });
      setDepartmentData(res);
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      setDepartmentData([]);
    } finally {
      setDepartmentLoading(false);
    }
  };

  const nav = useBreadcrumb<ViewData>({
    data: { view: "list" },
  });

  const handleSelectRecord = (record: GeneralAffairType) => {
    nav.push({
      label: record.Title_MeNu,
      data: { view: "factory", record },
    });
    fetchFactory(record);
  };

  const handleSelectFactoryItem = (factoryItem: GeneralAffairFactoryType) => {
    const activeRecord = nav.current.data?.record;
    nav.push({
      label: factoryItem.Names.split(" - ")[0],
      data: { view: "department", factoryItem, record: activeRecord },
    });
    if (activeRecord) fetchDepartment(activeRecord, factoryItem);
  };

  const handleSelectMMYear = (mmYearTitle: string) => {
    const activeRecord = nav.current.data?.record;
    const activeFactoryItem = nav.current.data?.factoryItem;
    nav.push({
      label: mmYearTitle,
      data: {
        view: "mYear",
        record: activeRecord,
        factoryItem: activeFactoryItem,
        selectedMMYear: mmYearTitle,
      },
    });
  };

  const activeView = nav.current.data?.view ?? "list";
  const activeRecord = nav.current.data?.record;
  const activeFactoryItem = nav.current.data?.factoryItem;
  const activeMMYear = nav.current.data?.selectedMMYear;

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
              <BiDollar size={18} />
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
              data={listData}
              loading={listLoading}
              onSelectRecord={handleSelectRecord}
            />
          )}

          {activeView === "factory" && activeRecord && (
            <GeneralAffairFactory
              data={factoryData}
              loading={factoryLoading}
              onSelectItem={handleSelectFactoryItem}
            />
          )}

          {activeView === "department" && activeFactoryItem && (
            <GeneralAffairDepartment
              data={departmentData}
              loading={departmentLoading}
              onSelectMMYear={handleSelectMMYear}
            />
          )}

          {activeView === "mYear" &&
            activeFactoryItem &&
            activeRecord &&
            activeMMYear && (
              <GeneralAffairDepartmentMYear
                depId={activeFactoryItem.DepID}
                factory={activeFactoryItem.Fty}
                initialMMYear={activeMMYear}
              />
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
