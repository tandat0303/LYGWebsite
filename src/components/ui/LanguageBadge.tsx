import { useState, useRef, useEffect } from "react";
import type { Lang } from "../../types/storage";
import { LANGS } from "../../libs/constance";
import { useAppDispatch, useAppSelector } from "../../hooks/auth";
import { changeLanguage } from "../../features/languageSlice";
import { useTranslation } from "../../hooks/useTranslation";

export const LanguageBadge = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const lang = useAppSelector((s) => s.language.current);

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectLang = (lang: Lang) => {
    dispatch(changeLanguage(lang));
    setOpen(false);
  };

  return (
    <div className="absolute top-4.5 right-5.5 z-50" ref={ref}>
      {/* ── Trigger pill ── */}
      <div
        className={`inline-flex items-center gap-2 rounded-full
                    cursor-pointer bg-white/7 backdrop-blur-lg border border-white/15 text-white
                    text-[13px] font-medium transition-all duration-220 ease-in select-none min-w-[150px] justify-between
                    hover:bg-white/13 hover:border-[rgba(147,197,253,0.55)] hover:-translate-y-px
                    ${open ? "bg-white/12 border-[rgba(147,197,253,0.7)] shadow-[0_0_0_3px_rgba(147,197,253,0.12)] -translate-y-px" : ""}`}
        style={{ padding: "9px 14px 9px 10px" }}
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="w-[22px] h-[22px] rounded-full overflow-hidden border border-white/20 shrink-0 bg-white/5">
          <img
            src={lang.flag}
            alt={lang.label}
            className="w-full h-full object-cover rounded-full block"
          />
        </span>

        <span className="text-[13px] font-medium text-white/92 whitespace-nowrap">
          {t(lang.label)}
        </span>

        <span
          className={`flex items-center justify-center ml-0.5 transition-transform duration-220 ease-in ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
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

      {/* ── Dropdown — lp-lang__dropdown ── */}
      {open && (
        <div
          className="absolute top-[calc(100%+8px)] right-0 w-[210px] p-1.5 rounded-[14px]
                     bg-[rgba(8,20,45,0.95)] backdrop-blur-xl border border-white/10
                     shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.05)]
                     animate-lp-lang-down"
          role="listbox"
        >
          <div
            className="text-[10px] font-semibold tracking-[1.8px] uppercase text-[rgba(147,197,253,0.45)]"
            style={{ padding: "6px 10px 4px" }}
          >
            {t("ngonNgu")}
          </div>

          {LANGS.map((l) => {
            const active = l.code === lang.code;
            return (
              <div
                key={l.code}
                role="option"
                aria-selected={active}
                className={`flex items-center gap-2.5 rounded-[9px] cursor-pointer transition-colors duration-130 ease-in
                            hover:bg-[rgba(147,197,253,0.08)]
                            ${active ? "bg-[rgba(37,99,235,0.2)]" : ""}`}
                style={{ padding: "9px 10px" }}
                onClick={() => handleSelectLang(l)}
              >
                <span className="w-[26px] h-[26px] rounded-full overflow-hidden border border-white/12 shrink-0 bg-white/5">
                  <img
                    src={l.flag}
                    alt={l.label}
                    className="w-full h-full object-cover rounded-full block"
                  />
                </span>

                <span className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <span
                    className={`text-[13px] font-medium leading-none ${active ? "text-[#93c5fd]" : "text-white/88"}`}
                  >
                    {t(l.label)}
                  </span>
                  {/* <span className="text-[11px] text-white/35 leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                    {l.native}
                  </span> */}
                </span>

                {active && (
                  <span
                    className="w-[18px] h-[18px] rounded-full bg-[rgba(37,99,235,0.3)] border border-[rgba(147,197,253,0.5)]
                               flex items-center justify-center shrink-0"
                    aria-hidden
                  >
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
