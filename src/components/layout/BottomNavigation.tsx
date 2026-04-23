import type { SidebarIcon } from "../../types/sidebar";
import { NAV_ITEMS, ROUTE_MAP } from "../../libs/constance";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";

export const BottomNavigation = () => {
  const { t } = useTranslation();
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
    if (route) navigate(route);
  };

  const renderIcon = (icon: SidebarIcon, isActive: boolean) => {
    const iconWrapCls = `flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200
      ${isActive ? "bg-blue-600/15 dark:bg-blue-600/15" : "bg-transparent"}`;

    if (typeof icon === "string") {
      return <img src={icon} className={`${iconWrapCls} object-contain`} />;
    }
    if (typeof icon === "function") {
      const Icon = icon;
      return (
        <span className={iconWrapCls}>
          <Icon size={18} />
        </span>
      );
    }
    return <span className={iconWrapCls}>{icon}</span>;
  };

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-30 flex md:hidden
        justify-around items-center backdrop-blur-sm
        transition-colors duration-300
        border-t border-black/10 bg-white/90
        dark:border-white/10 dark:bg-[rgba(15,27,48,0.8)]
      "
      style={{ padding: "12px 0 safe-area-inset-bottom" }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeItem === item.id;
        return (
          <button
            key={item.id}
            className={`
              flex flex-col items-center justify-center gap-1 border-none
              bg-transparent cursor-pointer transition-all duration-200
              relative flex-1 min-h-[60px] md:min-h-16
              text-[11px] font-medium text-center leading-[1.2] max-w-[60px]
              ${
                isActive
                  ? "text-[#2563eb]"
                  : "text-black/50 dark:text-white/50 hover:text-blue-700 dark:hover:text-blue-300/70"
              }
            `}
            style={{ padding: "12px 16px" }}
            onClick={() => handleItemClick(item.id, item.onClick)}
            title={item.label}
          >
            {renderIcon(item.icon, isActive)}
            <span className="whitespace-nowrap">{t(item.label)}</span>
          </button>
        );
      })}
    </nav>
  );
};
