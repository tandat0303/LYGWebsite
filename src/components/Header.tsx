import { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useAppDispatch, useAppSelector } from "../hooks/auth";
import storage from "../libs/storage";
import { logout } from "../features/authSlice";
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
import { LANGS } from "../libs/constance";
import type { Lang } from "../types/storage";

export const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Lang>(() => {
    const savedCode = localStorage.getItem("language");

    return LANGS.find((lang) => lang.code === savedCode) || LANGS[0];
  });

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

  const handleLogout = () => {
    storage.remove("auth");
    dispatch(logout());
    window.location.href = "/login";
  };

  const handleSelectLang = (lang: Lang) => {
    setSelectedLang(lang);
    localStorage.setItem("language", lang.code);
    setLanguageDropdownOpen(false);
  };

  return (
    <header className="header-wrapper">
      <div className="header-container">
        <div className="header-left">
          <button
            className="header-icon-btn mobile-menu-btn"
            aria-label="Menu"
            title="Toggle sidebar"
            onClick={toggleSidebar}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Right */}
        <div className="header-right">
          {/* Notification */}
          <button
            className="header-icon-btn"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="notification-badge">1</span>
          </button>

          <button
            className="header-icon-btn"
            aria-label="QR Code"
            title="QR Code"
          >
            <QrCode size={20} />
          </button>

          {/* Theme Toggle */}
          <button
            className={`theme-toggle ${theme === "dark" ? "is-dark" : "is-light"}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title="Toggle theme"
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb">
                {theme === "dark" ? (
                  <Moon size={13} strokeWidth={2.5} />
                ) : (
                  <Sun size={13} strokeWidth={2.5} />
                )}
              </span>
            </span>
          </button>

          <div className="header-divider hide-sm" />

          <div className="dropdown-container" ref={languageDropdownRef}>
            <button
              className="lang-badge"
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={languageDropdownOpen}
            >
              <img
                src={selectedLang.flag}
                alt={selectedLang.label}
                className="lang-flag"
              />

              {/* desktop mới hiện text */}
              <span className="lang-name">{selectedLang.native}</span>

              <ChevronDown
                size={13}
                className={`dropdown-chevron ${languageDropdownOpen ? "open" : ""}`}
              />
            </button>

            {languageDropdownOpen && (
              <div className="dropdown-menu lang-dropdown" role="menu">
                {LANGS.map((lang) => (
                  <div
                    key={lang.code}
                    className={`dropdown-item lang-option ${
                      selectedLang.code === lang.code ? "active" : ""
                    }`}
                    role="menuitem"
                    onClick={() => handleSelectLang(lang)}
                  >
                    <img
                      src={lang.flag}
                      alt={lang.label}
                      className="dropdown-flag"
                    />

                    <span className="lang-option-name">{lang.native}</span>

                    {selectedLang.code === lang.code && (
                      <span className="active-dot" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="header-divider" />

          {/* User Dropdown */}
          <div className="dropdown-container" ref={userDropdownRef}>
            <button
              className="user-badge"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={userDropdownOpen}
            >
              <div className="user-avatar">
                <User size={15} />
              </div>
              {/* Tên + role: ẩn trên mobile */}
              <div className="user-info">
                <span className="user-name">{user.fullName}</span>
                <span className="user-role">{user.factory}</span>
              </div>
              <ChevronDown
                size={13}
                className={`dropdown-chevron ${userDropdownOpen ? "open" : ""}`}
              />
            </button>

            {userDropdownOpen && (
              <div className="dropdown-menu user-dropdown" role="menu">
                <div className="dropdown-user-info">
                  <div className="dropdown-avatar">
                    <User size={15} />
                  </div>
                  <div>
                    <div className="dropdown-user-name">{user.fullName}</div>
                    <div className="dropdown-user-email">{user.nameshow}</div>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <div className="dropdown-item" role="menuitem">
                  <User size={14} />
                  Thông tin cá nhân
                </div>
                <div className="dropdown-item" role="menuitem">
                  <Settings size={14} />
                  Cài đặt
                </div>
                <div className="dropdown-divider" />
                <div
                  className="dropdown-item dropdown-logout"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut size={14} />
                  Đăng xuất
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .header-wrapper {
          position: sticky;
          top: 0;
          z-index: 40;
          padding: 0 12px;
          height: 56px;
          border-bottom: 1px solid var(--border-color);
          background: var(--header-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: background 0.3s ease, border-color 0.3s ease;
          flex-shrink: 0;
        }

        .dark .header-wrapper {
          --header-bg: rgba(15, 23, 42, 0.85);
          --border-color: rgba(255, 255, 255, 0.07);
        }

        .light .header-wrapper {
          --header-bg: rgba(255, 255, 255, 0.92);
          --border-color: rgba(0, 0, 0, 0.07);
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        /* Hamburger chỉ hiện trên mobile (desktop sidebar có nút riêng) */
        .mobile-menu-btn {
          display: none !important;
        }

        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .header-divider {
          width: 1px;
          height: 22px;
          background: var(--divider-color);
          margin: 0 4px;
          flex-shrink: 0;
        }

        .dark .header-divider { --divider-color: rgba(255, 255, 255, 0.1); }
        .light .header-divider { --divider-color: rgba(0, 0, 0, 0.1); }

        /* Ẩn các phần không cần thiết trên mobile */
        @media (max-width: 768px) {
          .hide-sm { display: none !important; }
        }

        @media (max-width: 480px) {
          .hide-xs { display: none !important; }
        }

        /* ── Icon buttons ── */
        .header-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          color: var(--icon-color);
          transition: all 0.18s ease;
          position: relative;
          flex-shrink: 0;
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

        /* ── Theme toggle ── */
        .theme-toggle {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          padding: 0 4px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .theme-toggle-track {
          position: relative;
          width: 46px;
          height: 25px;
          border-radius: 999px;
          background: var(--track-bg);
          border: 1.5px solid var(--track-border);
          transition: background 0.3s ease, border-color 0.3s ease;
          display: block;
        }

        .is-light .theme-toggle-track {
          --track-bg: rgba(251, 191, 36, 0.15);
          --track-border: rgba(251, 191, 36, 0.45);
        }

        .is-dark .theme-toggle-track {
          --track-bg: rgba(139, 92, 246, 0.18);
          --track-border: rgba(139, 92, 246, 0.45);
        }

        .theme-toggle-thumb {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 19px;
          height: 19px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.3s ease,
                      box-shadow 0.3s ease;
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
          position: absolute;
          top: 4px;
          right: 4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ef4444;
          color: white;
          font-size: 9px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--badge-border);
          line-height: 1;
        }

        .dark .notification-badge { --badge-border: rgba(15, 23, 42, 0.9); }
        .light .notification-badge { --badge-border: rgba(255, 255, 255, 0.95); }

        /* ── Dropdown container ── */
        .dropdown-container { position: relative; }

        /* ── Language badge ── */
        .lang-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  min-height: 36px;
  border-radius: 999px; /* full rounded */
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  color: var(--badge-text);
  transition: all 0.18s ease;
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

        .lang-flag,
        .dropdown-flag {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.12);
        }

.lang-option-name {
  white-space: nowrap;
}

/* MOBILE */
@media (max-width: 768px) {
  .lang-name,
  .lang-option-name,
  .lang-badge .dropdown-chevron {
    display: none;
  }

  .lang-badge {
    padding: 0;
    width: 36px;
    height: 36px;
    justify-content: center;
    border-radius: 999px;
  }

  .lang-dropdown {
  width: max-content;
  padding: 6px;
  border-radius: 18px;
}

  .lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  justify-content: center;
}

  .active-dot {
    display: none;
  }
}

        /* ── User badge ── label tag style */
        .user-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 12px 5px 6px;
          border-radius: 999px;
          border: 1px solid var(--badge-border);
          background: var(--badge-bg);
          cursor: pointer;
          color: var(--badge-text);
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
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

        .user-avatar {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 1px 4px rgba(59, 130, 246, 0.4);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          line-height: 1.2;
          color: inherit;
        }

        .user-role {
          font-size: 11px;
          opacity: 0.65;
          white-space: nowrap;
          line-height: 1.2;
          color: inherit;
        }

        @media (max-width: 768px) {
          .user-info { display: none; }
        }

        /* ── Chevron ── */
        .dropdown-chevron {
          transition: transform 0.2s ease;
          opacity: 0.5;
          flex-shrink: 0;
        }

        .dropdown-chevron.open {
          transform: rotate(180deg);
          opacity: 0.8;
        }

        /* ── Dropdown menus ── */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          border-radius: 12px;
          background: var(--dropdown-bg);
          border: 1px solid var(--dropdown-border);
          box-shadow: var(--dropdown-shadow);
          overflow: hidden;
          animation: slideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1000;
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

        .user-dropdown { min-width: 200px; }

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

        /* ── Dropdown user info ── */
        .dropdown-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 13px;
        }

        .dropdown-avatar {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .dropdown-user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--dropdown-text);
        }

        .dropdown-user-email {
          font-size: 11.5px;
          color: var(--dropdown-subtext);
          margin-top: 2px;
        }

        .dark .dropdown-user-name { --dropdown-text: rgba(226, 232, 240, 0.95); }
        .light .dropdown-user-name { --dropdown-text: rgba(30, 41, 59, 0.95); }
        .dark .dropdown-user-email { --dropdown-subtext: rgba(148, 163, 184, 0.6); }
        .light .dropdown-user-email { --dropdown-subtext: rgba(100, 116, 139, 0.7); }

        /* ── Dropdown items ── */
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 13px;
          cursor: pointer;
          color: var(--item-text);
          font-size: 13px;
          font-weight: 450;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.13s ease;
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
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.7;
          flex-shrink: 0;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--divider-color);
          margin: 3px 0;
        }

        .dark .dropdown-divider { --divider-color: rgba(255, 255, 255, 0.07); }
        .light .dropdown-divider { --divider-color: rgba(0, 0, 0, 0.07); }

        .dropdown-logout { color: #f87171 !important; }
        .dropdown-logout:hover { background: rgba(239, 68, 68, 0.1) !important; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </header>
  );
};
