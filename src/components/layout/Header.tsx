import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useSidebar } from "../../contexts/SidebarContext";
import { useAppDispatch, useAppSelector } from "../../hooks/auth";
import storage from "../../libs/storage";
import { logout } from "../../features/authSlice";
import {
  Bell,
  Menu,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  RotateCcwKey,
  X,
  Clock,
  Megaphone,
} from "lucide-react";
import { LANGS } from "../../libs/constance";
import type { Lang } from "../../types/storage";
import { useNavigate } from "react-router-dom";
import { changeLanguage } from "../../features/languageSlice";
import { useTranslation } from "../../hooks/useTranslation";
import type { Notification } from "../../types/notification";
import notificationApi from "../../api/common/notification";
import { AppAlert } from "../ui/AppAlert";
import { getApiErrorMessage, isoToDisplay, timeAgo } from "../../libs/helper";

export const Header = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const selectedLang = useAppSelector((s) => s.language.current);
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [activeNotif, setActiveNotif] = useState<Notification | null>(null);
  const [notifDropdownLeft, setNotifDropdownLeft] = useState<number | null>(
    null,
  );

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const notifBtnRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => n.isReaded !== 1).length;

  const RING_INTERVAL_SEC = 3; // chu kỳ lặp (giây)
  const RING_DURATION_MS = 1500; // thời gian rung mỗi lần (ms)

  const [bellShaking, setBellShaking] = useState(false);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setNotifLoading(true);

        const res = await notificationApi.getAllNotifications({
          factory: user.factory,
          userId: user.userId,
        });
        setNotifications(res);
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      } finally {
        setNotifLoading(false);
      }
    };

    fetchNotification();
  }, []);

  useEffect(() => {
    if (unreadCount === 0) {
      setBellShaking(false);
      return;
    }
    // Rung ngay lần đầu
    setBellShaking(true);
    const stopFirst = setTimeout(() => setBellShaking(false), RING_DURATION_MS);

    const interval = setInterval(() => {
      setBellShaking(true);
      setTimeout(() => setBellShaking(false), RING_DURATION_MS);
    }, RING_INTERVAL_SEC * 1000);

    return () => {
      clearTimeout(stopFirst);
      clearInterval(interval);
    };
  }, [unreadCount]);

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!notifDropdownRef.current?.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!activeNotif) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveNotif(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [activeNotif]);

  useEffect(() => {
    document.body.style.overflow = activeNotif ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeNotif]);

  const closeAllDropdown = () => {
    setUserDropdownOpen(false);
    setLanguageDropdownOpen(false);
    setNotifOpen(false);
  };

  const handleAccessInfo = () => {
    closeAllDropdown();
    navigate("/user-info", { replace: true });
  };

  const handleAccessChangePass = () => {
    closeAllDropdown();
    navigate("/change-password", { replace: true });
  };

  const handleLogout = () => {
    closeAllDropdown();
    storage.remove("auth");
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleSelectLang = (lang: Lang) => {
    dispatch(changeLanguage(lang));
    setLanguageDropdownOpen(false);
  };

  const handleOpenNotif = (notif: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.ID === notif.ID ? { ...n, isReaded: 1 } : n)),
    );
    setActiveNotif({ ...notif, isReaded: 1 });
    setNotifOpen(false);
  };

  useEffect(() => {
    if (!notifOpen || !notifBtnRef.current) return;
    const DROPDOWN_W = Math.min(340, window.innerWidth - 24);
    const MARGIN = 12;
    const btnRect = notifBtnRef.current.getBoundingClientRect();
    const naturalLeft = btnRect.right - DROPDOWN_W;
    const clampedLeft = Math.max(MARGIN, naturalLeft);
    setNotifDropdownLeft(clampedLeft);
  }, [notifOpen]);

  // ── Shared classes ─────────────────────────────────────────────────────────

  const iconBtnCls =
    "flex items-center justify-center w-9 h-9 rounded-[9px] " +
    "border border-transparent bg-transparent cursor-pointer relative shrink-0 " +
    "transition-all duration-[180ms] " +
    "text-slate-500/85 dark:text-slate-400/85 " +
    "hover:bg-blue-600/[0.07] hover:border-blue-600/20 hover:text-[#1d4ed8] " +
    "dark:hover:bg-white/[0.08] dark:hover:border-slate-400/20 dark:hover:text-slate-200/95";

  const dropdownMenuCls =
    "absolute top-[calc(100%+8px)] right-0 rounded-xl overflow-hidden z-[1000] border " +
    "bg-white/[0.98] border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] " +
    "dark:bg-[rgba(15,23,42,0.97)] dark:border-white/[0.09] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.04)] " +
    "animate-[slideDown_0.18s_cubic-bezier(0.16,1,0.3,1)]";

  const dropdownItemCls =
    "flex items-center gap-2.5 cursor-pointer rounded-lg " +
    "text-[13px] font-[450] transition-colors duration-[130ms] " +
    "text-slate-500/90 dark:text-slate-300/85 " +
    "hover:bg-blue-600/[0.06] dark:hover:bg-white/[0.06]";

  const dropdownDividerCls =
    "h-px my-[3px] bg-black/[0.07] dark:bg-white/[0.07]";

  return (
    <>
      <header
        className="
          sticky top-0 z-40 h-14 backdrop-blur-md shrink-0
          transition-colors duration-300
          border-b border-black/[0.07] bg-white/92
          dark:border-white/[0.07] dark:bg-[rgba(15,23,42,0.85)]
        "
        style={{ padding: "0 12px" }}
      >
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <button
              className={`${iconBtnCls} lg:hidden`}
              aria-label="Menu"
              title="Toggle sidebar"
              onClick={toggleSidebar}
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* ── Bell / Notifications ── */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                ref={notifBtnRef}
                className={`${iconBtnCls} ${notifOpen ? "bg-blue-600/[0.07] border-blue-600/20 text-[#1d4ed8] dark:bg-white/8 dark:border-slate-400/20 dark:text-slate-200/95" : ""}`}
                aria-label="Notifications"
                title="Notifications"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setUserDropdownOpen(false);
                  setLanguageDropdownOpen(false);
                }}
              >
                <span
                  className={bellShaking && !notifOpen ? "bell-ring" : ""}
                  style={{ display: "flex", transformOrigin: "top center" }}
                >
                  <Bell size={20} />
                </span>
                {unreadCount > 0 && (
                  <span
                    className="
                      flex absolute top-1 right-1 w-3.5 h-3.5 pt-0.5 rounded-full
                      bg-[#ef4444] text-white text-[9px] font-bold
                      items-center justify-center leading-none
                      border-[1.5px]
                      border-white/95 dark:border-[rgba(15,23,42,0.9)]
                    "
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && notifDropdownLeft !== null && (
                <div
                  className={`${dropdownMenuCls} fixed top-14`}
                  style={{
                    left: notifDropdownLeft,
                    width: Math.min(340, window.innerWidth - 24),
                    position: "fixed",
                  }}
                  role="menu"
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between"
                    style={{ padding: "12px 14px 10px" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-semibold text-slate-800 dark:text-slate-100">
                        {t("thongBao")}
                      </span>
                      {unreadCount > 0 && (
                        <span className="flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className={dropdownDividerCls}
                    style={{ margin: "0 0 4px" }}
                  />

                  {/* Scrollable list */}
                  <div
                    className="overflow-y-auto"
                    style={{
                      maxHeight: "320px",
                      padding: "2px 6px 6px",
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(100,116,139,0.25) transparent",
                    }}
                  >
                    {notifLoading && (
                      <span
                        className="
                          w-9 h-9 rounded-full border-[3px] border-transparent
                          border-t-[#2563eb] dark:border-t-blue-300/70
                          animate-spin
                        "
                      />
                    )}
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400/60 dark:text-slate-500/60">
                        <Bell size={28} strokeWidth={1.5} />
                        <span className="text-[12.5px]">
                          {t("chuaCoThongBao")}
                        </span>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        return (
                          <div
                            key={notif.ID}
                            className={`
                              flex items-start gap-2.5 rounded-lg cursor-pointer
                              transition-colors duration-130 group relative
                              ${
                                notif.isReaded === 1
                                  ? "hover:bg-slate-100/70 dark:hover:bg-white/5"
                                  : "hover:bg-blue-50/80 dark:hover:bg-blue-500/8"
                              }
                            `}
                            style={{ padding: "9px 10px" }}
                            onClick={() => handleOpenNotif(notif)}
                            role="menuitem"
                          >
                            {/* Kind icon */}
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-[9px] shrink-0 mt-0.5 bg-blue-500/10 dark:bg-blue-400/10 text-blue-500 dark:text-blue-400`}
                            >
                              <Megaphone size={15} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <span
                                  className={`text-[12.5px] font-semibold leading-[1.3] ${
                                    notif.isReaded === 1
                                      ? "text-slate-600/80 dark:text-slate-300/70"
                                      : "text-slate-800 dark:text-slate-100"
                                  }`}
                                >
                                  {notif.Subjects}
                                </span>
                                {notif.isReaded !== 1 && (
                                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                                )}
                              </div>
                              {/* <p
                                className={`text-[11.5px] leading-[1.4] mt-0.5 line-clamp-2 ${
                                  notif.isReaded === 1
                                    ? "text-slate-400/70 dark:text-slate-500/70"
                                    : "text-slate-500/90 dark:text-slate-400/85"
                                }`}
                              >
                                {notif.Content}
                              </p> */}
                              <div className="flex items-center gap-1 mt-1.5 text-slate-400/90 dark:text-slate-500/70">
                                <Clock size={10} />
                                <span className="text-[10.5px]">
                                  {timeAgo(notif.Modify_Date)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              className="flex items-center border-none bg-transparent cursor-pointer shrink-0"
              style={{ padding: "0 4px" }}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title="Toggle theme"
            >
              <span
                className="
                  relative w-11.5 h-6.25 rounded-full block transition-colors duration-300
                  bg-[rgba(251,191,36,0.15)] border-[1.5px] border-[rgba(251,191,36,0.45)]
                  dark:bg-[rgba(139,92,246,0.18)] dark:border-[rgba(139,92,246,0.45)]
                "
              >
                <span
                  className="
                    flex absolute top-1/2 -translate-y-1/2 w-4.75 h-4.75
                    rounded-full items-center justify-center text-white
                    [transition:left_0.28s_cubic-bezier(0.34,1.56,0.64,1),background_0.3s_ease,box-shadow_0.3s_ease]
                    left-0.5 bg-[#f59e0b] shadow-[0_2px_8px_rgba(245,158,11,0.5)]
                    dark:left-[calc(100%-21px)] dark:bg-[#7c3aed] dark:shadow-[0_2px_8px_rgba(124,58,237,0.55)]
                  "
                >
                  {theme === "dark" ? (
                    <Moon size={13} strokeWidth={2.5} />
                  ) : (
                    <Sun size={13} strokeWidth={2.5} />
                  )}
                </span>
              </span>
            </button>

            {/* Divider */}
            <div
              className="w-px h-5.5 shrink-0 hidden md:block bg-black/10 dark:bg-white/10"
              style={{ margin: "0 4px" }}
            />

            {/* ── Language picker ── */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                className="
                  flex items-center gap-2 min-h-9 rounded-full
                  border border-transparent bg-transparent cursor-pointer
                  transition-all duration-180
                  text-slate-500/90 dark:text-slate-300/90
                  hover:bg-blue-600/6 hover:border-blue-600/20
                  dark:hover:bg-white/[0.07] dark:hover:border-slate-400/20
                  max-md:w-11 max-md:h-11 max-md:justify-center max-md:rounded-full
                "
                style={{ padding: "4px 10px" }}
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={languageDropdownOpen}
              >
                <img
                  src={selectedLang.flag}
                  alt={selectedLang.label}
                  className="w-5.5 h-5.5 rounded-full object-cover shrink-0 border dark:border-white/20"
                />
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-[450] hidden md:block">
                  {t(selectedLang.label)}
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 opacity-50 shrink-0 hidden md:block
                    ${languageDropdownOpen ? "rotate-180 opacity-80" : ""}`}
                />
              </button>

              {languageDropdownOpen && (
                <div
                  className={`${dropdownMenuCls} w-max`}
                  style={{ padding: "6px" }}
                  role="menu"
                >
                  {LANGS.map((lang) => {
                    const isActive = selectedLang.code === lang.code;
                    return (
                      <div
                        key={lang.code}
                        className={`
                          ${dropdownItemCls}
                          ${
                            isActive
                              ? "bg-blue-500/15! text-blue-600! dark:bg-blue-500/15! dark:text-blue-300/95!"
                              : ""
                          }
                        `}
                        style={{ padding: "9px 13px" }}
                        role="menuitem"
                        onClick={() => handleSelectLang(lang)}
                      >
                        <img
                          src={lang.flag}
                          alt={lang.label}
                          className="w-5.5 h-5.5 rounded-full object-cover shrink-0 border dark:border-white/20"
                        />
                        <span className="whitespace-nowrap hidden md:block text-[13px] font-medium">
                          {t(lang.label)}
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full opacity-70 shrink-0 hidden md:block bg-current" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Divider */}
            <div
              className="w-px h-5.5 shrink-0 hidden md:block bg-black/10 dark:bg-white/10"
              style={{ margin: "0 4px" }}
            />

            {/* ── User menu ── */}
            <div className="relative" ref={userDropdownRef}>
              <button
                className="
                  flex items-center gap-1.75 rounded-full cursor-pointer
                  transition-all duration-200
                  border
                  border-blue-600/22 bg-blue-600/7 text-blue-700/90
                  dark:border-blue-500/[0.28] dark:bg-blue-500/12 dark:text-blue-300/95
                  hover:bg-blue-600/12 hover:border-blue-600/38 hover:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]
                  dark:hover:bg-blue-500/20 dark:hover:border-blue-500/45 dark:hover:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                "
                style={{ padding: "5px 12px 5px 6px" }}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={userDropdownOpen}
              >
                <div
                  className="
                    w-6.5 h-6.5 rounded-full shrink-0
                    bg-linear-to-br from-[#3b82f6] to-[#1d4ed8]
                    text-white flex items-center justify-center text-[11px] font-bold
                    shadow-[0_1px_4px_rgba(59,130,246,0.4)]
                  "
                >
                  <User size={15} />
                </div>
                <div className="flex-col items-start gap-px hidden md:flex">
                  <span className="text-[13px] font-semibold whitespace-nowrap leading-[1.2] text-inherit">
                    {user.fullName}
                  </span>
                  <span className="text-[11px] opacity-65 whitespace-nowrap leading-[1.2] text-inherit">
                    {user.factory}
                  </span>
                </div>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 opacity-50 shrink-0
                    ${userDropdownOpen ? "rotate-180 opacity-80" : ""}`}
                />
              </button>

              {userDropdownOpen && (
                <div className={`${dropdownMenuCls} min-w-50`} role="menu">
                  {/* User info header */}
                  <div
                    className="flex items-center gap-2.5"
                    style={{ padding: "12px 13px" }}
                  >
                    <div
                      className="
                        w-8.5 h-8.5 rounded-[9px] shrink-0
                        bg-linear-to-br from-[#3b82f6] to-[#1d4ed8]
                        text-white flex items-center justify-center text-xs font-bold
                        shadow-[0_2px_8px_rgba(59,130,246,0.3)]
                      "
                    >
                      <User size={15} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-800/95 dark:text-slate-200/95">
                        {user.fullName}
                      </div>
                      <div className="text-[11.5px] mt-0.5 text-slate-400/70 dark:text-slate-400/60">
                        {user.nameshow}
                      </div>
                    </div>
                  </div>

                  <div className={dropdownDividerCls} />

                  <div
                    className={dropdownItemCls}
                    style={{ padding: "9px 13px" }}
                    role="menuitem"
                    onClick={handleAccessInfo}
                  >
                    <User size={16} />
                    {t("thongTinCaNhan")}
                  </div>

                  <div
                    className={dropdownItemCls}
                    style={{ padding: "9px 13px" }}
                    role="menuitem"
                    onClick={handleAccessChangePass}
                  >
                    <RotateCcwKey size={16} />
                    {t("doiMatKhau")}
                  </div>

                  <div className={dropdownDividerCls} />

                  <div
                    className="
                      flex items-center gap-2.5 cursor-pointer rounded-lg
                      text-[13px] font-[450] transition-colors duration-130
                      text-[#f87171] hover:bg-red-500/10
                    "
                    style={{ padding: "9px 13px" }}
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LogOut size={14} />
                    {t("dangXuat")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {activeNotif && (
        <div
          className="
            fixed inset-0 z-9999 flex items-center justify-center
            bg-black/40 dark:bg-black/60 backdrop-blur-sm
            animate-[fadeIn_0.18s_ease]
          "
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveNotif(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Chi tiết thông báo"
        >
          <div
            className="
              relative w-full mx-4 rounded-2xl overflow-hidden
              bg-white dark:bg-[rgba(15,23,42,0.98)]
              border border-black/[0.07] dark:border-white/9
              shadow-[0_24px_80px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.08)]
              dark:shadow-[0_32px_100px_rgba(0,0,0,0.6)]
              animate-[modalIn_0.22s_cubic-bezier(0.16,1,0.3,1)]
            "
            style={{ maxWidth: "460px" }}
          >
            {/* Colored top accent bar */}
            <div className="h-1 w-full bg-linear-to-r from-blue-400 to-indigo-400" />

            {/* Modal header */}
            <div
              className="flex items-start gap-3"
              style={{ padding: "18px 18px 14px" }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-[11px] shrink-0
                        bg-blue-500/10 dark:bg-blue-400/10 text-blue-500 dark:text-blue-400"
              >
                <Megaphone size={19} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold leading-[1.3] text-slate-800 dark:text-slate-100">
                  {activeNotif.Subjects}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-slate-400/90 dark:text-slate-500/70">
                  <Clock size={11} />
                  <span className="text-[11px]">
                    {isoToDisplay(activeNotif.Modify_Date)}
                  </span>
                </div>
              </div>

              <button
                className="
                  flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5
                  text-slate-400/70 dark:text-slate-500/70
                  hover:bg-slate-100 dark:hover:bg-white/[0.07]
                  hover:text-slate-600 dark:hover:text-slate-300
                  transition-colors duration-150 cursor-pointer
                "
                onClick={() => setActiveNotif(null)}
                aria-label="Đóng"
              >
                <X size={15} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-black/6 dark:bg-white/[0.07] mx-4.5" />

            {/* Body */}
            <div style={{ padding: "16px 18px 20px" }}>
              <p className="text-[13.5px] leading-[1.65] text-slate-600/90 dark:text-slate-300/80">
                {activeNotif.Content}
              </p>
            </div>

            {/* Footer */}
            <div
              className="flex justify-end gap-2 border-t border-black/5 dark:border-white/6"
              style={{ padding: "12px 18px" }}
            >
              <button
                className="
                  px-4 py-2 rounded-lg text-[13px] font-medium cursor-pointer
                  text-slate-500/90 dark:text-slate-400/90
                  bg-slate-100/80 dark:bg-white/6
                  hover:bg-slate-200/70 dark:hover:bg-white/10
                  border border-transparent hover:border-slate-200 dark:hover:border-white/10
                  transition-all duration-150
                "
                onClick={() => setActiveNotif(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes bellRing {
          0%   { transform: rotate(0deg);    }
          6%   { transform: rotate(18deg);   }
          14%  { transform: rotate(-16deg);  }
          22%  { transform: rotate(14deg);   }
          30%  { transform: rotate(-12deg);  }
          38%  { transform: rotate(10deg);   }
          46%  { transform: rotate(-8deg);   }
          54%  { transform: rotate(6deg);    }
          62%  { transform: rotate(-4deg);   }
          70%  { transform: rotate(2deg);    }
          78%  { transform: rotate(-1deg);   }
          85%  { transform: rotate(0.5deg);  }
          100% { transform: rotate(0deg);    }
        }
        .bell-ring {
          animation: bellRing 1.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
          transform-origin: top center;
        }
      `}</style>
    </>
  );
};
