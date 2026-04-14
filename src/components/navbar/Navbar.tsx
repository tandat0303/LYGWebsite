import { Home, Briefcase, Settings, HelpCircle, FileText } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

interface NavbarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems: NavItem[] = [
  {
    icon: <Home className="w-5 h-5" />,
    label: "Trang chủ",
    href: "/",
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    label: "Dự án",
    href: "/projects",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Tài liệu",
    href: "/documents",
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    label: "Trợ giúp",
    href: "/help",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Cài đặt",
    href: "/settings",
  },
];

export function Navbar({ isOpen = false, onClose }: NavbarProps) {
  const { isDark } = useTheme();
  const [activeItem, setActiveItem] = useState("/");

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation */}
      <nav
        className={`fixed md:static top-16 left-0 h-[calc(100vh-64px)] md:h-auto w-64 md:w-auto transition-all duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          isDark
            ? "bg-slate-900 border-r border-slate-700"
            : "bg-slate-50 border-r border-slate-200"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Main Navigation */}
          <div
            className={`flex-1 overflow-y-auto py-2 px-2 ${isDark ? "scrollbar-dark" : "scrollbar-light"}`}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setActiveItem(item.href);
                  onClose?.();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative mb-1 ${
                  activeItem === item.href
                    ? isDark
                      ? "bg-blue-900/30 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                    : isDark
                      ? "text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Footer Info - Hidden on Mobile */}
          <div
            className={`hidden md:block px-3 py-3 border-t mt-auto ${
              isDark
                ? "border-slate-700 text-slate-400"
                : "border-slate-200 text-slate-500"
            }`}
          >
            <p className="text-xs font-medium">Phiên bản 1.0.0</p>
          </div>
        </div>
      </nav>
    </>
  );
}
