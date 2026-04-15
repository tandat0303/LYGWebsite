import { useTheme } from '../contexts/ThemeContext';

interface Feature {
  id: string;
  label: string;
  icon: string;
  description?: string;
  size?: 'large' | 'small';
  highlight?: boolean;
}

const LARGE_FEATURES: Feature[] = [
  {
    id: 'quyet-the',
    label: 'Giờ quét thể',
    icon: '🕐',
    description: 'Quản lý giờ làm việc',
    size: 'large',
    highlight: true,
  },
  {
    id: 'ngay-nghi',
    label: 'Ngày nghỉ',
    icon: '🏖️',
    description: 'Xem lịch nghỉ',
    size: 'large',
    highlight: true,
  },
  {
    id: 'tang-ca',
    label: 'Tăng ca',
    icon: '👨‍💼',
    description: 'Yêu cầu tăng ca',
    size: 'large',
    highlight: true,
  },
];

const SMALL_FEATURES: Feature[] = [
  {
    id: 'luong',
    label: 'Lương',
    icon: '💵',
    size: 'small',
  },
  {
    id: 'thuong',
    label: 'Thường',
    icon: '📅',
    size: 'small',
  },
  {
    id: 'luong-thoi-viec',
    label: 'Lương thời việc',
    icon: '👤',
    size: 'small',
  },
  {
    id: 'so-tay',
    label: 'Số tay/Quy trình',
    icon: '📖',
    size: 'small',
  },
  {
    id: 'ca-nhan',
    label: 'Thông tin cá nhân',
    icon: '👤',
    size: 'small',
  },
  {
    id: 'lien-he',
    label: 'Liên hệ',
    icon: '📋',
    size: 'small',
  },
  {
    id: 'ban-tin',
    label: 'Bản tin',
    icon: '📄',
    size: 'small',
  },
];

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const { theme } = useTheme();
  const isLarge = feature.size === 'large';

  return (
    <button
      className={`feature-card ${isLarge ? 'large' : 'small'}`}
      onClick={() => {
        console.log(`Clicked: ${feature.label}`);
      }}
    >
      <div className="feature-icon">{feature.icon}</div>
      <span className="feature-label">{feature.label}</span>
      {feature.description && (
        <span className="feature-description">{feature.description}</span>
      )}

      <style>{`
        .feature-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: var(--card-bg);
          cursor: pointer;
          transition: all 0.2s ease;
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
          transition: opacity 0.2s ease;
        }

        .feature-card > * {
          position: relative;
          z-index: 1;
        }

        ${
          isLarge
            ? `
          .feature-card {
            padding: 20px;
            grid-column: span 1;
          }

          .dark .feature-card.large {
            --card-bg: rgba(37, 99, 235, 0.15);
            --card-hover-overlay: rgba(147, 197, 253, 0.15);
            border-color: rgba(147, 197, 253, 0.2);
          }

          .light .feature-card.large {
            --card-bg: rgba(37, 99, 235, 0.08);
            --card-hover-overlay: rgba(37, 99, 235, 0.1);
            border-color: rgba(37, 99, 235, 0.15);
          }

          .feature-card.large:hover {
            border-color: var(--card-hover-border);
            box-shadow: var(--card-shadow);
          }

          .dark .feature-card.large:hover {
            --card-hover-border: rgba(147, 197, 253, 0.5);
            --card-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
          }

          .light .feature-card.large:hover {
            --card-hover-border: rgba(37, 99, 235, 0.3);
            --card-shadow: 0 8px 24px rgba(37, 99, 235, 0.1);
          }

          .feature-card.large::before {
            opacity: 1;
          }
          `
            : `
          .feature-card {
            padding: 18px 12px;
            grid-column: span 1;
            min-height: 120px;
          }

          .dark .feature-card.small {
            --card-bg: rgba(30, 41, 59, 0.8);
            --card-hover-overlay: rgba(147, 197, 253, 0.1);
            border-color: rgba(148, 163, 184, 0.2);
          }

          .light .feature-card.small {
            --card-bg: rgba(226, 232, 240, 0.5);
            --card-hover-overlay: rgba(37, 99, 235, 0.08);
            border-color: rgba(148, 163, 184, 0.15);
          }

          .feature-card.small:hover {
            border-color: var(--card-hover-border);
            transform: translateY(-2px);
          }

          .dark .feature-card.small:hover {
            --card-hover-border: rgba(147, 197, 253, 0.3);
          }

          .light .feature-card.small:hover {
            --card-hover-border: rgba(37, 99, 235, 0.2);
          }

          .feature-card.small::before {
            opacity: 1;
          }
          `
        }

        .feature-icon {
          font-size: ${isLarge ? '48px' : '32px'};
          line-height: 1;
        }

        .feature-label {
          font-size: ${isLarge ? '15px' : '14px'};
          font-weight: 600;
          text-align: center;
          color: var(--label-color);
          line-height: 1.2;
        }

        .dark .feature-label {
          --label-color: rgba(255, 255, 255, 0.9);
        }

        .light .feature-label {
          --label-color: var(--primary);
        }

        .feature-description {
          font-size: 12px;
          color: var(--desc-color);
          text-align: center;
          line-height: 1.3;
          max-width: 100%;
        }

        .dark .feature-description {
          --desc-color: rgba(255, 255, 255, 0.6);
        }

        .light .feature-description {
          --desc-color: var(--text-sub);
        }
      `}</style>
    </button>
  );
};

export const FeatureCards = () => {
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
        <h2 className="features-title">Khác</h2>
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
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .features-section {
          margin-bottom: 24px;
        }

        .features-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--title-color);
        }

        .dark .features-title {
          --title-color: rgba(255, 255, 255, 0.9);
        }

        .light .features-title {
          --title-color: var(--primary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
        }

        @media (max-width: 480px) {
          .featured-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .features-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};
