import { useTheme } from "../contexts/ThemeContext";
import HeroImg from "../assets/images/hero_banner.jpg";
import { useAppSelector } from "../hooks/auth";

export const HeroSection = () => {
  const { theme } = useTheme();
  const { user } = useAppSelector((s) => s.auth);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src={HeroImg} className="hero-image" />
      </div>

      {/* Content Overlay */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-greeting">{getGreeting()} !</h1>
          <p className="hero-name">{user.fullName}</p>
          <p className="hero-location">
            {user.nameshow} - {user.factory}
          </p>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .hero-background {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          transform: scale(1.02);
          filter: brightness(${theme === "dark" ? 0.78 : 1});
        }

        .hero-svg {
          width: 100%;
          height: 100%;
          filter: brightness(${theme === "dark" ? 0.8 : 1.05});
        }

        .hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 32px;
          z-index: 10;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.45) 0%,
            rgba(0, 0, 0, 0.25) 40%,
            transparent 100%
          );
        }

        .hero-text {
          color: white;
        }

        .hero-greeting {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
        }

        .hero-name {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 6px;
          font-weight: 500;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
        }

        .hero-location {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          display: flex;
          align-items: center;
          gap: 6px;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-location svg {
          width: 16px;
          height: 16px;
        }

        @media (max-width: 1024px) {
          .hero-image {
            object-position: center;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 200px;
            border-radius: 14px;
          }

          .hero-image {
            object-position: 58% center;
          }

          .hero-content {
            padding: 24px;
          }

          .hero-greeting {
            font-size: 26px;
            margin-bottom: 6px;
          }

          .hero-name {
            font-size: 16px;
            margin-bottom: 4px;
          }

          .hero-location {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            height: 160px;
            border-radius: 12px;
          }

          .hero-image {
            object-position: 62% center;
          }

          .hero-content {
            padding: 20px;
          }

          .hero-greeting {
            font-size: 22px;
            margin-bottom: 4px;
          }

          .hero-name {
            font-size: 14px;
            margin-bottom: 2px;
          }

          .hero-location {
            font-size: 12px;
            max-width: 90%;
          }
        }
      `}</style>
    </section>
  );
};
