import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { LanguageBadge } from './ui/LanguageBadge';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!userDropdownRef.current?.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="header-wrapper">
      <div className="header-container">
        {/* Left section - Menu toggle (placeholder) */}
        <div className="header-left">
          <button
            className="header-icon-btn"
            aria-label="Menu"
            title="Menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Right section - Controls */}
        <div className="header-right">
          {/* Notification Icon */}
          <button
            className="header-icon-btn"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-badge">1</span>
          </button>

          {/* QR Icon */}
          <button
            className="header-icon-btn"
            aria-label="QR Code"
            title="QR Code"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="4" height="4" />
            </svg>
          </button>

          {/* Theme Toggle */}
          <button
            className="header-icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Language Badge */}
          <LanguageBadge />

          {/* User Badge with Dropdown */}
          <div className="user-badge-container" ref={userDropdownRef}>
            <button
              className="user-badge"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={userDropdownOpen}
            >
              <div className="user-avatar">TT</div>
              <span className="user-name">Trương Tấn Đạt</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="none"
                className={`user-chevron ${userDropdownOpen ? 'open' : ''}`}
              >
                <path
                  d="M3 5L7 9L11 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && (
              <div className="user-dropdown" role="menu">
                <div className="user-dropdown-item" role="menuitem">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Thông tin cá nhân
                </div>
                <div className="user-dropdown-item" role="menuitem">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                  Cài đặt
                </div>
                <div className="user-dropdown-divider" />
                <div className="user-dropdown-item user-dropdown-logout" role="menuitem">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
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
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          background: var(--header-bg);
          backdrop-filter: blur(8px);
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .dark .header-wrapper {
          --header-bg: rgba(15, 27, 48, 0.8);
          --border-color: rgba(255, 255, 255, 0.1);
        }

        .light .header-wrapper {
          --header-bg: rgba(255, 255, 255, 0.9);
          --border-color: rgba(0, 0, 0, 0.1);
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 100%;
          margin: 0 auto;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          color: var(--icon-color);
          transition: all 0.2s ease;
          position: relative;
        }

        .dark .header-icon-btn {
          --icon-color: rgba(147, 197, 253, 0.8);
        }

        .light .header-icon-btn {
          --icon-color: var(--primary);
        }

        .header-icon-btn:hover {
          background: var(--icon-hover-bg);
          border-color: var(--icon-hover-border);
        }

        .dark .header-icon-btn:hover {
          --icon-hover-bg: rgba(255, 255, 255, 0.1);
          --icon-hover-border: rgba(147, 197, 253, 0.3);
        }

        .light .header-icon-btn:hover {
          --icon-hover-bg: rgba(37, 99, 235, 0.1);
          --icon-hover-border: rgba(37, 99, 235, 0.3);
        }

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--badge-border);
        }

        .dark .notification-badge {
          --badge-border: rgba(15, 27, 48, 0.8);
        }

        .light .notification-badge {
          --badge-border: rgba(255, 255, 255, 0.9);
        }

        .user-badge-container {
          position: relative;
        }

        .user-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          color: var(--user-text);
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
        }

        .dark .user-badge {
          --user-text: rgba(255, 255, 255, 0.87);
        }

        .light .user-badge {
          --user-text: var(--primary);
        }

        .user-badge:hover {
          background: var(--user-hover-bg);
          border-color: var(--user-hover-border);
        }

        .dark .user-badge:hover {
          --user-hover-bg: rgba(255, 255, 255, 0.1);
          --user-hover-border: rgba(147, 197, 253, 0.3);
        }

        .light .user-badge:hover {
          --user-hover-bg: rgba(37, 99, 235, 0.1);
          --user-hover-border: rgba(37, 99, 235, 0.3);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .user-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }

        .user-chevron {
          transition: transform 0.2s ease;
          color: var(--chevron-color);
        }

        .dark .user-chevron {
          --chevron-color: rgba(147, 197, 253, 0.6);
        }

        .light .user-chevron {
          --chevron-color: var(--primary);
        }

        .user-chevron.open {
          transform: rotate(180deg);
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          border-radius: 12px;
          background: var(--dropdown-bg);
          border: 1px solid var(--dropdown-border);
          box-shadow: var(--dropdown-shadow);
          overflow: hidden;
          animation: slideDown 0.2s ease;
          z-index: 1000;
        }

        .dark .user-dropdown {
          --dropdown-bg: rgba(8, 20, 45, 0.95);
          --dropdown-border: rgba(255, 255, 255, 0.1);
          --dropdown-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }

        .light .user-dropdown {
          --dropdown-bg: rgba(255, 255, 255, 0.95);
          --dropdown-border: rgba(0, 0, 0, 0.1);
          --dropdown-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .user-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          cursor: pointer;
          color: var(--dropdown-item-text);
          font-size: 14px;
          transition: background 0.15s ease;
        }

        .dark .user-dropdown-item {
          --dropdown-item-text: rgba(255, 255, 255, 0.8);
        }

        .light .user-dropdown-item {
          --dropdown-item-text: var(--primary);
        }

        .user-dropdown-item:hover {
          background: var(--dropdown-item-hover);
        }

        .dark .user-dropdown-item:hover {
          --dropdown-item-hover: rgba(147, 197, 253, 0.1);
        }

        .light .user-dropdown-item:hover {
          --dropdown-item-hover: rgba(37, 99, 235, 0.1);
        }

        .user-dropdown-item svg {
          flex-shrink: 0;
          color: var(--dropdown-icon-color);
        }

        .dark .user-dropdown-item svg {
          --dropdown-icon-color: rgba(147, 197, 253, 0.7);
        }

        .light .user-dropdown-item svg {
          --dropdown-icon-color: var(--accent);
        }

        .user-dropdown-logout {
          color: #ef4444;
        }

        .user-dropdown-logout:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .user-dropdown-logout svg {
          color: #ef4444;
        }

        .user-dropdown-divider {
          height: 1px;
          background: var(--divider-color);
          margin: 4px 0;
        }

        .dark .user-dropdown-divider {
          --divider-color: rgba(255, 255, 255, 0.1);
        }

        .light .user-dropdown-divider {
          --divider-color: rgba(0, 0, 0, 0.1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .user-name {
            display: none;
          }

          .header-right {
            gap: 8px;
          }
        }
      `}</style>
    </header>
  );
};
