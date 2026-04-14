import { useState, useRef, useEffect } from "react";
import type { Lang } from "../../types/storage";
import { LANGS } from "../../libs/constance";
import { useTheme } from "../../context/ThemeContext";

interface LanguageBadgeProps {
  /** "floating" = absolute positioned (AuthPage style, uses .lp-lang CSS)
   *  "inline"   = fits inside a header flex row, uses Tailwind */
  variant?: "floating" | "inline";
}

export const LanguageBadge = ({ variant = "floating" }: LanguageBadgeProps) => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(LANGS[0]);
  const ref = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (variant === "floating") {
    return (
      <div className="lp-lang" ref={ref}>
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
  }

  // ── Inline variant (Header) ─────────────────────────────────────────────
  const D = isDark;
  const triggerCls = [
    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[13px] font-medium",
    "transition-all duration-200 select-none cursor-pointer",
    D
      ? "bg-white/[0.07] border-white/15 text-white/90 hover:bg-white/[0.12] hover:border-blue-300/50"
      : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-slate-300",
    open ? (D ? "border-blue-400/60" : "border-blue-400") : "",
  ].join(" ");

  const dropCls = [
    "absolute top-[calc(100%+8px)] right-0 z-50 w-52 rounded-2xl border",
    "shadow-2xl backdrop-blur-2xl overflow-hidden",
    D ? "bg-[#0d1e3a]/98 border-white/10" : "bg-white border-slate-200",
  ].join(" ");

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <div
        className={triggerCls}
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* SVG flag — circular crop */}
        <span className="w-5 h-5 rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-white/5">
          <img
            src={lang.flag}
            alt={lang.label}
            className="w-full h-full object-cover"
          />
        </span>
        <span className="hidden md:inline">{lang.label}</span>
        <svg
          viewBox="0 0 14 14"
          className={`w-3 h-3 opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
        >
          <path
            d="M3 5L7 9L11 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {open && (
        <div
          className={dropCls}
          style={{
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset",
          }}
          role="listbox"
        >
          <div
            className={`px-3 pt-3 pb-1.5 text-[10px] font-semibold tracking-widest uppercase ${D ? "text-blue-300/40" : "text-slate-400"}`}
          >
            Language
          </div>

          {LANGS.map((l) => {
            const active = l.code === lang.code;
            return (
              <div
                key={l.code}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setLang(l);
                  setOpen(false);
                }}
                className={[
                  "flex items-center gap-2.5 px-3 py-2.5 mx-1.5 mb-0.5",
                  "rounded-xl cursor-pointer transition-all duration-150",
                  D ? "hover:bg-white/[0.07]" : "hover:bg-slate-50",
                  active ? (D ? "bg-blue-500/20" : "bg-blue-50") : "",
                ].join(" ")}
              >
                {/* SVG flag */}
                <span className="w-6 h-6 rounded-full overflow-hidden border border-white/10 flex-shrink-0 bg-white/5">
                  <img
                    src={l.flag}
                    alt={l.label}
                    className="w-full h-full object-cover"
                  />
                </span>

                <span className="flex-1 min-w-0">
                  <span
                    className={`block text-[13px] font-medium ${active ? "text-blue-400" : D ? "text-white/85" : "text-slate-700"}`}
                  >
                    {l.label}
                  </span>
                  <span
                    className={`block text-[11px] ${D ? "text-white/30" : "text-slate-400"}`}
                  >
                    {l.native}
                  </span>
                </span>

                {active && (
                  <span className="w-4 h-4 rounded-full bg-blue-500/25 border border-blue-300/50 flex items-center justify-center flex-shrink-0">
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
          <div className="h-1.5" />
        </div>
      )}
    </div>
  );
};
