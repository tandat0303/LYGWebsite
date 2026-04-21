import type { SidebarIcon } from "../../types/sidebar";
import { NAV_ITEMS, ROUTE_MAP } from "../../libs/constance";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
// import { useTheme } from '../contexts/ThemeContext';

export const BottomNavigation = () => {
  const { t } = useTranslation();

  // const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveLabel = () => {
    for (const [label, path] of Object.entries(ROUTE_MAP)) {
      if (location.pathname === path) return label;
    }
    return "";
  };

  const activeItem = getActiveLabel();

  const handleItemClick = (id: string, onClick?: () => void) => {
    if (onClick) {
      onClick();
      return;
    }

    const route = ROUTE_MAP[id];
    if (route) {
      navigate(route);
    }
  };

  const renderIcon = (icon: SidebarIcon) => {
    if (typeof icon === "string") {
      return (
        <img
          src={icon}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ease-[ease] nav-icon"
        />
      );
    }

    if (typeof icon === "function") {
      const Icon = icon;
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ease-[ease] nav-icon">
          <Icon size={18} />
        </span>
      );
    }

    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ease-[ease] nav-icon">
        {icon}
      </span>
    );
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden
                  justify-around items-center backdrop-blur-sm
                  transition-colors duration-300 ease-[ease] bottom-nav"
      style={{ padding: "12px 0 safe-area-inset-bottom" }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center justify-center gap-1 border-none
                      bg-transparent cursor-pointer transition-all duration-200 ease-[ease]
                      relative flex-1 min-h-[60px] md:min-h-16 nav-item 
                      ${activeItem === item.id ? "active" : ""}`}
          style={{ padding: "12px 16px" }}
          onClick={() => handleItemClick(item.id, item.onClick)}
          title={item.label}
        >
          {renderIcon(item.icon)}
          <span className="text-[11px] font-medium text-center transition-colors duration-200 ease-[ease] max-w-[60px] leading-[1.2]">
            {t(item.label)}
          </span>
          {/* {activeItem === item.id && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-[3px] rounded-[2px_2px_0_0] bg-[#2563eb]" />
          )} */}
        </button>
      ))}

      <style>{`
        .bottom-nav {
          border-top: 1px solid var(--nav-border);
          background: var(--nav-bg);
        }

        .dark .bottom-nav {
          --nav-bg: rgba(15, 27, 48, 0.8);
          --nav-border: rgba(255, 255, 255, 0.1);
        }

        .light .bottom-nav {
          --nav-bg: rgba(255, 255, 255, 0.9);
          --nav-border: rgba(0, 0, 0, 0.1);
        }

        .nav-item {
          color: var(--nav-item-color);
        }

        .dark .nav-item {
          --nav-item-color: rgba(255, 255, 255, 0.5);
        }

        .light .nav-item {
          --nav-item-color: var(--text-muted);
        }

        .nav-item:hover {
          color: var(--nav-item-hover);
        }

        .dark .nav-item:hover {
          --nav-item-hover: rgba(147, 197, 253, 0.7);
        }

        .light .nav-item:hover {
          --nav-item-hover: var(--accent);
        }

        .nav-item.active {
          color: var(--nav-item-active);
        }

        .dark .nav-item.active {
          --nav-item-active: #2563eb;
        }

        .light .nav-item.active {
          --nav-item-active: #2563eb;
        }

        .nav-item.active .nav-icon {
          background: var(--nav-icon-bg);
        }

        .dark .nav-item.active .nav-icon {
          --nav-icon-bg: rgba(37, 99, 235, 0.15);
        }

        .light .nav-item.active .nav-icon {
          --nav-icon-bg: rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </nav>
  );
};
