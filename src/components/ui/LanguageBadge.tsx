import { useState, useRef, useEffect } from "react";
import type { Lang } from "../../types/storage";
import { LANGS } from "../../libs/constance";

export const LanguageBadge = () => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(LANGS[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="lp-lang" ref={ref}>
      {/* ── Trigger pill ── */}
      <button
        className={`lp-lang__trigger${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="lp-lang__flag-wrap">
          <img src={lang.flag} alt={lang.label} className="lp-lang__flag" />
        </span>
        <span className="lp-lang__label">{lang.label}</span>
        <span className="lp-lang__chevron" aria-hidden>
          <svg
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: 12, height: 12 }}
          >
            <path
              d="M3 5L7 9L11 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="lp-lang__dropdown" role="listbox">
          <div className="lp-lang__section-title">Language</div>

          {LANGS.map((l) => {
            const active = l.code === lang.code;
            return (
              <div
                key={l.code}
                role="option"
                aria-selected={active}
                className={`lp-lang__option${active ? " is-selected" : ""}`}
                onClick={() => {
                  setLang(l);
                  setOpen(false);
                }}
              >
                <span className="lp-lang__option-flag-wrap">
                  <img src={l.flag} alt={l.label} className="lp-lang__flag" />
                </span>

                <span className="lp-lang__option-text">
                  <span className="lp-lang__option-name">{l.label}</span>
                  <span className="lp-lang__option-native">{l.native}</span>
                </span>

                {active && (
                  <span className="lp-lang__check" aria-hidden>
                    <svg
                      viewBox="0 0 10 10"
                      fill="none"
                      style={{ width: 9, height: 9 }}
                    >
                      <polyline
                        points="1.5,5 4,7.5 8.5,2.5"
                        stroke="#93c5fd"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .lp-lang {
          position: relative;
          z-index: 50;
        }

        .lp-lang__trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          color: var(--badge-text);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .dark .lp-lang__trigger {
          --badge-text: rgba(147, 197, 253, 0.8);
        }

        .light .lp-lang__trigger {
          --badge-text: var(--primary);
        }

        .lp-lang__trigger:hover {
          background: var(--badge-hover-bg);
          border-color: var(--badge-hover-border);
        }

        .dark .lp-lang__trigger:hover {
          --badge-hover-bg: rgba(255, 255, 255, 0.1);
          --badge-hover-border: rgba(147, 197, 253, 0.3);
        }

        .light .lp-lang__trigger:hover {
          --badge-hover-bg: rgba(37, 99, 235, 0.1);
          --badge-hover-border: rgba(37, 99, 235, 0.3);
        }

        .lp-lang__flag-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .lp-lang__flag {
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }

        .lp-lang__label {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.2px;
        }

        .lp-lang__chevron {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
          color: var(--chevron-color);
        }

        .dark .lp-lang__chevron {
          --chevron-color: rgba(147, 197, 253, 0.6);
        }

        .light .lp-lang__chevron {
          --chevron-color: var(--primary);
        }

        .lp-lang__trigger.is-open .lp-lang__chevron {
          transform: rotate(180deg);
        }

        .lp-lang__dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 200px;
          border-radius: 10px;
          background: var(--dropdown-bg);
          border: 1px solid var(--dropdown-border);
          box-shadow: var(--dropdown-shadow);
          overflow: hidden;
          animation: slideDown 0.2s ease;
          z-index: 1000;
        }

        .dark .lp-lang__dropdown {
          --dropdown-bg: rgba(8, 20, 45, 0.95);
          --dropdown-border: rgba(255, 255, 255, 0.1);
          --dropdown-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }

        .light .lp-lang__dropdown {
          --dropdown-bg: rgba(255, 255, 255, 0.95);
          --dropdown-border: rgba(0, 0, 0, 0.1);
          --dropdown-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .lp-lang__section-title {
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--section-title-color);
        }

        .dark .lp-lang__section-title {
          --section-title-color: rgba(255, 255, 255, 0.5);
        }

        .light .lp-lang__section-title {
          --section-title-color: rgba(0, 0, 0, 0.5);
        }

        .lp-lang__option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          cursor: pointer;
          color: var(--option-text);
          transition: background 0.15s ease;
        }

        .dark .lp-lang__option {
          --option-text: rgba(255, 255, 255, 0.8);
        }

        .light .lp-lang__option {
          --option-text: var(--primary);
        }

        .lp-lang__option:hover {
          background: var(--option-hover-bg);
        }

        .dark .lp-lang__option:hover {
          --option-hover-bg: rgba(147, 197, 253, 0.1);
        }

        .light .lp-lang__option:hover {
          --option-hover-bg: rgba(37, 99, 235, 0.1);
        }

        .lp-lang__option-flag-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .lp-lang__option-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .lp-lang__option-name {
          font-size: 13px;
          font-weight: 500;
        }

        .lp-lang__option-native {
          font-size: 11px;
          color: var(--option-native-color);
        }

        .dark .lp-lang__option-native {
          --option-native-color: rgba(255, 255, 255, 0.5);
        }

        .light .lp-lang__option-native {
          --option-native-color: rgba(0, 0, 0, 0.5);
        }

        .lp-lang__check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          color: #93c5fd;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .lp-lang__label {
            display: none;
          }

          .lp-lang__trigger {
            padding: 8px 10px;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
};
