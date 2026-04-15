import { useTheme } from '../contexts/ThemeContext';

export const HeroSection = () => {
  const { theme } = useTheme();
  const userName = 'Trương Tấn Đạt';
  const location = 'Hồ Chí Minh - LYV';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <section className="hero-section">
      {/* Background Image (placeholder for now) */}
      <div className="hero-background">
        <svg
          className="hero-svg"
          viewBox="0 0 720 360"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6B92C9" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2C5AA0" />
              <stop offset="100%" stopColor="#1B3A70" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="720" height="180" fill="url(#skyGrad)" />

          {/* Mountains (stylized) */}
          <path
            d="M 0 180 Q 60 100, 120 140 T 240 120 T 360 160 T 480 100 T 600 140 T 720 100 L 720 200 Q 600 240, 480 220 T 240 260 T 0 200 Z"
            fill="#4A7BA7"
            opacity="0.4"
          />

          {/* Water */}
          <rect y="240" width="720" height="120" fill="url(#waterGrad)" />

          {/* Water waves - subtle */}
          <path
            d="M 0 240 Q 45 235 90 240 T 180 240 T 270 240 T 360 240 T 450 240 T 540 240 T 630 240 T 720 240"
            stroke="#3A6D9F"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 0 255 Q 45 250 90 255 T 180 255 T 270 255 T 360 255 T 450 255 T 540 255 T 630 255 T 720 255"
            stroke="#2A5D8F"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />

          {/* Clouds */}
          <ellipse cx="100" cy="60" rx="50" ry="25" fill="rgba(200, 220, 240, 0.7)" />
          <ellipse cx="130" cy="70" rx="40" ry="20" fill="rgba(200, 220, 240, 0.5)" />
          <ellipse cx="550" cy="80" rx="60" ry="30" fill="rgba(200, 220, 240, 0.6)" />
        </svg>
      </div>

      {/* Content Overlay */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-greeting">
            {getGreeting()} !
          </h1>
          <p className="hero-name">{userName}</p>
          <p className="hero-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </p>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .hero-svg {
          width: 100%;
          height: 100%;
          filter: brightness(${theme === 'dark' ? 0.85 : 1.1});
        }

        .hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
          z-index: 10;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 0, 0, 0.3) 100%
          );
        }

        .hero-text {
          color: white;
        }

        .hero-greeting {
          font-size: 24px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 2px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .hero-name {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 8px;
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-location {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          gap: 6px;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-location svg {
          width: 14px;
          height: 14px;
        }
      `}</style>
    </section>
  );
};
