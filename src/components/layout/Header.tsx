import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useSidebar } from "../../contexts/SidebarContext";
import { useAppDispatch, useAppSelector } from "../../hooks/auth";
import storage from "../../libs/storage";
import { logout } from "../../features/authSlice";
import {
  Bell,
  Menu,
  QrCode,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  RotateCcwKey,
} from "lucide-react";
import { LANGS } from "../../libs/constance";
import type { Lang } from "../../types/storage";
import { useNavigate } from "react-router-dom";
import { changeLanguage } from "../../features/languageSlice";
import { useTranslation } from "../../hooks/useTranslation";

export const Header = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const selectedLang = useAppSelector((s) => s.language.current);
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!userDropdownRef.current?.contains(e.target as Node))
        setUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!languageDropdownRef.current?.contains(e.target as Node))
        setLanguageDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeAllDropdown = () => {
    setUserDropdownOpen(false);
    setLanguageDropdownOpen(false);
  };

  const handleAccessInfo = () => {
    closeAllDropdown();
    navigate("/user-info", { replace: true });
  };

  const handleAccessChangePass = () => {
    closeAllDropdown();
    navigate("/change-password", { replace: true });
  };

  const handleLogout = () => {
    closeAllDropdown();
    storage.remove("auth");
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleSelectLang = (lang: Lang) => {
    dispatch(changeLanguage(lang));
    setLanguageDropdownOpen(false);
  };

  const iconBtnCls =
    "flex items-center justify-center w-9 h-9 rounded-[9px] " +
    "border border-transparent bg-transparent cursor-pointer relative shrink-0 " +
    "transition-all duration-[180ms] " +
    "text-slate-500/85 dark:text-slate-400/85 " +
    "hover:bg-blue-600/[0.07] hover:border-blue-600/20 hover:text-[#1d4ed8] " +
    "dark:hover:bg-white/[0.08] dark:hover:border-slate-400/20 dark:hover:text-slate-200/95";

  const dropdownMenuCls =
    "absolute top-[calc(100%+8px)] right-0 rounded-xl overflow-hidden z-[1000] border " +
    "bg-white/[0.98] border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] " +
    "dark:bg-[rgba(15,23,42,0.97)] dark:border-white/[0.09] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.04)] " +
    "animate-[slideDown_0.18s_cubic-bezier(0.16,1,0.3,1)]";

  const dropdownItemCls =
    "flex items-center gap-2.5 cursor-pointer rounded-lg " +
    "text-[13px] font-[450] transition-colors duration-[130ms] " +
    "text-slate-500/90 dark:text-slate-300/85 " +
    "hover:bg-blue-600/[0.06] dark:hover:bg-white/[0.06]";

  const dropdownDividerCls =
    "h-px my-[3px] bg-black/[0.07] dark:bg-white/[0.07]";

  return (
    <header
      className="
        sticky top-0 z-40 h-14 backdrop-blur-md shrink-0
        transition-colors duration-300
        border-b border-black/[0.07] bg-white/92
        dark:border-white/[0.07] dark:bg-[rgba(15,23,42,0.85)]
      "
      style={{ padding: "0 12px" }}
    >
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center">
          <button
            className={`${iconBtnCls} lg:hidden`}
            aria-label="Menu"
            title="Toggle sidebar"
            onClick={toggleSidebar}
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            className={iconBtnCls}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={20} />
            <span
              className="
                flex absolute top-1 right-1 w-3.5 h-3.5 rounded-full
                bg-[#ef4444] text-white text-[9px] font-bold
                items-center justify-center leading-none
                border-[1.5px]
                border-white/95 dark:border-[rgba(15,23,42,0.9)]
              "
            >
              1
            </span>
          </button>

          <button className={iconBtnCls} aria-label="QR Code" title="QR Code">
            <QrCode size={20} />
          </button>

          <button
            className="flex items-center border-none bg-transparent cursor-pointer shrink-0"
            style={{ padding: "0 4px" }}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title="Toggle theme"
          >
            <span
              className="
                relative w-[46px] h-[25px] rounded-full block transition-colors duration-300
                bg-[rgba(251,191,36,0.15)] border-[1.5px] border-[rgba(251,191,36,0.45)]
                dark:bg-[rgba(139,92,246,0.18)] dark:border-[rgba(139,92,246,0.45)]
              "
            >
              {/* Thumb */}
              <span
                className="
                  flex absolute top-1/2 -translate-y-1/2 w-[19px] h-[19px]
                  rounded-full items-center justify-center text-white
                  [transition:left_0.28s_cubic-bezier(0.34,1.56,0.64,1),background_0.3s_ease,box-shadow_0.3s_ease]
                  left-0.5 bg-[#f59e0b] shadow-[0_2px_8px_rgba(245,158,11,0.5)]
                  dark:left-[calc(100%-21px)] dark:bg-[#7c3aed] dark:shadow-[0_2px_8px_rgba(124,58,237,0.55)]
                "
              >
                {theme === "dark" ? (
                  <Moon size={13} strokeWidth={2.5} />
                ) : (
                  <Sun size={13} strokeWidth={2.5} />
                )}
              </span>
            </span>
          </button>

          {/* Divider */}
          <div
            className="w-px h-[22px] shrink-0 hidden md:block bg-black/10 dark:bg-white/10"
            style={{ margin: "0 4px" }}
          />

          {/* ── Language picker ── */}
          <div className="relative" ref={languageDropdownRef}>
            <button
              className="
                flex items-center gap-2 min-h-9 rounded-full
                border border-transparent bg-transparent cursor-pointer
                transition-all duration-180
                text-slate-500/90 dark:text-slate-300/90
                hover:bg-blue-600/6 hover:border-blue-600/20
                dark:hover:bg-white/[0.07] dark:hover:border-slate-400/20
                max-md:w-11 max-md:h-11 max-md:justify-center max-md:rounded-full
              "
              style={{ padding: "4px 10px" }}
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={languageDropdownOpen}
            >
              <img
                src={selectedLang.flag}
                alt={selectedLang.label}
                className="w-[22px] h-[22px] rounded-full object-cover shrink-0 border border-white/20"
              />
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-[450] hidden md:block">
                {t(selectedLang.label)}
              </span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 opacity-50 shrink-0 hidden md:block
                  ${languageDropdownOpen ? "rotate-180 opacity-80" : ""}`}
              />
            </button>

            {languageDropdownOpen && (
              <div
                className={`${dropdownMenuCls} w-max`}
                style={{ padding: "6px" }}
                role="menu"
              >
                {LANGS.map((lang) => {
                  const isActive = selectedLang.code === lang.code;
                  return (
                    <div
                      key={lang.code}
                      className={`
                        ${dropdownItemCls}
                        ${
                          isActive
                            ? "bg-blue-500/15! text-blue-600! dark:bg-blue-500/15! dark:text-blue-300/95!"
                            : ""
                        }
                      `}
                      style={{ padding: "9px 13px" }}
                      role="menuitem"
                      onClick={() => handleSelectLang(lang)}
                    >
                      <img
                        src={lang.flag}
                        alt={lang.label}
                        className="w-[22px] h-[22px] rounded-full object-cover shrink-0 border border-white/20"
                      />
                      <span className="whitespace-nowrap hidden md:block text-[13px] font-medium">
                        {t(lang.label)}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full opacity-70 shrink-0 hidden md:block bg-current" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            className="w-px h-[22px] shrink-0 hidden md:block bg-black/10 dark:bg-white/10"
            style={{ margin: "0 4px" }}
          />

          {/* ── User menu ── */}
          <div className="relative" ref={userDropdownRef}>
            <button
              className="
                flex items-center gap-[7px] rounded-full cursor-pointer
                transition-all duration-200
                border 
                border-blue-600/22 bg-blue-600/7 text-blue-700/90
                dark:border-blue-500/[0.28] dark:bg-blue-500/12 dark:text-blue-300/95
                hover:bg-blue-600/12 hover:border-blue-600/38 hover:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]
                dark:hover:bg-blue-500/20 dark:hover:border-blue-500/45 dark:hover:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
              "
              style={{ padding: "5px 12px 5px 6px" }}
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={userDropdownOpen}
            >
              <div
                className="
                  w-[26px] h-[26px] rounded-full shrink-0
                  bg-linear-to-br from-[#3b82f6] to-[#1d4ed8]
                  text-white flex items-center justify-center text-[11px] font-bold
                  shadow-[0_1px_4px_rgba(59,130,246,0.4)]
                "
              >
                <User size={15} />
              </div>
              <div className="flex-col items-start gap-px hidden md:flex">
                <span className="text-[13px] font-semibold whitespace-nowrap leading-[1.2] text-inherit">
                  {user.fullName}
                </span>
                <span className="text-[11px] opacity-65 whitespace-nowrap leading-[1.2] text-inherit">
                  {user.factory}
                </span>
              </div>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 opacity-50 shrink-0
                  ${userDropdownOpen ? "rotate-180 opacity-80" : ""}`}
              />
            </button>

            {userDropdownOpen && (
              <div className={`${dropdownMenuCls} min-w-[200px]`} role="menu">
                {/* User info header */}
                <div
                  className="flex items-center gap-2.5"
                  style={{ padding: "12px 13px" }}
                >
                  <div
                    className="
                      w-[34px] h-[34px] rounded-[9px] shrink-0
                      bg-linear-to-br from-[#3b82f6] to-[#1d4ed8]
                      text-white flex items-center justify-center text-xs font-bold
                      shadow-[0_2px_8px_rgba(59,130,246,0.3)]
                    "
                  >
                    <User size={15} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-800/95 dark:text-slate-200/95">
                      {user.fullName}
                    </div>
                    <div className="text-[11.5px] mt-0.5 text-slate-400/70 dark:text-slate-400/60">
                      {user.nameshow}
                    </div>
                  </div>
                </div>

                <div className={dropdownDividerCls} />

                {/* Profile */}
                <div
                  className={dropdownItemCls}
                  style={{ padding: "9px 13px" }}
                  role="menuitem"
                  onClick={handleAccessInfo}
                >
                  <User size={16} />
                  {t("thongTinCaNhan")}
                </div>

                {/* Settings */}
                <div
                  className={dropdownItemCls}
                  style={{ padding: "9px 13px" }}
                  role="menuitem"
                  onClick={handleAccessChangePass}
                >
                  <RotateCcwKey size={16} />
                  {t("doiMatKhau")}
                </div>

                <div className={dropdownDividerCls} />

                {/* Logout */}
                <div
                  className="
                    flex items-center gap-2.5 cursor-pointer rounded-lg
                    text-[13px] font-[450] transition-colors duration-130
                    text-[#f87171] hover:bg-red-500/10
                  "
                  style={{ padding: "9px 13px" }}
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut size={14} />
                  {t("dangXuat")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </header>
  );
};
