import { useSidebar } from "../../contexts/SidebarContext";
import { Eye, QrCode, Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/auth";
import type { SidebarIcon, SidebarSection } from "../../types/sidebar";
import { TfiInfoAlt } from "react-icons/tfi";
import { TbBeach } from "react-icons/tb";
import { BiSolidPieChartAlt } from "react-icons/bi";
import { TbSpeakerphone } from "react-icons/tb";
import { GiRunningShoe } from "react-icons/gi";
import { SiGoogleclassroom } from "react-icons/si";
import { IoNewspaperOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { FaAppStoreIos } from "react-icons/fa";
import { GrKey } from "react-icons/gr";
import { GoBook } from "react-icons/go";
import { LuNotebookPen } from "react-icons/lu";
import { AiOutlineLogout } from "react-icons/ai";
import { PiCreditCard } from "react-icons/pi";
import { RiContactsBook3Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { RiHome3Line } from "react-icons/ri";
import storage from "../../libs/storage";
import { logout } from "../../features/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTE_MAP } from "../../libs/constance";
import { useTranslation } from "../../hooks/useTranslation";

export const Sidebar = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  const { isOpen, isCollapsed, toggleSidebar, closeSidebar } = useSidebar();

  const handleAccessGetInside = () => {
    const url = "https://www.lacty.com.vn/vac/";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAccessERP = () => {
    const url = "http://weberp.lacty.com.vn/sampleshoe/login.php";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLogout = () => {
    storage.remove("auth");
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const getActiveLabel = () => {
    for (const [label, path] of Object.entries(ROUTE_MAP)) {
      if (location.pathname === path) return label;
    }
    return "";
  };

  const activeItem = getActiveLabel();

  const handleItemClick = (id: string, customOnClick?: () => void) => {
    if (customOnClick) {
      customOnClick();
      return;
    }
    const route = ROUTE_MAP[id];
    if (route) {
      navigate(route);
      closeSidebar();
    }
  };

  const SIDEBAR_SECTIONS: SidebarSection[] = [
    {
      title: "trangChu",
      items: [{ id: "home", label: "trangChu", icon: RiHome3Line }],
    },
    {
      title: "thongTin",
      items: [
        { id: "info", label: "thongTin", icon: TfiInfoAlt },
        { id: "salary", label: "luong", icon: PiCreditCard },
        { id: "holidays", label: "ngayNghi", icon: TbBeach },
        { id: "overtime", label: "tangCa", icon: BiSolidPieChartAlt },
      ],
    },
    {
      title: "truyCapNhanh",
      items: [
        {
          id: "register",
          label: "khaiBao",
          icon: TbSpeakerphone,
          onClick: handleAccessGetInside,
        },
        {
          id: "erp",
          label: "erpWebsite",
          icon: GiRunningShoe,
          onClick: handleAccessERP,
        },
        { id: "meeting", label: "dangKyPhongHop", icon: SiGoogleclassroom },
        { id: "news", label: "banTin", icon: IoNewspaperOutline },
        { id: "chatbot", label: "LY ChatBot", icon: RiRobot2Line },
      ],
    },
    {
      title: "Trợ giúp",
      items: [
        { id: "download", label: "taiLygChoIos", icon: FaAppStoreIos },
        { id: "change-pass", label: "doiMatKhau", icon: GrKey },
        { id: "contact", label: "lienHe", icon: RiContactsBook3Line },
        { id: "settings", label: "caiDat", icon: IoSettingsOutline },
        { id: "note", label: "soTay", icon: LuNotebookPen },
        { id: "guide", label: "huongDanSuDung", icon: GoBook },
        {
          id: "logout",
          label: "dangXuat",
          icon: AiOutlineLogout,
          onClick: handleLogout,
        },
      ],
    },
  ];

  const renderIcon = (icon: SidebarIcon) => {
    if (typeof icon === "string") {
      return (
        <img
          src={icon}
          className="w-5 h-5 min-w-5 flex items-center justify-center object-contain
                    opacity-85 transition-all duration-180 ease-[ease] shrink-0  
                    sidebar-menu-icon"
          alt=""
        />
      );
    }
    if (typeof icon === "function") {
      const Icon = icon;
      return (
        <span
          className="w-5 h-5 min-w-5 flex items-center justify-center object-contain
                    opacity-85 transition-all duration-180 ease-[ease] shrink-0  
                    sidebar-menu-icon"
        >
          <Icon size={18} />
        </span>
      );
    }
    return (
      <span
        className="w-5 h-5 min-w-5 flex items-center justify-center object-contain
                    opacity-85 transition-all duration-180 ease-[ease] shrink-0  
                    sidebar-menu-icon"
      >
        {icon}
      </span>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-29 animate-[fadeIn_0.2s_ease]"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-[280px] h-full shrink-0 flex flex-col overflow-hidden
                    [transition:width_0.28s_cubic-bezier(0.4,0,0.2,1),background_0.3s_ease,border-color_0.3s_ease]
                    sidebar 
                    ${isOpen ? "mobile-open" : ""} ${isCollapsed ? "collapsed" : ""}`}
      >
        <div className="sidebar-header">
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            <Menu size={20} />
          </button>

          <div className="sidebar-logo">
            <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center gap-0.5 shrink-0 sidebar-logo-circle">
              <QrCode size={32} />
              <Eye size={14} className="cursor-pointer" />
            </div>
            <h1 className="text-[15px] font-bold tracking-[0.5px] m-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-full sidebar-title">
              {user.fullName}
            </h1>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto overflow-x-hidden sidebar-content"
          style={{ padding: "12px 0" }}
        >
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} className="sidebar-section">
              <h2 className="sidebar-section-title">{t(section.title)}</h2>
              <ul className="sidebar-menu">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`sidebar-menu-item ${activeItem === item.id ? "active" : ""}`}
                      onClick={() => handleItemClick(item.id, item.onClick)}
                      title={item.label}
                    >
                      {renderIcon(item.icon)}
                      <span className="sidebar-menu-label">
                        {t(item.label)}
                      </span>
                      <svg
                        className="sidebar-menu-arrow"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ───── Sidebar base ───── */
        .sidebar {
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          scrollbar-width: thin;
          scrollbar-color: var(--sidebar-scrollbar) transparent;
        }

        .dark .sidebar {
          --sidebar-bg: rgba(15, 27, 48, 0.95);
          --sidebar-border: rgba(255, 255, 255, 0.08);
          --sidebar-scrollbar: rgba(147, 197, 253, 0.3);
        }

        .light .sidebar {
          --sidebar-bg: rgba(255, 255, 255, 0.97);
          --sidebar-border: rgba(0, 0, 0, 0.08);
          --sidebar-scrollbar: rgba(37, 99, 235, 0.2);
        }

        /* ───── Collapsed (desktop) ───── */
        .sidebar.collapsed {
          width: 64px;
        }

        /* ───── Sidebar Header ───── */
        .sidebar-header {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 12px 16px;
          border-bottom: 1px solid var(--sidebar-border);
          gap: 12px;
          overflow: hidden;
          transition: padding 0.28s ease;
        }

        .sidebar.collapsed .sidebar-header {
          padding: 9.5px 0;
          gap: 0;
        }

        .sidebar-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          color: var(--toggle-color);
          transition: all 0.18s ease;
          flex-shrink: 0;
          align-self: flex-start;
        }

        .sidebar.collapsed .sidebar-toggle-btn {
          align-self: center;
        }

        .dark .sidebar-toggle-btn  { --toggle-color: rgba(147,197,253,0.75); }
        .light .sidebar-toggle-btn { --toggle-color: var(--primary, #0f172a); }

        .sidebar-toggle-btn:hover {
          background: var(--toggle-hover-bg);
          color: var(--toggle-hover-color);
          border-color: var(--toggle-hover-border);
        }

        .dark .sidebar-toggle-btn:hover {
          --toggle-hover-bg: rgba(147,197,253,0.12);
          --toggle-hover-color: #93c5fd;
          --toggle-hover-border: rgba(147,197,253,0.2);
        }

        .light .sidebar-toggle-btn:hover {
          --toggle-hover-bg: rgba(37,99,235,0.08);
          --toggle-hover-color: var(--accent, #2563eb);
          --toggle-hover-border: rgba(37,99,235,0.15);
        }

        /* ───── Logo ───── */
        .sidebar-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 100%;
          overflow: hidden;
          opacity: 1;
          max-height: 120px;
          transition: opacity 0.15s ease, max-height 0.25s ease;
        }

        .sidebar.collapsed .sidebar-logo {
          opacity: 0;
          max-height: 0;
        }

        .sidebar-logo-circle {
          background: var(--logo-circle-bg);
          border: 2px solid var(--logo-circle-border);
          color: var(--logo-circle-color);
          transition: all 0.3s ease;
        }

        .dark .sidebar-logo-circle {
          --logo-circle-bg: rgba(147,197,253,0.1);
          --logo-circle-border: rgba(147,197,253,0.3);
          --logo-circle-color: #93c5fd;
        }

        .light .sidebar-logo-circle {
          --logo-circle-bg: rgba(37,99,235,0.08);
          --logo-circle-border: rgba(37,99,235,0.2);
          --logo-circle-color: #2563eb;
        }

        .sidebar-title {
          color: var(--sidebar-title-color);
          transition: color 0.3s ease;
        }

        .dark .sidebar-title  { --sidebar-title-color: rgba(255,255,255,0.9); }
        .light .sidebar-title { --sidebar-title-color: #0f2544; }

        /* ───── Section ───── */
        .sidebar-section {
          margin-bottom: 4px;
        }

        .sidebar-section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--sidebar-section-title);
          padding: 8px 16px 6px;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          opacity: 1;
          max-height: 40px;
          transition: opacity 0.15s ease, max-height 0.2s ease;
        }

        .sidebar.collapsed .sidebar-section-title {
          opacity: 0;
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
        }

        .dark .sidebar-section-title  { --sidebar-section-title: rgba(147,197,253,0.6); }
        .light .sidebar-section-title { --sidebar-section-title: rgba(37,99,235,0.7); }

        /* ───── Menu Items ───── */
        .sidebar-menu {
          list-style: none;
          margin: 0;
          padding: 0 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar.collapsed .sidebar-menu { padding: 0 6px; }

        .sidebar-menu-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px 12px;
          width: 100%;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          color: var(--sidebar-item-color);
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.18s ease;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
        }

        .sidebar.collapsed .sidebar-menu-item {
          justify-content: center;
          padding: 10px 0;
          gap: 0;
        }

        .dark .sidebar-menu-item  { --sidebar-item-color: rgba(255,255,255,0.65); }
        .light .sidebar-menu-item { --sidebar-item-color: var(--primary, #0f172a); }

        .sidebar-menu-item:hover {
          background: var(--sidebar-item-hover-bg);
          color: var(--sidebar-item-hover-color);
        }

        .dark .sidebar-menu-item:hover {
          --sidebar-item-hover-bg: rgba(147,197,253,0.1);
          --sidebar-item-hover-color: rgba(255,255,255,0.9);
        }
        .light .sidebar-menu-item:hover {
          --sidebar-item-hover-bg: rgba(37,99,235,0.09);
          --sidebar-item-hover-color: var(--primary, #0f172a);
        }

        .sidebar-menu-item.active {
          background: var(--sidebar-item-active-bg);
          color: var(--sidebar-item-active-color);
        }

        .dark .sidebar-menu-item.active {
          --sidebar-item-active-bg: rgba(147,197,253,0.15);
          --sidebar-item-active-color: #93c5fd;
        }
        .light .sidebar-menu-item.active {
          --sidebar-item-active-bg: rgba(37,99,235,0.12);
          --sidebar-item-active-color: var(--accent, #2563eb);
        }

        .sidebar-menu-icon svg { width: 20px; height: 20px; }

        .sidebar-menu-item:hover .sidebar-menu-icon { opacity: 1; transform: scale(1.05); }

        .sidebar.collapsed .sidebar-menu-icon { margin: 0 auto; min-width: 20px; }

        .sidebar.collapsed .sidebar-menu li {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .sidebar-menu-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          opacity: 1;
          transition: opacity 0.15s ease;
        }

        .sidebar.collapsed .sidebar-menu-label { opacity: 0; width: 0; flex: 0; }

        .sidebar-menu-arrow {
          flex-shrink: 0;
          width: 14px;
          height: 14px;
          opacity: 0.5;
          transition: all 0.18s ease;
          color: var(--sidebar-arrow-color);
        }

        .sidebar.collapsed .sidebar-menu-arrow { opacity: 0; width: 0; }

        .dark .sidebar-menu-arrow  { --sidebar-arrow-color: rgba(147,197,253,0.6); }
        .light .sidebar-menu-arrow { --sidebar-arrow-color: var(--accent, #2563eb); }

        .sidebar-menu-item:hover .sidebar-menu-arrow { opacity: 1; transform: translateX(2px); }
        .sidebar-menu-item.active .sidebar-menu-arrow { opacity: 0.8; }

        /* ───── Mobile ───── */
        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            width: 280px;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 35;
          }
          .sidebar.mobile-open { transform: translateX(0); }
          .sidebar.collapsed { width: 280px; transform: translateX(-100%); }
          .sidebar.collapsed.mobile-open { transform: translateX(0); }

          .sidebar.collapsed .sidebar-logo,
          .sidebar.collapsed .sidebar-menu-label,
          .sidebar.collapsed .sidebar-menu-arrow,
          .sidebar.collapsed .sidebar-section-title {
            opacity: 1; max-height: unset; width: unset; flex: unset;
          }

          .sidebar.collapsed .sidebar-menu-item {
            justify-content: flex-start;
            align-items: center;
            padding: 10px 12px;
            gap: 10px;
          }

          .sidebar.collapsed .sidebar-menu { padding: 0 8px; }
          .sidebar.collapsed .sidebar-menu li { justify-content: flex-start; }
          .sidebar.collapsed .sidebar-menu-icon { margin: 0; }
          .sidebar.collapsed .sidebar-header { padding: 12px 12px 16px; gap: 12px; }
          .sidebar.collapsed .sidebar-toggle-btn { align-self: flex-start; }
          .sidebar.collapsed .sidebar-section-title { padding: 8px 16px 6px; }
        }

        @media (max-width: 768px) { .sidebar { width: 260px; } }
        @media (max-width: 480px) { .sidebar { width: 100%; } }
      `}</style>
    </>
  );
};
