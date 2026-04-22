// import { useTheme } from '../contexts/ThemeContext';
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
  // const { theme } = useTheme();
  const isLarge = feature.size === "large";

  const renderIcon = () => {
    if (typeof feature.icon === "string") {
      return (
        <img
          src={feature.icon}
          alt={feature.label}
          className="feature-icon-img"
        />
      );
    }

    return <div className="feature-icon-lib">{feature.icon}</div>;
  };

  return (
    <button
      className={`feature-card ${isLarge ? "large" : "small"}`}
      onClick={feature.onclick}
    >
      {renderIcon()}

      <span className="feature-label">{t(feature.label)}</span>

      {/* {feature.description && (
        <span className="feature-description">{feature.description}</span>
      )} */}

      <style>{`
        .feature-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid transparent;
          background: var(--card-bg);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--card-hover-overlay);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-card > * {
          position: relative;
          z-index: 1;
        }

        ${
          isLarge
            ? `
          .feature-card {
            padding: 24px 20px;
            grid-column: span 1;
            min-height: 140px;
          }

          .dark .feature-card.large {
            --card-bg: linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0.12) 100%);
            --card-hover-overlay: rgba(147, 197, 253, 0.2);
            border-color: rgba(147, 197, 253, 0.25);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .light .feature-card.large {
            --card-bg: linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(37, 99, 235, 0.08) 100%);
            --card-hover-overlay: rgba(37, 99, 235, 0.12);
            border-color: rgba(37, 99, 235, 0.2);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
          }

          .feature-card.large:hover {
            border-color: var(--card-hover-border);
            box-shadow: var(--card-shadow);
            transform: translateY(-4px);
          }

          .dark .feature-card.large:hover {
            --card-hover-border: rgba(147, 197, 253, 0.6);
            --card-shadow: 0 16px 36px rgba(37, 99, 235, 0.2);
          }

          .light .feature-card.large:hover {
            --card-hover-border: rgba(37, 99, 235, 0.4);
            --card-shadow: 0 16px 36px rgba(37, 99, 235, 0.15);
          }

          .feature-card.large::before {
            opacity: 1;
          }
          `
            : `
          .feature-card {
            padding: 20px 16px;
            grid-column: span 1;
            min-height: 130px;
          }

          .dark .feature-card.small {
            --card-bg: rgba(30, 41, 59, 0.6);
            --card-hover-overlay: rgba(147, 197, 253, 0.15);
            border-color: rgba(148, 163, 184, 0.25);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }

          .light .feature-card.small {
            --card-bg: rgba(226, 232, 240, 0.6);
            --card-hover-overlay: rgba(37, 99, 235, 0.1);
            border-color: rgba(148, 163, 184, 0.2);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          .feature-card.small:hover {
            border-color: var(--card-hover-border);
            transform: translateY(-3px);
            box-shadow: var(--card-hover-shadow);
          }

          .dark .feature-card.small:hover {
            --card-hover-border: rgba(147, 197, 253, 0.4);
            --card-hover-shadow: 0 8px 20px rgba(37, 99, 235, 0.15);
          }

          .light .feature-card.small:hover {
            --card-hover-border: rgba(37, 99, 235, 0.3);
            --card-hover-shadow: 0 8px 20px rgba(37, 99, 235, 0.12);
          }

          .feature-card.small::before {
            opacity: 1;
          }
          `
        }

        .feature-icon-img,
        .feature-icon-lib{
          width:${isLarge ? "52px" : "36px"};
          height:${isLarge ? "52px" : "36px"};
          display:flex;
          align-items:center;
          justify-content:center;
          transition:all .3s ease;
        }

        .feature-icon-img{
          object-fit:contain;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }

        .feature-label {
          font-size: ${isLarge ? "16px" : "14px"};
          font-weight: 600;
          text-align: center;
          color: var(--label-color);
          line-height: 1.3;
          letter-spacing: -0.3px;
        }

        .dark .feature-label {
          --label-color: rgba(255, 255, 255, 0.95);
        }

        .light .feature-label {
          --label-color: var(--primary);
        }

        .feature-description {
          font-size: 12px;
          color: var(--desc-color);
          text-align: center;
          line-height: 1.4;
          max-width: 100%;
        }

        .dark .feature-description {
          --desc-color: rgba(255, 255, 255, 0.65);
        }

        .light .feature-description {
          --desc-color: var(--text-sub);
        }
      `}</style>
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
    {
      id: "salary",
      label: "luong",
      icon: Salary,
      size: "small",
    },
    {
      id: "reward",
      label: "luongThuong",
      icon: Reward,
      size: "small",
    },
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
      size: "small",
    },
    {
      id: "news",
      label: "banTin",
      icon: News,
      size: "small",
    },
  ];

  return (
    <div className="features-container">
      {/* Large Featured Cards */}
      <div className="featured-grid">
        {LARGE_FEATURES.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>

      {/* Small Feature Cards */}
      <div className="features-section">
        {/* <h2 className="features-title">Tính năng</h2> */}
        <div className="features-grid">
          {SMALL_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      <style>{`
        .features-container {
          margin-bottom: 80px;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .features-section {
          margin-bottom: 32px;
        }

        .features-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--title-color);
          letter-spacing: -0.3px;
        }

        .dark .features-title {
          --title-color: rgba(255, 255, 255, 0.95);
        }

        .light .features-title {
          --title-color: var(--primary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 14px;
        }

        /* Tablet view */
        @media (max-width: 1024px) {
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
            margin-bottom: 28px;
          }

          .features-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 12px;
          }

          .features-section {
            margin-bottom: 28px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 24px;
          }

          .features-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .features-section {
            margin-bottom: 24px;
          }

          .features-title {
            font-size: 16px;
            margin-bottom: 12px;
          }
        }

        @media (max-width: 480px) {
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }

          .features-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }

          .features-section {
            margin-bottom: 20px;
          }

          .features-title {
            font-size: 14px;
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};
