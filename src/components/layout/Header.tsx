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
  Settings,
  LogOut,
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

  return (
    <header
      className="header-wrapper sticky top-0 z-40 h-[56px] backdrop-blur-md shrink-0 transition-colors duration-300 ease-[ease]"
      style={{ padding: "0 12px" }}
    >
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-[9px]
                      border border-transparent bg-transparent cursor-pointer
                      transition-all duration-180 ease-[ease] relative shrink-0
                      header-icon-btn lg:hidden"
            aria-label="Menu"
            title="Toggle sidebar"
            onClick={toggleSidebar}
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-[9px]
                      border border-transparent bg-transparent cursor-pointer
                      transition-all duration-180 ease-[ease] relative shrink-0
                      header-icon-btn"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={20} />
            <span
              className="flex absolute top-1 right-1 w-3.5 h-3.5 rounded-full
                            bg-[#ef4444] text-white text-[9px] font-bold
                            items-center justify-center leading-none
                            notification-badge"
            >
              1
            </span>
          </button>

          <button
            className="flex items-center justify-center w-9 h-9 rounded-[9px]
                      border border-transparent bg-transparent cursor-pointer
                      transition-all duration-180 ease-[ease] relative shrink-0
                      header-icon-btn"
            aria-label="QR Code"
            title="QR Code"
          >
            <QrCode size={20} />
          </button>

          <button
            className={`flex items-center bg-none border-none cursor-pointer shrink-0
                      ${theme === "dark" ? "is-dark" : "is-light"}`}
            style={{ padding: "0 4px" }}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title="Toggle theme"
          >
            <span
              className="relative w-[46px] h-[25px] rounded-full block transition-colors duration-300 ease-[ease]
                        theme-toggle-track"
            >
              <span
                className="flex absolute top-1/2 -translate-y-1/2 w-[19px] h-[19px]
                          rounded-full items-center justify-center [transition:left_0.28s_cubic-bezier(0.34,1.56,0.64,1),background_0.3s_ease,box-shadow_0.3s_ease]
                          theme-toggle-thumb"
              >
                {theme === "dark" ? (
                  <Moon size={13} strokeWidth={2.5} />
                ) : (
                  <Sun size={13} strokeWidth={2.5} />
                )}
              </span>
            </span>
          </button>

          <div
            className="header-divider w-[1px] h-[22px] shrink-0 hidden md:block"
            style={{ margin: "0 4px" }}
          />

          <div className="relative" ref={languageDropdownRef}>
            <button
              className="flex items-center gap-2 min-h-9 rounded-full
                        border border-transparent bg-transparent cursor-pointer
                        transition-all duration-180 ease-[ease]
                        lang-badge"
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={languageDropdownOpen}
            >
              <img
                src={selectedLang.flag}
                alt={selectedLang.label}
                className="w-[22px] h-[22px] rounded-full object-cover shrink-0 border border-white/12"
              />

              <span className="overflow-hidden text-ellipsis hidden md:block">
                {t(selectedLang.label)}
              </span>

              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ease-[ease]
                            opacity-50 shrink-0 hidden md:block
                            ${languageDropdownOpen ? "rotate-180 opacity-80" : ""}`}
              />
            </button>

            {languageDropdownOpen && (
              <div
                className="absolute top-[calc(100%+8px)] right-0 rounded-xl
                          overflow-hidden animate-[slideDown_0.18s_cubic-bezier(0.16,1,0.3,1)] 
                          z-1000 w-max p-1.5 dropdown-menu"
                role="menu"
              >
                {LANGS.map((lang) => (
                  <div
                    key={lang.code}
                    className={`flex items-center gap-2.5 cursor-pointer
                                text-[13px] font-[450] transition-colors 
                                duration-130 ease-[ease] dropdown-item
                                ${selectedLang.code === lang.code ? "active" : ""}`}
                    style={{ padding: "9px 13px" }}
                    role="menuitem"
                    onClick={() => handleSelectLang(lang)}
                  >
                    <img
                      src={lang.flag}
                      alt={lang.label}
                      className="w-[22px] h-[22px] rounded-full object-cover shrink-0 border border-white/12"
                    />

                    <span className="whitespace-nowrap hidden md:block">
                      {t(lang.label)}
                    </span>

                    {selectedLang.code === lang.code && (
                      <span className="w-1.5 h-1.5 rounded-full opacity-70 shrink 0 hidden md:block active-dot" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="header-divider w-[1px] h-[22px] shrink-0 hidden md:block" />

          <div className="relative" ref={userDropdownRef}>
            <button
              className="flex items-center gap-[7px] rounded-full cursor-pointer
                        transition-all duration-200 ease-[ease] user-badge"
              style={{ padding: "5px 12px 5px 6px" }}
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={userDropdownOpen}
            >
              <div
                className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]
                            text-white flex items-center justify-center text-[11px] font-bold
                            shrink-0 shadow-[0_1px_4px_rgba(59,130,246,0.4)]"
              >
                <User size={15} />
              </div>

              <div className="flex-col items-start gap-[1px] hidden md:flex">
                <span className="text-[13px] font-semibold whitespace-nowrap leading-[1.2] text-inherit">
                  {user.fullName}
                </span>
                <span className="text-[11px] opacity-65 whitespace-nowrap leading-[1.2] text-inherit">
                  {user.factory}
                </span>
              </div>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ease-[ease]
                            opacity-50 shrink-0
                            ${userDropdownOpen ? "rotate-180 opacity-80" : ""}`}
              />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute top-[calc(100%+8px)] right-0 rounded-xl
                          overflow-hidden animate-[slideDown_0.18s_cubic-bezier(0.16,1,0.3,1)] 
                          z-1000 min-w-[200px] dropdown-menu"
                role="menu"
              >
                <div
                  className="flex items-center gap-2.5"
                  style={{ padding: "12px 13px" }}
                >
                  <div
                    className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]
                              text-white flex items-center justify-center text-xs font-bold
                                shrink-0 shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
                  >
                    <User size={15} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold dropdown-user-name">
                      {user.fullName}
                    </div>
                    <div className="text-[11.5px] mt-0.5 dropdown-user-email">
                      {user.nameshow}
                    </div>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <div
                  className="flex items-center gap-2.5 cursor-pointer
                                text-[13px] font-[450] transition-colors 
                                duration-130 ease-[ease] dropdown-item"
                  role="menuitem"
                  style={{ padding: "9px 13px" }}
                  onClick={handleAccessInfo}
                >
                  <User size={14} />
                  {t("thongTinCaNhan")}
                </div>
                <div
                  className="flex items-center gap-2.5 cursor-pointer
                                text-[13px] font-[450] transition-colors 
                                duration-130 ease-[ease] dropdown-item"
                  role="menuitem"
                  style={{ padding: "9px 13px" }}
                >
                  <Settings size={14} />
                  {t("caiDat")}
                </div>
                <div className="dropdown-divider" />
                <div
                  className="flex items-center gap-2.5 cursor-pointer
                                text-[13px] font-[450] transition-colors 
                                duration-130 ease-[ease] !text-[#f87171]
                                hover:!bg-red-500/10 dropdown-item"
                  role="menuitem"
                  style={{ padding: "9px 13px" }}
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
        .header-wrapper {
          border-bottom: 1px solid var(--border-color);
          background: var(--header-bg);
        }

        .dark .header-wrapper {
          --header-bg: rgba(15, 23, 42, 0.85);
          --border-color: rgba(255, 255, 255, 0.07);
        }

        .light .header-wrapper {
          --header-bg: rgba(255, 255, 255, 0.92);
          --border-color: rgba(0, 0, 0, 0.07);
        }

        .header-divider {
          background: var(--divider-color);
        }

        .dark .header-divider { --divider-color: rgba(255, 255, 255, 0.1); }
        .light .header-divider { --divider-color: rgba(0, 0, 0, 0.1); }

        /* ── Icon buttons ── */
        .header-icon-btn {
          color: var(--icon-color);
        }

        .dark .header-icon-btn { --icon-color: rgba(148, 163, 184, 0.85); }
        .light .header-icon-btn { --icon-color: rgba(71, 85, 105, 0.85); }

        .header-icon-btn:hover {
          background: var(--icon-hover-bg);
          border-color: var(--icon-hover-border);
          color: var(--icon-hover-color);
        }

        .dark .header-icon-btn:hover {
          --icon-hover-bg: rgba(255, 255, 255, 0.08);
          --icon-hover-border: rgba(148, 163, 184, 0.2);
          --icon-hover-color: rgba(226, 232, 240, 0.95);
        }

        .light .header-icon-btn:hover {
          --icon-hover-bg: rgba(37, 99, 235, 0.07);
          --icon-hover-border: rgba(37, 99, 235, 0.2);
          --icon-hover-color: #1d4ed8;
        }

        .theme-toggle-track {
          background: var(--track-bg);
          border: 1.5px solid var(--track-border);
        }

        .is-light .theme-toggle-track {
          --track-bg: rgba(251, 191, 36, 0.15);
          --track-border: rgba(251, 191, 36, 0.45);
        }

        .is-dark .theme-toggle-track {
          --track-bg: rgba(139, 92, 246, 0.18);
          --track-border: rgba(139, 92, 246, 0.45);
        }

        .is-light .theme-toggle-thumb {
          left: 2px;
          background: #f59e0b;
          color: #fff;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.5);
        }

        .is-dark .theme-toggle-thumb {
          left: calc(100% - 21px);
          background: #7c3aed;
          color: #fff;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.55);
        }

        /* ── Notification badge ── */
        .notification-badge {
          border: 1.5px solid var(--badge-border);
        }

        .dark .notification-badge { --badge-border: rgba(15, 23, 42, 0.9); }
        .light .notification-badge { --badge-border: rgba(255, 255, 255, 0.95); }

        /* ── Language badge ── */
        .lang-badge {
          padding: 4px 10px;
          color: var(--badge-text);
        }

        .lang-badge:hover {
          background: var(--badge-hover-bg);
          border-color: var(--badge-hover-border);
        }

        .lang-name { overflow: hidden; text-overflow: ellipsis; }

        .dark .lang-badge { --badge-text: rgba(203, 213, 225, 0.9); }
        .light .lang-badge { --badge-text: rgba(51, 65, 85, 0.9); }

        .lang-badge:hover {
          background: var(--badge-hover-bg);
          border-color: var(--badge-hover-border);
        }

        .dark .lang-badge:hover {
          --badge-hover-bg: rgba(255, 255, 255, 0.07);
          --badge-hover-border: rgba(148, 163, 184, 0.2);
        }

        .light .lang-badge:hover {
          --badge-hover-bg: rgba(37, 99, 235, 0.06);
          --badge-hover-border: rgba(37, 99, 235, 0.2);
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .lang-badge {
            padding: 0;
            width: 36px;
            height: 36px;
            justify-content: center;
            border-radius: 999px;
          }
        }

        /* ── User badge ── label tag style */
        .user-badge {
          border: 1px solid var(--badge-border);
          background: var(--badge-bg);
          color: var(--badge-text);
        }

        .dark .user-badge {
          --badge-bg: rgba(59, 130, 246, 0.12);
          --badge-border: rgba(59, 130, 246, 0.28);
          --badge-text: rgba(147, 197, 253, 0.95);
        }

        .light .user-badge {
          --badge-bg: rgba(37, 99, 235, 0.07);
          --badge-border: rgba(37, 99, 235, 0.22);
          --badge-text: rgba(29, 78, 216, 0.9);
        }

        .user-badge:hover {
          background: var(--badge-hover-bg);
          border-color: var(--badge-hover-border);
          box-shadow: var(--badge-hover-shadow);
        }

        .dark .user-badge:hover {
          --badge-hover-bg: rgba(59, 130, 246, 0.2);
          --badge-hover-border: rgba(59, 130, 246, 0.45);
          --badge-hover-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .light .user-badge:hover {
          --badge-hover-bg: rgba(37, 99, 235, 0.12);
          --badge-hover-border: rgba(37, 99, 235, 0.38);
          --badge-hover-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        /* ── Dropdown menus ── */
        .dropdown-menu {
          background: var(--dropdown-bg);
          border: 1px solid var(--dropdown-border);
          box-shadow: var(--dropdown-shadow);
        }

        .dark .dropdown-menu {
          --dropdown-bg: rgba(15, 23, 42, 0.97);
          --dropdown-border: rgba(255, 255, 255, 0.09);
          --dropdown-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
        }

        .light .dropdown-menu {
          --dropdown-bg: rgba(255, 255, 255, 0.98);
          --dropdown-border: rgba(0, 0, 0, 0.08);
          --dropdown-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
        }

        /* Language section inside user dropdown (mobile only) */
        .dropdown-lang-mobile { display: none; }

        @media (max-width: 768px) {
          .dropdown-lang-mobile { display: block; }
        }

        /* ── Dropdown header ── */
        .dropdown-header {
          padding: 9px 13px 7px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--dropdown-header-text);
        }

        .dark .dropdown-header { --dropdown-header-text: rgba(148, 163, 184, 0.5); }
        .light .dropdown-header { --dropdown-header-text: rgba(100, 116, 139, 0.65); }


        .dropdown-user-name {
          color: var(--dropdown-text);
        }

        .dropdown-user-email {
          color: var(--dropdown-subtext);
        }

        .dark .dropdown-user-name { --dropdown-text: rgba(226, 232, 240, 0.95); }
        .light .dropdown-user-name { --dropdown-text: rgba(30, 41, 59, 0.95); }
        .dark .dropdown-user-email { --dropdown-subtext: rgba(148, 163, 184, 0.6); }
        .light .dropdown-user-email { --dropdown-subtext: rgba(100, 116, 139, 0.7); }

        /* ── Dropdown items ── */
        .dropdown-item {
          color: var(--item-text);
        }

        .dark .dropdown-item { --item-text: rgba(203, 213, 225, 0.85); }
        .light .dropdown-item { --item-text: rgba(51, 65, 85, 0.9); }

        .dropdown-item:hover { background: var(--item-hover-bg); }

        .dark .dropdown-item:hover { --item-hover-bg: rgba(255, 255, 255, 0.06); }
        .light .dropdown-item:hover { --item-hover-bg: rgba(37, 99, 235, 0.06); }

        .dropdown-item.active {
          background: var(--item-active-bg);
          color: var(--item-active-text);
        }

        .dark .dropdown-item.active {
          --item-active-bg: rgba(59, 130, 246, 0.15);
          --item-active-text: rgba(147, 197, 253, 0.95);
        }

        .light .dropdown-item.active {
          --item-active-bg: rgba(37, 99, 235, 0.08);
          --item-active-text: #1d4ed8;
        }

        .lang-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 1px;
        }

        .lang-native { font-size: 13px; font-weight: 500; line-height: 1.2; }
        .lang-label  { font-size: 11px; opacity: 0.5; line-height: 1.2; }

        .active-dot {
          background: currentColor;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--divider-color);
          margin: 3px 0;
        }

        .dark .dropdown-divider { --divider-color: rgba(255, 255, 255, 0.07); }
        .light .dropdown-divider { --divider-color: rgba(0, 0, 0, 0.07); }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </header>
  );
};
