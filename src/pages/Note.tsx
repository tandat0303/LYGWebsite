import { FileText, Download, ExternalLink, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useFileViewer } from "../hooks/useFileViewer";
import FileViewer from "../components/FileViewer";
import { useTranslation } from "../hooks/useTranslation";

import { useAppSelector } from "../hooks/auth";
import { useClickOutside } from "../hooks/useClickOutside";
import type { Book } from "../types/guide";
import guideApi from "../api/guide";

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
    ? `http://erp.lacty.com.vn:8000/webview/${user.factory}/${selectedBook.FileName}`
    : null;

  const {
    objectUrl: rawObjectUrl,
    fileType: detectedType,
    loading,
    error: viewerError,
    reload,
  } = useFileViewer({
    url: null,
    directUrl: fileUrl,
    forceType: "pdf",
  });

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

  return (
    <div className="nt-page">
      {/* ── Fixed header ── */}
      <div className="nt-header">
        <div className="nt-header__left">
          <div className="nt-header__icon">
            <FileText size={18} />
          </div>
          <h1 className="nt-header__title">{t("soTay / quyTrinhChinhSach")}</h1>

          {/* ── File selector ── */}
          <div className="nt-select-wrap" ref={selectRef}>
            <button
              className={`nt-select-trigger${!selectedBook ? " nt-select-trigger--placeholder" : ""}`}
              onClick={() => setSelectOpen((o) => !o)}
              disabled={books.length === 0}
            >
              <span className="nt-select-trigger__label">
                {selectedBook ? selectedBook.Title : t("chonSoTayQuyTrinh")}
              </span>

              <ChevronDown
                size={14}
                className={`nt-select-trigger__chevron${selectOpen ? " nt-select-trigger__chevron--open" : ""}`}
              />
            </button>

            {selectOpen && books.length > 0 && (
              <div className="nt-dropdown">
                <button
                  className={`nt-dropdown__item${!selectedBook ? " nt-dropdown__item--active" : ""}`}
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
                    className={`nt-dropdown__item${selectedBook?.ID === book.ID ? " nt-dropdown__item--active" : ""}`}
                    onClick={() => handleSelect(book)}
                  >
                    {book.Title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="nt-header__actions">
          {objectUrl && (
            <button className="nt-action-btn" onClick={handleDownload}>
              <Download size={15} />
              <span className="nt-action-btn__label">Download</span>
            </button>
          )}
          {objectUrl && (
            <button className="nt-action-btn" onClick={handleOpenExternal}>
              <ExternalLink size={15} />
              <span className="nt-action-btn__label">Expand</span>
            </button>
          )}
        </div>
      </div>

      <div className="nt-content">
        <FileViewer
          objectUrl={objectUrl}
          fileType={detectedType}
          loading={loading}
          error={error}
          onReload={reload}
          height="100%"
          className="nt-viewer"
        />
      </div>

      <style>{`
        .nt-page {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* ── Header ── */
        .nt-header {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 24px;
          border-bottom: 1px solid var(--nt-border);
          transition: background 0.3s, border-color 0.3s;
          z-index: 10;
        }
        .dark .nt-header {
          background: rgba(15,27,48,0.6);
          --nt-border: rgba(255,255,255,0.07);
        }
        .light .nt-header {
          background: rgba(255,255,255,0.8);
          --nt-border: rgba(0,0,0,0.07);
          backdrop-filter: blur(8px);
        }

        .nt-header__left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex: 1;
        }

        .nt-header__icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.3s, color 0.3s;
        }
        .dark .nt-header__icon  { background: rgba(147,197,253,0.1); color: #93c5fd; }
        .light .nt-header__icon { background: rgba(37,99,235,0.08); color: #2563eb; }

        .nt-header__title {
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          margin: 0;
          white-space: nowrap;
          flex-shrink: 0;
          transition: color 0.3s;
        }
        .dark .nt-header__title  { color: rgba(255,255,255,0.9); }
        .light .nt-header__title { color: #0f2544; }

        /* ── Select ── */
        .nt-select-wrap {
          position: relative;
          flex: 1;
          max-width: 320px;
          min-width: 0;
        }

        .nt-select-trigger {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          padding: 6px 10px 6px 12px;
          border-radius: 8px;
          border: 1px solid var(--nt-sel-border);
          background: var(--nt-sel-bg);
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          color: var(--nt-sel-color);
          min-width: 0;
        }
        .dark {
          --nt-sel-border: rgba(255,255,255,0.1);
          --nt-sel-bg: rgba(255,255,255,0.04);
          --nt-sel-color: rgba(255,255,255,0.75);
        }
        .light {
          --nt-sel-border: rgba(0,0,0,0.1);
          --nt-sel-bg: rgba(0,0,0,0.02);
          --nt-sel-color: #334155;
        }
        .nt-select-trigger:hover:not(:disabled) {
          border-color: var(--nt-sel-hover-border);
          background: var(--nt-sel-hover-bg);
        }
        .dark {
          --nt-sel-hover-border: rgba(147,197,253,0.3);
          --nt-sel-hover-bg: rgba(147,197,253,0.06);
        }
        .light {
          --nt-sel-hover-border: rgba(37,99,235,0.25);
          --nt-sel-hover-bg: rgba(37,99,235,0.04);
        }
        .nt-select-trigger:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .dark .nt-select-trigger--placeholder  { color: rgba(255,255,255,0.35); }
        .light .nt-select-trigger--placeholder { color: #94a3b8; }

        .nt-select-trigger__label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          text-align: left;
        }

        .nt-select-trigger__chevron {
          flex-shrink: 0;
          transition: transform 0.2s;
          opacity: 0.6;
        }
        .nt-select-trigger__chevron--open {
          transform: rotate(180deg);
        }

        /* ── Dropdown ── */
        .nt-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          border-radius: 10px;
          border: 1px solid var(--nt-dd-border);
          background: var(--nt-dd-bg);
          backdrop-filter: blur(12px);
          box-shadow: var(--nt-dd-shadow);
          overflow: hidden;
          overflow-y: auto;
          max-height: 220px;
          z-index: 50;
          animation: nt-dropdown-in 0.15s ease;
        }
        .dark {
          --nt-dd-border: rgba(255,255,255,0.09);
          --nt-dd-bg: rgba(18,32,56,0.95);
          --nt-dd-shadow: 0 8px 32px rgba(0,0,0,0.45);
        }
        .light {
          --nt-dd-border: rgba(0,0,0,0.08);
          --nt-dd-bg: rgba(255,255,255,0.97);
          --nt-dd-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }

        @keyframes nt-dropdown-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nt-dropdown__item {
          width: 100%;
          display: block;
          padding: 9px 14px;
          text-align: left;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--nt-dd-item-color);
        }
        .dark  { --nt-dd-item-color: rgba(255,255,255,0.7); }
        .light { --nt-dd-item-color: #334155; }

        .nt-dropdown__item:hover {
          background: var(--nt-dd-item-hover);
          color: var(--nt-dd-item-hover-color);
        }
        .dark  {
          --nt-dd-item-hover: rgba(147,197,253,0.08);
          --nt-dd-item-hover-color: #93c5fd;
        }
        .light {
          --nt-dd-item-hover: rgba(37,99,235,0.06);
          --nt-dd-item-hover-color: #2563eb;
        }

        .nt-dropdown__item--active {
          color: var(--nt-dd-active-color) !important;
          background: var(--nt-dd-active-bg) !important;
          font-weight: 600;
        }
        .dark  {
          --nt-dd-active-color: #93c5fd;
          --nt-dd-active-bg: rgba(147,197,253,0.1);
        }
        .light {
          --nt-dd-active-color: #2563eb;
          --nt-dd-active-bg: rgba(37,99,235,0.08);
        }

        /* ── Header actions ── */
        .nt-header__actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .nt-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid var(--nt-btn-border);
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          color: var(--nt-btn-color);
          white-space: nowrap;
        }
        .dark  { --nt-btn-border: rgba(255,255,255,0.1); --nt-btn-color: rgba(255,255,255,0.65); }
        .light { --nt-btn-border: rgba(0,0,0,0.1); --nt-btn-color: #475569; }

        .nt-action-btn:hover {
          background: var(--nt-btn-hover);
          color: var(--nt-btn-hover-color);
          border-color: var(--nt-btn-hover-border);
        }
        .dark {
          --nt-btn-hover: rgba(147,197,253,0.08);
          --nt-btn-hover-color: #93c5fd;
          --nt-btn-hover-border: rgba(147,197,253,0.25);
        }
        .light {
          --nt-btn-hover: rgba(37,99,235,0.06);
          --nt-btn-hover-color: #2563eb;
          --nt-btn-hover-border: rgba(37,99,235,0.2);
        }

        /* ── Content ── */
        .nt-content {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          padding: 16px 20px 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .nt-viewer {
          flex: 1;
          min-height: 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--nt-viewer-border);
          transition: border-color 0.3s;
        }
        .dark  { --nt-viewer-border: rgba(255,255,255,0.06); }
        .light { --nt-viewer-border: rgba(0,0,0,0.06); }

        .nt-viewer .fv-root,
        .nt-viewer .fv-iframe {
          border-radius: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .nt-header { padding: 12px 16px; }
          .nt-content { padding: 12px 12px 96px; }
          .nt-action-btn__label { display: none; }
          .nt-action-btn { padding: 7px 8px; }
          .nt-select-wrap { max-width: 180px; }
        }

        @media (max-width: 480px) {
          .nt-header__title { display: none; }
          .nt-content { padding: 8px 8px 96px; }
          .nt-select-wrap { max-width: 160px; }
        }
      `}</style>
    </div>
  );
}
