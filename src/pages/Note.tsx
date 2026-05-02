import { FileText, Download, ExternalLink, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useFileViewer } from "../hooks/useFileViewer";
import FileViewer from "../components/FileViewer";
import { useTranslation } from "../hooks/useTranslation";
import { useAppSelector } from "../hooks/auth";
import { useClickOutside } from "../hooks/useClickOutside";
import type { Book } from "../types/guide";
import guideApi from "../api/guide";

const FILES_BASE = import.meta.env.VITE_FILES_URL ?? null;

export default function Note() {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);

  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [selectOpen, setSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  useClickOutside(selectRef, () => setSelectOpen(false), selectOpen);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const data = await guideApi.getAllFiles(user.factory);
        if (cancelled) return;
        setBooks(data);
      } catch (err) {
        if (cancelled) return;
        setFetchError(err instanceof Error ? err : new Error(String(err)));
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, [user.factory]);

  const fileUrl = selectedBook
    ? `${FILES_BASE}${user.factory}/${selectedBook.FileName}`
    : null;

  const {
    objectUrl: rawObjectUrl,
    fileType: detectedType,
    loading,
    error: viewerError,
    reload,
  } = useFileViewer({ url: null, directUrl: fileUrl, forceType: "pdf" });

  const objectUrl = selectedBook ? rawObjectUrl : null;
  const error = fetchError || viewerError;

  const handleDownload = () => {
    if (!objectUrl || !selectedBook) return;
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = selectedBook.FileName;
    a.click();
  };

  const handleOpenExternal = () => {
    if (!objectUrl) return;
    window.open(objectUrl, "_blank", "noopener,noreferrer");
  };

  const handleSelect = (book: Book) => {
    setSelectedBook(book);
    setSelectOpen(false);
  };

  // Shared class strings (mirrors Header.tsx conventions)
  const actionBtnCls = `
    inline-flex items-center gap-1.5 rounded-lg border cursor-pointer
    text-[13px] font-semibold font-['DM_Sans',sans-serif] transition-all duration-150 whitespace-nowrap
    border-black/10 text-slate-500/90 bg-transparent
    dark:border-white/10 dark:text-white/65
    hover:bg-blue-600/[0.06] hover:text-[#2563eb] hover:border-blue-600/20
    dark:hover:bg-blue-300/[0.08] dark:hover:text-[#93c5fd] dark:hover:border-blue-300/25
  `;

  const dropdownCls = `
    absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-[10px] overflow-hidden overflow-y-auto
    border backdrop-blur-xl max-h-[220px]
    animate-[slideDown_0.15s_cubic-bezier(0.16,1,0.3,1)]
    bg-white/[0.97] border-black/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)]
    dark:bg-[rgba(18,32,56,0.95)] dark:border-white/[0.09] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]
  `;

  const dropdownItemBaseCls = `
    w-full block text-left text-[13px] font-medium font-['DM_Sans',sans-serif] border-none bg-transparent
    cursor-pointer transition-all duration-[120ms] overflow-hidden text-ellipsis whitespace-nowrap
    text-slate-600/90 dark:text-white/70
    hover:bg-blue-600/[0.06] hover:text-[#2563eb]
    dark:hover:bg-blue-300/[0.08] dark:hover:text-[#93c5fd]
  `;

  const dropdownItemActiveCls = `!bg-blue-600/[0.08] !text-[#2563eb] !font-semibold dark:!bg-blue-300/[0.10] dark:!text-[#93c5fd]`;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden box-border">
      {/* ── Header ── */}
      <div
        className="
          shrink-0 flex items-center justify-between gap-3 z-10
          border-b transition-colors duration-300
          bg-white/80 border-black/[0.07] backdrop-blur-sm
          dark:bg-[rgba(15,27,48,0.6)] dark:border-white/[0.07]
        "
        style={{ padding: "14px 24px" }}
      >
        {/* Left */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Icon */}
          <div
            className="
              w-[34px] h-[34px] rounded-[9px] flex items-center justify-center shrink-0
              transition-colors duration-300
              bg-blue-600/8 text-[#2563eb]
              dark:bg-blue-300/10 dark:text-[#93c5fd]
            "
          >
            <FileText size={18} />
          </div>

          {/* Title */}
          <h1
            className="
              text-[15px] font-bold font-['DM_Sans',sans-serif] m-0 whitespace-nowrap shrink-0
              transition-colors duration-300
              text-[#0f2544] dark:text-white/90
              max-[480px]:hidden
            "
          >
            {t("soTay / quyTrinhChinhSach")}
          </h1>

          {/* File selector */}
          <div
            className="relative flex-1 min-w-0 max-w-[320px] max-[768px]:max-w-[180px] max-[480px]:max-w-40"
            ref={selectRef}
          >
            <button
              className={`
                w-full inline-flex items-center justify-between gap-1.5 rounded-lg border
                text-[13px] font-medium font-['DM_Sans',sans-serif] cursor-pointer transition-all duration-150 min-w-0
                border-black/10 bg-black/2 text-slate-600/90
                dark:border-white/10 dark:bg-white/4 dark:text-white/75
                hover:border-blue-600/25 hover:bg-blue-600/4
                dark:hover:border-blue-300/30 dark:hover:bg-blue-300/6
                disabled:opacity-40 disabled:cursor-not-allowed
                ${!selectedBook ? "text-slate-400 dark:text-white/35" : ""}
              `}
              style={{ padding: "6px 10px 6px 12px" }}
              onClick={() => setSelectOpen((o) => !o)}
              disabled={books.length === 0}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left">
                {selectedBook ? selectedBook.Title : t("chonSoTayQuyTrinh")}
              </span>
              <ChevronDown
                size={14}
                className={`shrink-0 opacity-60 transition-transform duration-200 ${selectOpen ? "rotate-180 opacity-80" : ""}`}
              />
            </button>

            {selectOpen && books.length > 0 && (
              <div className={dropdownCls}>
                <button
                  className={`${dropdownItemBaseCls} ${!selectedBook ? dropdownItemActiveCls : ""}`}
                  style={{ padding: "9px 14px" }}
                  onClick={() => {
                    setSelectedBook(null);
                    setSelectOpen(false);
                  }}
                >
                  {t("chonSoTayQuyTrinh")}
                </button>
                {books.map((book) => (
                  <button
                    key={book.ID}
                    className={`${dropdownItemBaseCls} ${selectedBook?.ID === book.ID ? dropdownItemActiveCls : ""}`}
                    style={{ padding: "9px 14px" }}
                    onClick={() => handleSelect(book)}
                  >
                    {book.Title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {objectUrl && (
            <button
              className={actionBtnCls}
              style={{ padding: "6px 12px" }}
              onClick={handleDownload}
            >
              <Download size={15} />
              <span className="max-[768px]:hidden">Download</span>
            </button>
          )}
          {objectUrl && (
            <button
              className={actionBtnCls}
              style={{ padding: "6px 12px" }}
              onClick={handleOpenExternal}
            >
              <ExternalLink size={15} />
              <span className="max-[768px]:hidden">Expand</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div
        className="flex-1 min-h-0 overflow-hidden flex flex-col box-border"
        style={{ padding: "16px 20px 20px" }}
      >
        <div
          className="
            flex-1 min-h-0 overflow-hidden rounded-xl
            border transition-colors duration-300
            border-black/6 dark:border-white/6
          "
        >
          <FileViewer
            objectUrl={objectUrl}
            fileType={detectedType}
            loading={loading}
            error={error}
            onReload={reload}
            height="100%"
            // className="[&_.fv-root]:rounded-none [&_.fv-iframe]:rounded-none"
          />
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
