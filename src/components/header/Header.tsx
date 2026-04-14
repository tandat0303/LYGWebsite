import { Bell, QrCode, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { UserBadge } from "./UserBadge";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
  onNotification?: () => void;
  onQRCode?: () => void;
}

export function Header({ onMenuClick, onNotification, onQRCode }: HeaderProps) {
  const { isDark } = useTheme();
  const [notificationCount] = useState(3);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-lg transition-colors ${
        isDark
          ? "bg-slate-950/80 border-slate-700"
          : "bg-white/80 border-slate-200"
      }`}
    >
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <button
              onClick={onMenuClick}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">LY</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg">LYG</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={onNotification}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* QR Code */}
          <button
            onClick={onQRCode}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
            aria-label="QR Code"
          >
            <QrCode className="w-5 h-5" />
          </button>

          {/* User Badge */}
          <UserBadge
            onLogout={() => console.log("Logout")}
            onProfile={() => console.log("Profile")}
            onSettings={() => console.log("Settings")}
          />
        </div>
      </div>
    </header>
  );
}
