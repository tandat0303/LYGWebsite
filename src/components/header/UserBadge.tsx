import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserBadgeProps {
  user?: User;
  onLogout?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
}

export function UserBadge({
  user,
  onLogout,
  onProfile,
  onSettings,
}: UserBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  const mockUser: User = user || {
    id: "1",
    name: "Trương Tấn Đạt",
    email: "truong@example.com",
    avatar: "/placeholder-user.jpg",
  };

  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 h-10 px-2 rounded-lg transition-colors cursor-pointer ${
          isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
        }`}
      >
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm ${
            isDark ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"
          }`}
        >
          {mockUser.avatar ? (
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="hidden md:flex flex-col items-start min-w-0">
          <span className="text-sm font-semibold leading-none truncate">
            {mockUser.name}
          </span>
          <span
            className={`text-xs leading-none truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {mockUser.email}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full right-0 mt-2 w-56 rounded-lg border shadow-lg z-50 ${
            isDark
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-slate-200"
          }`}
        >
          {/* User Info */}
          <div
            className={`px-4 py-3 border-b ${isDark ? "border-slate-700" : "border-slate-100"}`}
          >
            <p className="text-sm font-semibold">{mockUser.name}</p>
            <p
              className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {mockUser.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                onProfile?.();
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                isDark
                  ? "hover:bg-slate-800 text-slate-300"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <User className="w-4 h-4" />
              Hồ sơ
            </button>
            <button
              onClick={() => {
                onSettings?.();
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                isDark
                  ? "hover:bg-slate-800 text-slate-300"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <Settings className="w-4 h-4" />
              Cài đặt
            </button>
          </div>

          {/* Logout */}
          <div
            className={`border-t ${isDark ? "border-slate-700" : "border-slate-100"}`}
          >
            <button
              onClick={() => {
                onLogout?.();
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                isDark
                  ? "hover:bg-red-900/20 text-red-400"
                  : "hover:bg-red-50 text-red-600"
              }`}
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
