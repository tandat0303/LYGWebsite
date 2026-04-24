import { useTranslation } from "../../hooks/useTranslation";
import Clock from "../../assets/icons/clock.png";
import Vacation from "../../assets/icons/vacations.png";
import Overtime from "../../assets/icons/overtime.png";
import Salary from "../../assets/icons/salary.png";
import Reward from "../../assets/icons/reward.png";
import FireSalary from "../../assets/icons/fire-salary.png";
import Notebook from "../../assets/icons/notebook.png";
import UserInfo from "../../assets/icons/user-info.png";
import Contact from "../../assets/icons/contact.png";
import News from "../../assets/icons/news.png";
import type { Feature, FeatureCardProps } from "../../types/features";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const { t } = useTranslation();
  const isLarge = feature.size === "large";

  const renderIcon = () => {
    if (typeof feature.icon === "string") {
      return (
        <img
          src={feature.icon}
          alt={feature.label}
          className="object-contain transition-all duration-300"
          style={{ width: isLarge ? 52 : 36, height: isLarge ? 52 : 36 }}
        />
      );
    }
    return (
      <div
        className="flex items-center justify-center transition-all duration-300"
        style={{ width: isLarge ? 52 : 36, height: isLarge ? 52 : 36 }}
      >
        {feature.icon}
      </div>
    );
  };

  const largeCardCls = `
    flex flex-col items-center justify-center gap-3 rounded-[14px] border cursor-pointer
    transition-all duration-300 relative overflow-hidden font-['DM_Sans',sans-serif]
    min-h-[140px] col-span-1
    border-blue-300/25 dark:border-blue-300/25
    bg-[linear-gradient(135deg,rgba(37,99,235,0.12)_0%,rgba(37,99,235,0.08)_100%)]
    dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.18)_0%,rgba(37,99,235,0.12)_100%)]
    shadow-[0_4px_12px_rgba(37,99,235,0.08)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
    hover:-translate-y-1 hover:border-blue-600/40 dark:hover:border-blue-300/60
    hover:shadow-[0_16px_36px_rgba(37,99,235,0.15)] dark:hover:shadow-[0_16px_36px_rgba(37,99,235,0.2)]
  `;

  const smallCardCls = `
    flex flex-col items-center justify-center gap-3 rounded-[14px] border cursor-pointer
    transition-all duration-300 relative overflow-hidden font-['DM_Sans',sans-serif]
    min-h-[130px] col-span-1
    border-slate-400/20 dark:border-slate-400/25
    bg-slate-200/60 dark:bg-slate-800/60
    shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.08)]
    hover:-translate-y-[3px] hover:border-blue-600/30 dark:hover:border-blue-300/40
    hover:shadow-[0_8px_20px_rgba(37,99,235,0.12)] dark:hover:shadow-[0_8px_20px_rgba(37,99,235,0.15)]
  `;

  return (
    <button
      className={isLarge ? largeCardCls : smallCardCls}
      style={{ padding: isLarge ? "24px 20px" : "20px 16px" }}
      onClick={feature.onclick}
    >
      {renderIcon()}
      <span
        className={`
          font-semibold text-center leading-[1.3] tracking-[-0.3px]
          text-slate-800/95 dark:text-white/95
          ${isLarge ? "text-[16px]" : "text-[14px]"}
        `}
      >
        {t(feature.label)}
      </span>
    </button>
  );
};

export const FeatureCards = () => {
  const navigate = useNavigate();

  const LARGE_FEATURES: Feature[] = [
    {
      id: "swipe-card",
      label: "chamCong",
      icon: Clock,
      onclick: () => navigate("/attendance", { replace: true }),
      description: "Quản lý giờ làm việc",
      size: "large",
      highlight: true,
    },
    {
      id: "holidays",
      label: "ngayNghi",
      icon: Vacation,
      description: "Xem lịch nghỉ",
      size: "large",
      highlight: true,
    },
    {
      id: "overtime",
      label: "tangCa",
      icon: Overtime,
      description: "Yêu cầu tăng ca",
      size: "large",
      highlight: true,
    },
  ];

  const SMALL_FEATURES: Feature[] = [
    { id: "salary", label: "luong", icon: Salary, size: "small" },
    { id: "reward", label: "luongThuong", icon: Reward, size: "small" },
    {
      id: "fire-salary",
      label: "luongThoiViec",
      icon: FireSalary,
      size: "small",
    },
    {
      id: "note",
      label: "soTay / quyTrinhChinhSach",
      icon: Notebook,
      onclick: () => navigate("/note", { replace: true }),
      size: "small",
    },
    {
      id: "info",
      label: "thongTinCaNhan",
      icon: UserInfo,
      onclick: () => navigate("/user-info", { replace: true }),
      size: "small",
    },
    {
      id: "contact",
      label: "lienHe",
      icon: Contact,
      onclick: () => navigate("/contact", { replace: true }),
      size: "small",
    },
    {
      id: "news",
      label: "banTin",
      icon: News,
      onclick: () => navigate("/news", { replace: true }),
      size: "small",
    },
  ];

  return (
    <div className="mb-20">
      <div
        className="
          grid gap-4 mb-8
          grid-cols-3
          max-[1024px]:grid-cols-2 max-[1024px]:gap-3.5 max-[1024px]:mb-7
          max-[768px]:grid-cols-2 max-[768px]:gap-3 max-[768px]:mb-6
          max-[480px]:grid-cols-2 max-[480px]:gap-2.5 max-[480px]:mb-5
        "
      >
        {LARGE_FEATURES.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>

      <div className="max-[768px]:mb-6 max-[480px]:mb-5 mb-8">
        <div
          className="
            grid gap-3.5
            grid-cols-[repeat(auto-fill,minmax(110px,1fr))]
            max-[1024px]:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] max-[1024px]:gap-3
            max-[768px]:grid-cols-3 max-[768px]:gap-2.5
            max-[480px]:grid-cols-3 max-[480px]:gap-2
          "
        >
          {SMALL_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
};
