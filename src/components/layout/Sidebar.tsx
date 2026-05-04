import { useSidebar } from "../../contexts/SidebarContext";
import { Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/auth";
import type { SidebarIcon, SidebarSection } from "../../types/sidebar";
import { TfiInfoAlt } from "react-icons/tfi";
import { TbBeach } from "react-icons/tb";
import { BiSolidPieChartAlt } from "react-icons/bi";
import { TbSpeakerphone } from "react-icons/tb";
import { GiRunningShoe } from "react-icons/gi";
import { SiGoogleclassroom } from "react-icons/si";
import { IoNewspaperOutline } from "react-icons/io5";
// import { RiRobot2Line } from "react-icons/ri";
import { FaAppStoreIos } from "react-icons/fa";
import { GrKey } from "react-icons/gr";
import { GoBook } from "react-icons/go";
import { LuNotebookPen } from "react-icons/lu";
import { AiOutlineLogout } from "react-icons/ai";
import { PiCreditCard } from "react-icons/pi";
import {
  RiContactsBook3Line,
  RiMenuFold2Line,
  RiMenuFoldLine,
} from "react-icons/ri";
// import { IoSettingsOutline } from "react-icons/io5";
import { RiHome3Line } from "react-icons/ri";
import storage from "../../libs/storage";
import { logout } from "../../features/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTE_MAP } from "../../libs/constance";
import { useTranslation } from "../../hooks/useTranslation";
import { Image } from "antd";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export const Sidebar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, isCollapsed, toggleSidebar, closeSidebar } = useSidebar();

  const [qrVisible, setQrVisible] = useState(false);

  const handleAccessGetInside = () =>
    window.open(
      "https://www.lacty.com.vn/vac/",
      "_blank",
      "noopener,noreferrer",
    );

  const handleAccessERP = () =>
    window.open(
      "http://weberp.lacty.com.vn/sampleshoe/login.php",
      "_blank",
      "noopener,noreferrer",
    );

  const handleAccessBooking = () =>
    window.open(
      "http://erp.lacty.com.vn:8000/bmr/#/",
      "_blank",
      "noopener,noreferrer",
    );

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
          label: { key: "khaiBao", fallbackKey: "khaiBaoVaoCongTy" },
          icon: TbSpeakerphone,
          onClick: handleAccessGetInside,
        },
        {
          id: "erp",
          label: "erpWebsite",
          icon: GiRunningShoe,
          onClick: handleAccessERP,
        },
        {
          id: "meeting",
          label: "dangKyPhongHop",
          icon: SiGoogleclassroom,
          onClick: handleAccessBooking,
        },
        { id: "news", label: "banTin", icon: IoNewspaperOutline },
        // { id: "chatbot", label: "LY ChatBot", icon: RiRobot2Line },
      ],
    },
    {
      title: "troGiup",
      items: [
        { id: "download", label: "taiLygChoIos", icon: FaAppStoreIos },
        { id: "change-pass", label: "doiMatKhau", icon: GrKey },
        { id: "contact", label: "lienHe", icon: RiContactsBook3Line },
        // { id: "settings", label: "caiDat", icon: IoSettingsOutline },
        { id: "note", label: "soTay / quyTrinhChinhSach", icon: LuNotebookPen },
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
    const cls =
      "w-5 h-5 min-w-[20px] flex items-center justify-center shrink-0 " +
      "opacity-85 transition-all duration-[180ms] group-hover:opacity-100 group-hover:scale-105";
    if (typeof icon === "string")
      return <img src={icon} className={`${cls} object-contain`} alt="" />;
    if (typeof icon === "function") {
      const Icon = icon;
      return (
        <span className={cls}>
          <Icon size={18} />
        </span>
      );
    }
    return <span className={cls}>{icon}</span>;
  };

  return (
    <>
      <div
        className={`
          fixed inset-0 bg-black/50 z-29 lg:hidden
          transition-[opacity,visibility] duration-300
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${isCollapsed ? "is-collapsed" : ""} ${isOpen ? "is-open" : ""}`}
      >
        {/* ── Header ── */}
        <div className="sb-header">
          <button
            className="
              sb-toggle flex items-center justify-center w-9 h-9 rounded-[9px]
              border border-transparent bg-transparent cursor-pointer shrink-0
              text-slate-800/90 dark:text-blue-300/75
              hover:bg-blue-600/8 hover:border-blue-600/15 hover:text-[#2563eb]
              dark:hover:bg-blue-300/12 dark:hover:border-blue-300/20 dark:hover:text-[#93c5fd]
            "
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {isCollapsed ? (
              <RiMenuFold2Line size={20} />
            ) : (
              <RiMenuFoldLine size={20} />
            )}
          </button>

          <div className="sb-logo">
            <div
              className="
                w-16 h-16 rounded-full flex flex-col items-center justify-center gap-0.5 shrink-0
                border-2 transition-colors duration-300
                bg-blue-600/8 border-blue-600/20 text-[#2563eb]
                dark:bg-blue-300/10 dark:border-blue-300/30 dark:text-[#93c5fd]
              "
            >
              <Image
                style={{ display: "none" }}
                preview={{
                  open: qrVisible,
                  onOpenChange: (v) => setQrVisible(v),
                  imageRender: () => (
                    <div className="flex flex-col items-center gap-4">
                      <QRCodeSVG
                        value={user?.userId || "N/A"}
                        size={280}
                        bgColor="#ffffff"
                        fgColor="#0f2544"
                        style={{
                          borderRadius: 12,
                          padding: 16,
                          background: "#fff",
                        }}
                      />
                      {user?.fullName && (
                        <p className="text-white text-[15px] font-semibold m-0 tracking-[0.3px]">
                          {user.fullName}
                        </p>
                      )}
                    </div>
                  ),
                  actionsRender: () => null,
                }}
              />
              <div
                role="button"
                tabIndex={0}
                style={{ cursor: "zoom-in" }}
                onClick={() => setQrVisible(true)}
                onKeyDown={(e) => e.key === "Enter" && setQrVisible(true)}
              >
                <QRCodeSVG
                  value={user?.userId || "N/A"}
                  size={30}
                  bgColor="transparent"
                  fgColor="currentColor"
                  className="block transition-colors duration-300 text-slate-700 dark:text-white/90 w-full max-w-40 h-auto max-[900px]:max-w-[100px] max-[600px]:max-w-[130px]"
                />
              </div>
              <Eye
                size={14}
                className="cursor-pointer"
                onClick={() => setQrVisible(true)}
              />
            </div>
            <h1
              className="
                text-[15px] font-bold tracking-[0.5px] m-0
                whitespace-nowrap overflow-hidden text-ellipsis max-w-full
                text-[#0f2544] dark:text-white/90 transition-colors duration-300
              "
            >
              {user.fullName}
            </h1>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden px-0 py-3"
          // style={{ padding: "12px 0" }}
        >
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} className="mb-1">
              <h2 className="sb-section-title text-[11px] font-bold uppercase tracking-[1px] m-0 whitespace-nowrap overflow-hidden text-blue-700/70 dark:text-blue-300/60 transition-colors duration-300">
                {t(section.title)}
              </h2>

              <ul className="sb-menu list-none m-0 flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = activeItem === item.id;
                  return (
                    <li key={item.id} className="flex">
                      <button
                        className={`
                          group sb-item flex items-center w-full border-none rounded-lg cursor-pointer
                          text-[14px] font-medium font-['DM_Sans',sans-serif]
                          transition-[background,color] duration-180
                          text-left whitespace-nowrap overflow-hidden
                          ${
                            isActive
                              ? "bg-blue-600/12 text-[#2563eb] dark:bg-blue-300/15 dark:text-[#93c5fd]"
                              : "bg-transparent text-slate-800/90 dark:text-white/65 hover:bg-blue-600/7 hover:text-slate-900 dark:hover:bg-blue-300/10 dark:hover:text-white/90"
                          }
                        `}
                        onClick={() => handleItemClick(item.id, item.onClick)}
                        // title={item.label}
                      >
                        {renderIcon(item.icon)}
                        <span className="sb-label flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                          {t(item.label)}
                        </span>
                        {/* <svg
                          className={`
                            sb-arrow shrink-0 w-[14px] h-[14px]
                            transition-[opacity,transform,max-width] duration-[180ms]
                            group-hover:translate-x-0.5
                            ${
                              isActive
                                ? "opacity-80 text-[#2563eb] dark:text-[#93c5fd]"
                                : "opacity-40 text-blue-700/60 dark:text-blue-300/60 group-hover:opacity-80"
                            }
                          `}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg> */}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ─── Base ─── */
        .sidebar {
          width: 280px;
          height: 100%;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          overflow: hidden;
          background: rgba(255,255,255,0.97);
          border-right: 1px solid rgba(0,0,0,0.08);
          scrollbar-width: thin;
          scrollbar-color: rgba(37,99,235,0.2) transparent;
          transition:
            width        0.32s cubic-bezier(0.4,0,0.2,1),
            background   0.3s  ease,
            border-color 0.3s  ease;
        }
        .dark .sidebar {
          background: rgba(15,27,48,0.95);
          border-color: rgba(255,255,255,0.08);
          scrollbar-color: rgba(147,197,253,0.3) transparent;
        }

        /* ─── Header ─── */
        .sb-header {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          overflow: hidden;
          padding: 12px 12px 16px;
          gap: 12px;
          transition:
            padding      0.32s cubic-bezier(0.4,0,0.2,1),
            gap          0.32s cubic-bezier(0.4,0,0.2,1),
            border-color 0.3s  ease;
        }
        .dark .sb-header { border-color: rgba(255,255,255,0.08); }

        /* Toggle button — self-alignment transitions too */
        .sb-toggle {
          align-self: flex-start;
          transition:
            align-self   0.32s cubic-bezier(0.4,0,0.2,1),
            background   0.18s ease,
            border-color 0.18s ease,
            color        0.18s ease;
        }

        /* Logo block */
        .sb-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 100%;
          overflow: hidden;
          opacity: 1;
          max-height: 160px;
          transition:
            opacity    0.22s ease,
            max-height 0.32s cubic-bezier(0.4,0,0.2,1);
        }

        /* Section title */
        .sb-section-title {
          padding: 8px 16px 6px;
          opacity: 1;
          max-height: 40px;
          transition:
            opacity    0.18s ease,
            max-height 0.28s cubic-bezier(0.4,0,0.2,1),
            padding    0.28s cubic-bezier(0.4,0,0.2,1);
        }

        /* Menu list */
        .sb-menu {
          padding: 0 8px;
          transition: padding 0.32s cubic-bezier(0.4,0,0.2,1);
        }

        /* Menu item */
        .sb-item {
          gap: 10px;
          padding: 10px 12px;
          transition:
            gap        0.32s cubic-bezier(0.4,0,0.2,1),
            padding    0.32s cubic-bezier(0.4,0,0.2,1),
            background 0.18s ease,
            color      0.18s ease;
        }

        /* Label */
        .sb-label {
          opacity: 1;
          max-width: 200px;
          transition:
            opacity   0.18s ease,
            max-width 0.32s cubic-bezier(0.4,0,0.2,1);
        }

        /* Arrow */
        .sb-arrow {
          max-width: 14px;
          overflow: hidden;
          transition:
            opacity   0.18s ease,
            max-width 0.28s cubic-bezier(0.4,0,0.2,1),
            transform 0.18s ease;
        }

        /* ════════════════════════
           COLLAPSED  (desktop only)
        ════════════════════════ */
        .sidebar.is-collapsed                    { width: 64px; }
        .sidebar.is-collapsed .sb-header        { padding: 10px 0 9px; gap: 0; }
        .sidebar.is-collapsed .sb-toggle        { align-self: center; }
        .sidebar.is-collapsed .sb-logo          { opacity: 0; max-height: 0; }
        .sidebar.is-collapsed .sb-section-title { opacity: 0; max-height: 0; padding: 0 16px; }
        .sidebar.is-collapsed .sb-menu          { padding: 0 6px; }
        .sidebar.is-collapsed .sb-item          { gap: 0; padding: 10px 0; justify-content: center; }
        .sidebar.is-collapsed .sb-label         { opacity: 0; max-width: 0; }
        .sidebar.is-collapsed .sb-arrow         { opacity: 0; max-width: 0; }

        /* ════════════════════════
           MOBILE  (≤ 1024px)
        ════════════════════════ */
        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            width: 280px;
            z-index: 35;
            /* slide instead of width collapse on mobile */
            transform: translateX(-100%);
            transition:
              transform    0.3s cubic-bezier(0.4,0,0.2,1),
              background   0.3s ease,
              border-color 0.3s ease;
          }
          .sidebar.is-open { transform: translateX(0); }

          /* collapsed on mobile = still full-width, just off-screen */
          .sidebar.is-collapsed { width: 280px; transform: translateX(-100%); }
          .sidebar.is-collapsed.is-open { transform: translateX(0); }

          /* restore all collapsed overrides so the mobile drawer looks normal */
          .sidebar.is-collapsed .sb-header        { padding: 12px 12px 16px; gap: 12px; }
          .sidebar.is-collapsed .sb-toggle        { align-self: flex-start; }
          .sidebar.is-collapsed .sb-logo          { opacity: 1; max-height: 160px; }
          .sidebar.is-collapsed .sb-section-title { opacity: 1; max-height: 40px; padding: 8px 16px 6px; }
          .sidebar.is-collapsed .sb-menu          { padding: 0 8px; }
          .sidebar.is-collapsed .sb-item          { gap: 10px; padding: 10px 12px; justify-content: flex-start; }
          .sidebar.is-collapsed .sb-label         { opacity: 1; max-width: 200px; }
          .sidebar.is-collapsed .sb-arrow         { opacity: 0.4; max-width: 14px; }
        }

        @media (max-width: 768px) {
          .sidebar, .sidebar.is-collapsed { width: 260px; }
        }
        @media (max-width: 480px) {
          .sidebar, .sidebar.is-collapsed { width: 100%; }
        }
      `}</style>
    </>
  );
};
