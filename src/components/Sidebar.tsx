import { useState } from 'react';

interface SidebarMenuItem {
  label: string;
  icon: string;
  onClick?: () => void;
}

interface SidebarSection {
  title: string;
  items: SidebarMenuItem[];
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'Thông tin',
    items: [
      { label: 'Thông tin', icon: '/icons/sidebar/info.svg' },
      { label: 'Lương', icon: '/icons/sidebar/wallet.svg' },
      { label: 'Ngày nghỉ', icon: '/icons/sidebar/holiday.svg' },
      { label: 'Tăng ca', icon: '/icons/sidebar/overtime.svg' },
    ],
  },
  {
    title: 'Truy cập nhanh',
    items: [
      { label: 'Khai báo vào công ty', icon: '/icons/sidebar/checkin.svg' },
      { label: 'ERP website', icon: '/icons/sidebar/link.svg' },
      { label: 'Đăng ký phòng họp', icon: '/icons/sidebar/meeting.svg' },
      { label: 'Bản tin', icon: '/icons/sidebar/news.svg' },
      { label: 'LY ChatBot', icon: '/icons/sidebar/chatbot.svg' },
    ],
  },
  {
    title: 'Trợ giúp',
    items: [
      { label: 'Tải LYG APP cho IOS', icon: '/icons/sidebar/download.svg' },
      { label: 'Đổi mật khẩu', icon: '/icons/sidebar/lock.svg' },
    ],
  },
];

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState<string>('Thông tin');

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-circle">
            <svg viewBox="0 0 100 100" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="3">
              <rect x="15" y="15" width="20" height="20" />
              <rect x="45" y="15" width="20" height="20" />
              <rect x="45" y="45" width="20" height="20" />
              <rect x="15" y="45" width="12" height="12" />
              <circle cx="50" cy="75" r="2" />
            </svg>
          </div>
          <h1 className="sidebar-title">TẤN ĐẠT</h1>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="sidebar-content">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.title} className="sidebar-section">
            <h2 className="sidebar-section-title">{section.title}</h2>
            <ul className="sidebar-menu">
              {section.items.map((item) => (
                <li key={item.label}>
                  <button
                    className={`sidebar-menu-item ${activeItem === item.label ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem(item.label);
                      item.onClick?.();
                    }}
                    aria-current={activeItem === item.label ? 'page' : undefined}
                  >
                    <img src={item.icon} alt="" className="sidebar-menu-icon" width="20" height="20" />
                    <span className="sidebar-menu-label">{item.label}</span>
                    <svg className="sidebar-menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <style>{`
        .sidebar {
          width: 280px;
          height: 100vh;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          position: sticky;
          top: 0;
          z-index: 30;
          transition: background 0.3s ease, border-color 0.3s ease;
          scrollbar-width: thin;
          scrollbar-color: var(--sidebar-scrollbar) transparent;
        }

        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: var(--sidebar-scrollbar);
          border-radius: 3px;
        }

        .dark .sidebar {
          --sidebar-bg: rgba(15, 27, 48, 0.9);
          --sidebar-border: rgba(255, 255, 255, 0.08);
          --sidebar-scrollbar: rgba(147, 197, 253, 0.3);
        }

        .light .sidebar {
          --sidebar-bg: rgba(255, 255, 255, 0.95);
          --sidebar-border: rgba(0, 0, 0, 0.08);
          --sidebar-scrollbar: rgba(37, 99, 235, 0.2);
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid var(--sidebar-section-border);
          flex-shrink: 0;
        }

        .dark .sidebar-header {
          --sidebar-section-border: rgba(255, 255, 255, 0.08);
        }

        .light .sidebar-header {
          --sidebar-section-border: rgba(0, 0, 0, 0.08);
        }

        .sidebar-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }

        .sidebar-logo-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--logo-bg);
          border: 2px solid var(--logo-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--logo-color);
          transition: all 0.3s ease;
        }

        .dark .sidebar-logo-circle {
          --logo-bg: rgba(255, 255, 255, 0.08);
          --logo-border: rgba(147, 197, 253, 0.3);
          --logo-color: rgba(147, 197, 253, 0.8);
        }

        .light .sidebar-logo-circle {
          --logo-bg: rgba(37, 99, 235, 0.1);
          --logo-border: var(--accent);
          --logo-color: var(--accent);
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--sidebar-title-color);
          letter-spacing: 1px;
          margin: 0;
        }

        .dark .sidebar-title {
          --sidebar-title-color: rgba(255, 255, 255, 0.9);
        }

        .light .sidebar-title {
          --sidebar-title-color: var(--primary);
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
        }

        .sidebar-section {
          padding: 0;
        }

        .sidebar-section + .sidebar-section {
          margin-top: 8px;
          border-top: 1px solid var(--sidebar-divider);
          padding-top: 16px;
        }

        .dark .sidebar-section {
          --sidebar-divider: rgba(255, 255, 255, 0.08);
        }

        .light .sidebar-section {
          --sidebar-divider: rgba(0, 0, 0, 0.08);
        }

        .sidebar-section-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--sidebar-section-title);
          padding: 12px 20px 8px;
          margin: 0;
        }

        .dark .sidebar-section-title {
          --sidebar-section-title: rgba(147, 197, 253, 0.6);
        }

        .light .sidebar-section-title {
          --sidebar-section-title: rgba(37, 99, 235, 0.7);
        }

        .sidebar-menu {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 8px;
        }

        .sidebar-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          width: 100%;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          color: var(--sidebar-item-color);
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
          text-align: left;
        }

        .dark .sidebar-menu-item {
          --sidebar-item-color: rgba(255, 255, 255, 0.7);
        }

        .light .sidebar-menu-item {
          --sidebar-item-color: var(--primary);
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
          --sidebar-item-hover-bg: rgba(37, 99, 235, 0.1);
          --sidebar-item-hover-color: var(--primary);
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
          --sidebar-item-active-bg: rgba(37, 99, 235, 0.15);
          --sidebar-item-active-color: var(--accent);
        }

        .sidebar-menu-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          object-fit: contain;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }

        .sidebar-menu-item:hover .sidebar-menu-icon {
          opacity: 1;
        }

        .sidebar-menu-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-menu-arrow {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          opacity: 0.6;
          transition: all 0.2s ease;
          color: var(--sidebar-arrow-color);
        }

        .dark .sidebar-menu-arrow {
          --sidebar-arrow-color: rgba(147, 197, 253, 0.6);
        }

        .light .sidebar-menu-arrow {
          --sidebar-arrow-color: var(--accent);
        }

        .sidebar-menu-item:hover .sidebar-menu-arrow {
          opacity: 1;
          transform: translateX(2px);
        }

        .sidebar-menu-item.active .sidebar-menu-arrow {
          opacity: 1;
        }

        /* Scrollbar for Firefox */
        @media (prefers-color-scheme: dark) {
          .sidebar {
            scrollbar-color: rgba(147, 197, 253, 0.3) transparent;
          }
        }

        @media (prefers-color-scheme: light) {
          .sidebar {
            scrollbar-color: rgba(37, 99, 235, 0.2) transparent;
          }
        }

        @media (max-width: 1024px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};
