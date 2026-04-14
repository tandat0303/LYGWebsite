import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import type { Lang } from "../../types/storage";
import { LANGS } from "../../libs/constance";

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Lang>(LANGS[0]);
  const ref = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem("language");
    if (stored) {
      const lang = LANGS.find((l) => l.code === stored);
      if (lang) setSelected(lang);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (lang: Lang) => {
    setSelected(lang);
    localStorage.setItem("language", lang.code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
          isDark
            ? "border-slate-700 hover:bg-slate-800"
            : "border-slate-200 hover:bg-slate-50"
        }`}
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="hidden md:inline text-sm font-medium">
          {selected.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full right-0 mt-2 w-48 rounded-lg border shadow-lg z-50 ${
            isDark
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-slate-200"
          }`}
        >
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                selected.code === lang.code
                  ? isDark
                    ? "bg-blue-900/30 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                  : isDark
                    ? "hover:bg-slate-800 text-slate-300"
                    : "hover:bg-slate-50 text-slate-700"
              } ${lang !== LANGS[LANGS.length - 1] ? "border-b " + (isDark ? "border-slate-700" : "border-slate-100") : ""}`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex flex-col">
                <span>{lang.label}</span>
                <span
                  className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  {lang.native}
                </span>
              </div>
              {selected.code === lang.code && (
                <span className="ml-auto text-blue-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
