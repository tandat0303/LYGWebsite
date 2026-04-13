import { useState, useRef, useEffect } from "react";

import vnFlag from "../../assets/flags/vn.svg";
import enFlag from "../../assets/flags/gb.svg";
import mmFlag from "../../assets/flags/mm.svg";
import twFlag from "../../assets/flags/tw.svg";

type Lang = {
  code: string;
  label: string;
  native: string;
  flag: string;
};

const LANGS: Lang[] = [
  { code: "vn", label: "Vietnamese", native: "Tiếng Việt", flag: vnFlag },
  { code: "en", label: "English", native: "English", flag: enFlag },
  { code: "mm", label: "Myanmar", native: "မြန်မာဘာသာ", flag: mmFlag },
  {
    code: "tw",
    label: "Taiwan",
    native: "繁體中文",
    flag: twFlag,
  },
];

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
      <div
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
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

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
    </div>
  );
};
