import type { Salary } from "../../types/salary";
import { fmt } from "../../libs/helper";
import { Collapsible } from "./Collapsible";
import { Row } from "./Row";
import { TbMoneybagPlus } from "react-icons/tb";
import { useTranslation } from "../../hooks/useTranslation";

interface AdditionSectionProps {
  data: Salary;
  revealed: boolean;
}

export function AdditionSection({ data, revealed }: AdditionSectionProps) {
  const { t } = useTranslation();

  const totalAllowance =
    (data.Responsibility_Allowance ?? 0) + (data.Language_Allowance ?? 0);

  return (
    <div
      className="rounded-[18px] sm:rounded-[22px] border transition-colors duration-300
        bg-white dark:bg-[rgba(15,27,48,0.82)]
        border-slate-200 dark:border-white/[0.07]
        shadow-[0_4px_24px_rgba(15,37,68,0.07)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]
        overflow-hidden"
    >
      <div
        className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b
          border-slate-100 dark:border-white/6
          bg-emerald-50/60 dark:bg-emerald-900/10"
      >
        <div
          className="w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0
            bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400"
        >
          <TbMoneybagPlus size={18} />
        </div>
        <h2 className="text-[13px] font-bold m-0 uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {t("khoanCong")}
        </h2>
      </div>

      <div className="px-4 sm:px-6 pt-3 pb-4">
        <Collapsible title="Lương & Phụ cấp cơ bản" defaultOpen>
          <Row
            label="luongChinh"
            value={fmt(data.Main_Salary, revealed)}
            bold
          />
          <Row label="phuCapCongViec" value={fmt(totalAllowance, revealed)} />
          <Row
            label="phuCapDocHai"
            value={fmt(data.Other_Allowance, revealed)}
          />
          <Row
            label="phuCapVeSinhMoiTruong"
            value={fmt(data.Environmental_Sanitation, revealed)}
          />
          <Row
            label="phuCapAnToanVien"
            value={fmt(data.ATVSV_Allowance, revealed)}
          />
          <Row label="pcQip" value={fmt(data.QIP_Allowance, revealed)} />
          <Row label="pcPccc" value={fmt(data.PCCC_Allowance, revealed)} />
          <Row
            label="luongPc"
            value={fmt(data.Salary_And_Allowance, revealed)}
            bold
            accent="blue"
          />
          <Row
            label="luongThang"
            value={fmt(data.Salary_Of_Month, revealed)}
            bold
            accent="blue"
          />
        </Collapsible>

        <Collapsible title="Tăng ca & Ca đêm">
          <Row label="tienLamThem" value={fmt(data.Overtime_Pay, revealed)} />
          <Row
            label="tienNghiNgoiTangCa"
            value={fmt(data.Rest_Time_During_OT_Money, revealed)}
          />
          <Row
            label="pcCaDem"
            value={fmt(data.Night_Working_Money, revealed)}
          />
        </Collapsible>

        <Collapsible title="Tiền ngừng việc">
          <Row label="tienNgungViec" value={fmt(data.NV_Money, revealed)} />
          <Row
            label="tienNgungViec / (NV1)"
            value={fmt(data.NV1_Money, revealed)}
          />
          <Row
            label="tienNgungViec / (NV2)"
            value={fmt(data.NV2_Money, revealed)}
          />
          <Row
            label="tienNgungViec / (NV3)"
            value={fmt(data.NV3_Money, revealed)}
          />
          <Row
            label="tienNgungViec / (NV4)"
            value={fmt(data.NV4_Money, revealed)}
          />
          <Row
            label="tienNgungViec / (NV5)"
            value={fmt(data.NV5_Money, revealed)}
          />
          <Row
            label="tienNgungViec / (NV6)"
            value={fmt(data.NV6_Money, revealed)}
          />
        </Collapsible>

        <Collapsible title="Phụ cấp & Thưởng khác">
          <Row label="tienChuyenCan" value={fmt(data.Hard_Working, revealed)} />
          <Row label="phiSinhHoat" value={fmt(data.Living_Costs, revealed)} />
          <Row label="tienBinhBau" value={fmt(data.Rating_Money, revealed)} />
          <Row label="tienNghiPhep" value={fmt(data.P_R_Money, revealed)} />
          <Row label="tienNghiLe" value={fmt(data.Holiday_Money, revealed)} />
          <Row
            label="thuongBinhBauNam"
            value={fmt(data.Yearly_Rating, revealed)}
          />
          <Row label="tienSld1" value={fmt(data.Serving_Pay_1, revealed)} />
          <Row label="tienSld2" value={fmt(data.Serving_Pay_2, revealed)} />
          <Row label="tienHk" value={fmt(data.Good_News_Allowance, revealed)} />
          <Row
            label="tienNuoiConNho"
            value={fmt(data.Allowance_For_Baby, revealed)}
          />
          <Row label="tienCom" value={fmt(data.Meal_Allowance, revealed)} />
          <Row
            label="tienHieuHy"
            value={fmt(data.Manager_Allowance, revealed)}
          />
          <Row label="tienKhac" value={fmt(data.Other_Pay, revealed)} />
          <Row
            label="tienHoTroPhiSinhHoat"
            value={fmt(data.Cost_Of_Living_Support, revealed)}
          />
          <Row
            label="tienHoTroDiLai"
            value={fmt(data.Transportation_Allowance, revealed)}
          />
          <Row
            label="tienHoTroChamSocGiaDinh"
            value={fmt(data.Family_Care_Allowance, revealed)}
          />
        </Collapsible>

        {/* <div
          className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl
            bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200/70 dark:border-emerald-500/20"
        >
          <span className="text-[13px] font-bold text-emerald-700 dark:text-emerald-300">
            Tổng thu nhập thực tế
          </span>
          <span className="text-[15px] font-black tabular-nums text-emerald-600 dark:text-emerald-400">
            {fmt(data.Real_Salary, revealed)}
          </span>
        </div> */}
      </div>
    </div>
  );
}
