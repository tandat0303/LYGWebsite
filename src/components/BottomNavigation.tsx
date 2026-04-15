import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Trang chủ',
    icon: '/icons/home.svg',
  },
  {
    id: 'salary',
    label: 'Lương',
    icon: '/icons/salary.svg',
  },
  {
    id: 'contact',
    label: 'Liên hệ',
    icon: '/icons/contact.svg',
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: '/icons/settings.svg',
  },
];

export const BottomNavigation = () => {
  const { theme } = useTheme();
  const [activeItem, setActiveItem] = useState('home');

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
          onClick={() => setActiveItem(item.id)}
          title={item.label}
        >
          <div className="nav-icon">
            <img src={item.icon} alt={item.label} width="24" height="24" />
          </div>
          <span className="nav-label">{item.label}</span>
          {activeItem === item.id && <div className="nav-indicator" />}
        </button>
      ))}

      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 30;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 12px 0 safe-area-inset-bottom;
          border-top: 1px solid var(--nav-border);
          background: var(--nav-bg);
          backdrop-filter: blur(8px);
          transition: background 0.3s ease, border-color 0.3s ease;
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
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--nav-item-color);
          transition: all 0.2s ease;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          flex: 1;
          min-height: 64px;
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

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          transition: background 0.2s ease;
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

        .nav-label {
          font-size: 11px;
          font-weight: 500;
          text-align: center;
          transition: color 0.2s ease;
          max-width: 60px;
          line-height: 1.2;
        }

        .nav-indicator {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 3px;
          border-radius: 2px 2px 0 0;
          background: #2563eb;
        }

        @media (max-width: 768px) {
          .bottom-nav {
            display: flex;
          }

          .nav-item {
            min-height: 60px;
          }
        }

        @media (min-width: 769px) {
          .bottom-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};
