import { useTheme } from "../../contexts/ThemeContext";
import HeroImgDay from "../../assets/images/hero_banner_day.jpg";
import HeroImgAfternoon from "../../assets/images/hero_banner_afternoon.jpg";
import HeroImgNight from "../../assets/images/hero_banner_night.jpg";
import { useAppSelector } from "../../hooks/auth";
import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";

export const HeroSection = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAppSelector((s) => s.auth);
  const [city, setCity] = useState("");

  const hour = new Date().getHours();
  const isMorning = hour < 12;
  const isAfternoon = hour < 18;

  const getGreeting = () => {
    if (isMorning) return t("chaoBuoiSang");
    if (isAfternoon) return t("chaoBuoiChieu");
    return t("chaoBuoiToi");
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
      className="
        relative w-full overflow-hidden rounded-2xl flex flex-col justify-end
        shadow-[0_12px_40px_rgba(0,0,0,0.15)]
        h-60
        max-[768px]:h-50 max-[768px]:rounded-[14px]
        max-[480px]:h-40 max-[480px]:rounded-xl
      "
    >
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={
            isMorning
              ? HeroImgDay
              : isAfternoon
                ? HeroImgAfternoon
                : HeroImgNight
          }
          className={`
            w-full h-full object-cover object-center block scale-[1.02]
            ${theme === "dark" ? "brightness-[0.78]" : "brightness-100"}
            max-[768px]:object-[58%_center]
            max-[480px]:object-[62%_center]
          `}
        />
      </div>

      {/* Content Overlay */}
      <div
        className="
          absolute inset-0 flex flex-col justify-end z-10 p-8
          bg-[linear-gradient(to_top,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.25)_40%,transparent_100%)]
        "
      >
        <div className="text-white max-[480px]:max-w-[90%]">
          <h1
            className="
              font-bold leading-[1.2] mb-2 tracking-[-0.5px]
              [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]
              text-[32px]
              max-[768px]:text-[26px] max-[768px]:mb-1.5
              max-[480px]:text-[22px] max-[480px]:mb-1
            "
          >
            {getGreeting()}
          </h1>
          <p
            className="
              text-white/95 font-medium [text-shadow:0_1px_6px_rgba(0,0,0,0.3)] mb-1.5
              text-[18px]
              max-[768px]:text-[16px] max-[768px]:mb-1
              max-[480px]:text-[14px] max-[480px]:mb-0.5
            "
          >
            {user.fullName}
          </p>
          <p
            className="
              text-white/85 flex items-center gap-1.5 [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]
              text-[14px]
              max-[768px]:text-[13px]
              max-[480px]:text-[12px]
            "
          >
            {user.userId} - {user.factory} {city}
          </p>
        </div>
      </div>
    </section>
  );
};
