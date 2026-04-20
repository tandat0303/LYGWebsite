import { useTheme } from "../contexts/ThemeContext";
import HeroImgDay from "../assets/images/hero_banner_day.jpg";
import HeroImgAfternoon from "../assets/images/hero_banner_afternoon.jpg";
import HeroImgNight from "../assets/images/hero_banner_night.jpg";
import { useAppSelector } from "../hooks/auth";
import { useEffect, useState } from "react";

export const HeroSection = () => {
  const { theme } = useTheme();
  const { user } = useAppSelector((s) => s.auth);

  const [city, setCity] = useState("");

  const hour = new Date().getHours();

  const isMorning = hour < 12;
  const isAfternoon = hour < 18;

  const getGreeting = () => {
    if (isMorning) return "Chào buổi sáng";
    if (isAfternoon) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      );

      const data = await res.json();

      setCity(
        data.address.city ||
          data.address.town ||
          data.address.state ||
          data.address.county,
      );
    });
  }, []);

  return (
    <section
      className="relative w-full h-[240px] overflow-hidden rounded-2xl
                        flex flex-col justify-end shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                        hero-section"
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={
            isMorning
              ? HeroImgDay
              : isAfternoon
                ? HeroImgAfternoon
                : HeroImgNight
          }
          className={`w-full h-full object-cover object-center block scale-[1.02]
                    ${theme === "dark" ? "brightness-[0.78]" : "brightness-100"} hero-image`}
        />
      </div>

      {/* Content Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end z-10
                    bg-[linear-gradient(to_top,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.25)_40%,transparent_100%)]
                    hero-content"
        style={{ padding: "32px" }}
      >
        <div className="text-white">
          <h1
            className="text-[32px] font-bold leading-[1.2] mb-2 tracking-[-0.5px]
                          [text-shadow:0_2px_12px_rgba(0,0,0,0.4)] hero-greeting"
          >
            {getGreeting()} !
          </h1>
          <p className="text-[18px] text-white/95 mb-1.5 font-medium [text-shadow:0_1px_6px_rgba(0,0,0,0.3)] hero-name">
            {user.fullName}
          </p>
          <p className="text-[14px] text-white/85 flex items-center gap-1.5 [text-shadow:0_1px_4px_rgba(0,0,0,0.3)] hero-location">
            {city} - {user.factory}
          </p>
        </div>
      </div>

      <style>{`
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
