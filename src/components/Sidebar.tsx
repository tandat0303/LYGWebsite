import { useState } from "react";
import { useSidebar } from "../contexts/SidebarContext";
import { Eye, QrCode, Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/auth";
import type { SidebarIcon, SidebarSection } from "../types/sidebar";
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
import { LuNotebookPen } from "react-icons/lu";
import { FaNfcDirectional } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import { PiCreditCard } from "react-icons/pi";
import { RiContactsBook3Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import storage from "../libs/storage";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState<string>("");
  const { isOpen, isCollapsed, toggleSidebar, closeSidebar } = useSidebar();

  const handleLogout = () => {
    storage.remove("auth");
    dispatch(logout());
    navigate("/login");
  };

  const SIDEBAR_SECTIONS: SidebarSection[] = [
    {
      title: "Thông tin",
      items: [
        { label: "Thông tin", icon: TfiInfoAlt },
        { label: "Lương", icon: PiCreditCard },
        { label: "Ngày nghỉ", icon: TbBeach },
        { label: "Tăng ca", icon: BiSolidPieChartAlt },
      ],
    },
    {
      title: "Truy cập nhanh",
      items: [
        { label: "Khai báo vào công ty", icon: TbSpeakerphone },
        { label: "ERP Website", icon: GiRunningShoe },
        { label: "Đăng ký phòng họp", icon: SiGoogleclassroom },
        { label: "Bản tin", icon: IoNewspaperOutline },
        { label: "LY ChatBot", icon: RiRobot2Line },
      ],
    },
    {
      title: "Trợ giúp",
      items: [
        { label: "Tải LYG APP cho IOS", icon: FaAppStoreIos },
        { label: "Đổi mật khẩu", icon: GrKey },
        { label: "Liên hệ", icon: RiContactsBook3Line },
        { label: "Cài đặt", icon: IoSettingsOutline },
        { label: "Sổ tay/Quy trình", icon: LuNotebookPen },
        { label: "Hướng dẫn sử dụng", icon: FaNfcDirectional },
        { label: "Đăng xuất", icon: AiOutlineLogout, onClick: handleLogout },
      ],
    },
  ];

  const renderIcon = (icon: SidebarIcon) => {
    if (typeof icon === "string") {
      return <img src={icon} className="sidebar-menu-icon" alt="" />;
    }
    if (typeof icon === "function") {
      const Icon = icon;
      return (
        <span className="sidebar-menu-icon">
          <Icon size={18} />
        </span>
      );
    }
    return <span className="sidebar-menu-icon">{icon}</span>;
  };

  return (
    <>
      {/* Overlay — mobile only */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isOpen ? "mobile-open" : ""} ${isCollapsed ? "collapsed" : ""}`}
      >
        {/* ── Sidebar Header ── */}
        <div className="sidebar-header">
          {/* Nút hamburger nằm trong sidebar, góc trên */}
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            <Menu size={20} />
          </button>

          {/* Logo + tên người dùng — ẩn khi collapsed */}
          <div className="sidebar-logo">
            <div className="sidebar-logo-circle">
              <QrCode size={32} />
              <Eye size={14} className="cursor-pointer" />
            </div>
            <h1 className="sidebar-title">{user.fullName}</h1>
          </div>
        </div>

        {/* ── Menu ── */}
        <div className="sidebar-content">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} className="sidebar-section">
              <h2 className="sidebar-section-title">{section.title}</h2>
              <ul className="sidebar-menu">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <button
                      className={`sidebar-menu-item ${activeItem === item.label ? "active" : ""}`}
                      onClick={() => {
                        setActiveItem(item.label);
                        item.onClick?.();
                      }}
                      title={item.label}
                    >
                      {renderIcon(item.icon)}
                      <span className="sidebar-menu-label">{item.label}</span>
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
        /* ───── Overlay ───── */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 29;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ───── Sidebar base ───── */
        .sidebar {
          width: 280px;
          height: 100%;           /* fill home-layout height = 100vh */
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          overflow: hidden;
          transition:
            width 0.28s cubic-bezier(0.4, 0, 0.2, 1),
            background 0.3s ease,
            border-color 0.3s ease;
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

        /* Nút toggle hamburger — luôn hiện */
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

        /* Khi collapsed: căn giữa */
        .sidebar.collapsed .sidebar-toggle-btn {
          align-self: center;
        }

        .dark .sidebar-toggle-btn {
          --toggle-color: rgba(148, 163, 184, 0.85);
        }

        .light .sidebar-toggle-btn {
          --toggle-color: rgba(71, 85, 105, 0.85);
        }

        .sidebar-toggle-btn:hover {
          background: var(--toggle-hover-bg);
          border-color: var(--toggle-hover-border);
          color: var(--toggle-hover-color);
        }

        .dark .sidebar-toggle-btn:hover {
          --toggle-hover-bg: rgba(255, 255, 255, 0.08);
          --toggle-hover-border: rgba(148, 163, 184, 0.2);
          --toggle-hover-color: rgba(226, 232, 240, 0.95);
        }

        .light .sidebar-toggle-btn:hover {
          --toggle-hover-bg: rgba(37, 99, 235, 0.07);
          --toggle-hover-border: rgba(37, 99, 235, 0.2);
          --toggle-hover-color: #1d4ed8;
        }

        /* Logo block */
        .sidebar-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
          width: 100%;
          overflow: hidden;
          /* ẩn mượt khi collapsed */
          max-height: 200px;
          opacity: 1;
          transition: max-height 0.28s ease, opacity 0.2s ease;
        }

        .sidebar.collapsed .sidebar-logo {
          max-height: 0;
          opacity: 0;
          pointer-events: none;
        }

        .sidebar-logo-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--logo-bg);
          border: 2px solid var(--logo-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          color: var(--logo-color);
          flex-shrink: 0;
        }

        .dark .sidebar-logo-circle {
          --logo-bg: rgba(255, 255, 255, 0.08);
          --logo-border: rgba(147, 197, 253, 0.3);
          --logo-color: rgba(147, 197, 253, 0.8);
        }

        .light .sidebar-logo-circle {
          --logo-bg: rgba(37, 99, 235, 0.1);
          --logo-border: var(--accent, #2563eb);
          --logo-color: var(--accent, #2563eb);
        }

        .sidebar-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--sidebar-title-color);
          letter-spacing: 0.5px;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .dark .sidebar-title {
          --sidebar-title-color: rgba(255, 255, 255, 0.9);
        }

        .light .sidebar-title {
          --sidebar-title-color: var(--primary, #0f172a);
        }

        /* ───── Sidebar Content ───── */
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px 0;
        }

        .sidebar-content::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-content::-webkit-scrollbar-thumb {
          background: var(--sidebar-scrollbar);
          border-radius: 2px;
        }

        .sidebar-section + .sidebar-section {
          margin-top: 8px;
          border-top: 1px solid var(--sidebar-divider);
          padding-top: 12px;
        }

        .dark .sidebar-section {
          --sidebar-divider: rgba(255, 255, 255, 0.08);
        }

        .light .sidebar-section {
          --sidebar-divider: rgba(0, 0, 0, 0.08);
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
          /* ẩn khi collapsed */
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

        .dark .sidebar-section-title {
          --sidebar-section-title: rgba(147, 197, 253, 0.6);
        }

        .light .sidebar-section-title {
          --sidebar-section-title: rgba(37, 99, 235, 0.7);
        }

        /* ───── Menu Items ───── */
        .sidebar-menu {
          list-style: none;
          margin: 0;
          padding: 0 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar.collapsed .sidebar-menu {
          padding: 0 6px;
        }

        .sidebar-menu-item {
          display: flex;
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  width: 100%;
  gap: 0;             
}

        .dark .sidebar-menu-item {
          --sidebar-item-color: rgba(255, 255, 255, 0.65);
        }

        .light .sidebar-menu-item {
          --sidebar-item-color: var(--primary, #0f172a);
        }

        .sidebar-menu-item:hover {
          background: var(--sidebar-item-hover-bg);
          color: var(--sidebar-item-hover-color);
        }

        .dark .sidebar-menu-item:hover {
          --sidebar-item-hover-bg: rgba(147, 197, 253, 0.1);
          --sidebar-item-hover-color: rgba(255, 255, 255, 0.9);
        }

        .light .sidebar-menu-item:hover {
          --sidebar-item-hover-bg: rgba(37, 99, 235, 0.09);
          --sidebar-item-hover-color: var(--primary, #0f172a);
        }

        .sidebar-menu-item.active {
          background: var(--sidebar-item-active-bg);
          color: var(--sidebar-item-active-color);
        }

        .dark .sidebar-menu-item.active {
          --sidebar-item-active-bg: rgba(147, 197, 253, 0.15);
          --sidebar-item-active-color: #93c5fd;
        }

        .light .sidebar-menu-item.active {
          --sidebar-item-active-bg: rgba(37, 99, 235, 0.12);
          --sidebar-item-active-color: var(--accent, #2563eb);
        }

        .sidebar-menu-icon {
          width: 20px;
          height: 20px;
          min-width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          object-fit: contain;
          opacity: 0.85;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }

        .sidebar-menu-icon svg {
          width: 20px;
          height: 20px;
        }

        .sidebar-menu-item:hover .sidebar-menu-icon {
          opacity: 1;
          transform: scale(1.05);
        }

        .sidebar.collapsed .sidebar-menu-icon {
          margin: 0 auto;
          min-width: 20px;
        }

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

        .sidebar.collapsed .sidebar-menu-label {
          opacity: 0;
          width: 0;
          flex: 0;
        }

        .sidebar-menu-arrow {
          flex-shrink: 0;
          width: 14px;
          height: 14px;
          opacity: 0.5;
          transition: all 0.18s ease;
          color: var(--sidebar-arrow-color);
        }

        .sidebar.collapsed .sidebar-menu-arrow {
          opacity: 0;
          width: 0;
        }

        .dark .sidebar-menu-arrow { --sidebar-arrow-color: rgba(147, 197, 253, 0.6); }
        .light .sidebar-menu-arrow { --sidebar-arrow-color: var(--accent, #2563eb); }

        .sidebar-menu-item:hover .sidebar-menu-arrow {
          opacity: 1;
          transform: translateX(2px);
        }

        .sidebar-menu-item.active .sidebar-menu-arrow {
          opacity: 0.8;
        }

        /* ───── Mobile ───── */
        @media (max-width: 1024px) {
          .sidebar {
            /* Trên mobile: thoát khỏi flow, dùng fixed overlay */
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 280px;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 35;
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          /* Mobile: không dùng collapsed state */
          .sidebar.collapsed {
            width: 280px;
            transform: translateX(-100%);
          }

          .sidebar.collapsed.mobile-open {
            transform: translateX(0);
          }

          .sidebar.collapsed .sidebar-logo,
          .sidebar.collapsed .sidebar-menu-label,
          .sidebar.collapsed .sidebar-menu-arrow,
          .sidebar.collapsed .sidebar-section-title {
            opacity: 1;
            max-height: unset;
            width: unset;
            flex: unset;
          }

          .sidebar.collapsed .sidebar-menu-item {
            justify-content: flex-start;
            padding: 10px 12px;
          }

          .sidebar.collapsed .sidebar-header {
            padding: 12px 12px 16px;
            gap: 12px;
          }

          .sidebar.collapsed .sidebar-toggle-btn {
            align-self: flex-start;
          }

          .sidebar.collapsed .sidebar-section-title {
            padding: 8px 16px 6px;
          }
        }

        @media (max-width: 768px) {
          .sidebar { width: 260px; }
        }

        @media (max-width: 480px) {
          .sidebar { width: 100%; }
        }
      `}</style>
    </>
  );
};
