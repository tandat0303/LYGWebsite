import type { Salary } from "../../types/salary";
import { Collapsible } from "./Collapsible";
import { Row } from "./Row";
import { fmt } from "../../libs/helper";
import { TbMoneybagMinus } from "react-icons/tb";
import { useTranslation } from "../../hooks/useTranslation";

interface DeductionSectionProps {
  data: Salary;
  revealed: boolean;
}

export function DeductionSection({ data, revealed }: DeductionSectionProps) {
  const { t } = useTranslation();

  //   const totalDeduction =
  //     (data.Advance_Payment ?? 0) +
  //     (data.Social_Insurance ?? 0) +
  //     (data.Health_Insurance ?? 0) +
  //     (data.Unemployment_Insurance ?? 0) +
  //     (data.Union_Pay ?? 0) +
  //     (data.Person_Income_Tax_Money ?? 0);

  return (
    <div
      className="rounded-[18px] sm:rounded-[22px] border transition-colors duration-300
        bg-white dark:bg-[rgba(15,27,48,0.82)]
        border-slate-200 dark:border-white/[0.07]
        shadow-[0_4px_24px_rgba(15,37,68,0.07)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]
        overflow-hidden"
    >
      {/* Section header */}
      <div
        className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b
          border-slate-100 dark:border-white/6
          bg-red-50/60 dark:bg-red-900/10"
      >
        <div
          className="w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0
            bg-red-100 text-red-500 dark:bg-red-400/15 dark:text-red-400"
        >
          <TbMoneybagMinus size={18} />
        </div>
        <h2 className="text-[13px] font-bold m-0 uppercase tracking-wider text-red-600 dark:text-red-400">
          {t("khoanTru")}
        </h2>
      </div>

      <div className="px-4 sm:px-6 pt-3 pb-4">
        <Collapsible title="Các khoản trừ" defaultOpen accent="red">
          <Row
            label="tamUng"
            value={fmt(data.Advance_Payment, revealed)}
            accent="red"
          />
          <Row
            label="tienBhxh"
            value={fmt(data.Social_Insurance, revealed)}
            accent="red"
          />
          <Row
            label="tienBhyt"
            value={fmt(data.Health_Insurance, revealed)}
            accent="red"
          />
          <Row
            label="tienBhtn"
            value={fmt(data.Unemployment_Insurance, revealed)}
            accent="red"
          />
          <Row
            label="doanPhi"
            value={fmt(data.Union_Pay, revealed)}
            accent="red"
          />
        </Collapsible>

        {/* Thuế TNCN */}
        <Collapsible title="Thuế TNCN" accent="red">
          <Row label="thueTncn" value="—" accent="red" />
          <Row label="maSoThue" value="—" />
          <Row label="chungMinhNhanDan" value="—" />
          <Row label="tongThuNhap" value="—" />
          <Row label="thuNhapMienThue" value="—" />
          <Row label="thuNhapChiuThue" value="—" />
          <Row label="banThan" value="—" />
          <Row label="soLuongNguoiPhuThuoc" value="—" />
          <Row label="soGiamNguoiPhuThuoc" value="—" />
          <Row label="tongGiamTruGiaCanh" value="—" />
          <Row label="baoHiemBatBuoc" value="—" />
          <Row label="tongCongCacKhoanGiamTru" value="—" />
          <Row label="thuNhapTinhThue" value="—" />
          <Row label="den10Tr" value="—" indent />
          <Row label="tren10tr_30tr" value="—" indent />
          <Row label="tren30tr_60tr" value="—" indent />
          <Row label="tren60tr_100tr" value="—" indent />
          <Row label="tren100tr" value="—" indent />
          <Row
            label="thueThuNhapCaNhanPhaiKhauTru"
            value={fmt(data.Person_Income_Tax_Money, revealed)}
            bold
            accent="red"
          />
        </Collapsible>

        {/* <div
          className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl
            bg-red-50 dark:bg-red-900/15 border border-red-200/70 dark:border-red-500/20"
        >
          <span className="text-[13px] font-bold text-red-600 dark:text-red-400">
            Tổng khấu trừ
          </span>
          <span className="text-[15px] font-black tabular-nums text-red-500 dark:text-red-400">
            {fmt(totalDeduction, revealed)}
          </span>
        </div>

        <div
          className="mt-2 flex items-center justify-between px-4 py-3.5 rounded-xl
            bg-blue-600 dark:bg-blue-700/80"
        >
          <span className="text-[13px] font-bold text-white/90">Thực lĩnh</span>
          <span className="text-[17px] font-black tabular-nums text-white">
            {fmt(data.Final_Salary, revealed)}
          </span>
        </div> */}
      </div>
    </div>
  );
}
