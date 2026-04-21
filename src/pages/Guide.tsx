import { BookOpen, Download, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useFileViewer } from "../hooks/useFileViewer";
import FileViewer from "../components/FileViewer";
import { useTranslation } from "../hooks/useTranslation";
import { useAppSelector } from "../hooks/auth";
import type { Book } from "../types/guide";
import guideApi from "../api/guide";

const TARGET_BOOK_ID = "BK0000000000001";

export default function Guide() {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);

  const [fileName, setFileName] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      try {
        const books = await guideApi.getAllFiles(user.factory);
        if (cancelled) return;

        const book = books.find((b: Book) => b.ID === TARGET_BOOK_ID);
        if (book) {
          setFileName(book.FileName);
        } else {
          setFetchError(new Error(`Không tìm thấy sách ID: ${TARGET_BOOK_ID}`));
        }
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

  const fileUrl = fileName
    ? `http://erp.lacty.com.vn:8000/webview/${user.factory}/${fileName}`
    : null;

  const {
    objectUrl,
    fileType: detectedType,
    loading,
    error: viewerError,
    reload,
  } = useFileViewer({
    url: null,
    directUrl: fileUrl,
    forceType: "pdf",
  });

  const error = fetchError || viewerError;

  const handleDownload = () => {
    if (!objectUrl) return;
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName;
    a.click();
  };

  const handleOpenExternal = () => {
    if (!objectUrl) return;
    window.open(objectUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="gd-page">
      {/* ── Fixed header ── */}
      <div className="gd-header">
        <div className="gd-header__left">
          <div className="gd-header__icon">
            <BookOpen size={18} />
          </div>
          <h1 className="gd-header__title">{t("huongDanSuDung")}</h1>
        </div>

        <div className="gd-header__actions">
          {objectUrl && (
            <button className="gd-action-btn" onClick={handleDownload}>
              <Download size={15} />
              <span className="gd-action-btn__label">Download</span>
            </button>
          )}
          {objectUrl && (
            <button className="gd-action-btn" onClick={handleOpenExternal}>
              <ExternalLink size={15} />
              <span className="gd-action-btn__label">Expand</span>
            </button>
          )}
        </div>
      </div>

      <div className="gd-content">
        <FileViewer
          objectUrl={objectUrl}
          fileType={detectedType}
          loading={loading}
          error={error}
          onReload={reload}
          height="100%"
          className="gd-viewer"
        />
      </div>

      <style>{`
        .gd-page {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-sizing: border-box;
        }

        .gd-header {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 24px;
          border-bottom: 1px solid var(--gd-border);
          transition: background 0.3s, border-color 0.3s;
          z-index: 1;
        }
        .dark .gd-header {
          background: rgba(15,27,48,0.6);
          --gd-border: rgba(255,255,255,0.07);
        }
        .light .gd-header {
          background: rgba(255,255,255,0.8);
          --gd-border: rgba(0,0,0,0.07);
          backdrop-filter: blur(8px);
        }

        .gd-header__left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .gd-header__icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.3s, color 0.3s;
        }
        .dark .gd-header__icon  { background: rgba(147,197,253,0.1); color: #93c5fd; }
        .light .gd-header__icon { background: rgba(37,99,235,0.08); color: #2563eb; }

        .gd-header__title {
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.3s;
        }
        .dark .gd-header__title  { color: rgba(255,255,255,0.9); }
        .light .gd-header__title { color: #0f2544; }

        .gd-header__actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .gd-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid var(--gd-btn-border);
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          color: var(--gd-btn-color);
          white-space: nowrap;
        }
        .dark  { --gd-btn-border: rgba(255,255,255,0.1); --gd-btn-color: rgba(255,255,255,0.65); }
        .light { --gd-btn-border: rgba(0,0,0,0.1); --gd-btn-color: #475569; }

        .gd-action-btn:hover {
          background: var(--gd-btn-hover);
          color: var(--gd-btn-hover-color);
          border-color: var(--gd-btn-hover-border);
        }
        .dark {
          --gd-btn-hover: rgba(147,197,253,0.08);
          --gd-btn-hover-color: #93c5fd;
          --gd-btn-hover-border: rgba(147,197,253,0.25);
        }
        .light {
          --gd-btn-hover: rgba(37,99,235,0.06);
          --gd-btn-hover-color: #2563eb;
          --gd-btn-hover-border: rgba(37,99,235,0.2);
        }

        .gd-content {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          padding: 16px 20px 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .gd-viewer {
          flex: 1;
          min-height: 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--gd-viewer-border);
          transition: border-color 0.3s;
        }
        .dark  { --gd-viewer-border: rgba(255,255,255,0.06); }
        .light { --gd-viewer-border: rgba(0,0,0,0.06); }

        .gd-viewer .fv-root,
        .gd-viewer .fv-iframe {
          border-radius: 0;
        }

        @media (max-width: 768px) {
          .gd-header { padding: 12px 16px; }
          .gd-content { padding: 12px 12px 96px; }
          .gd-action-btn__label { display: none; }
          .gd-action-btn { padding: 7px 8px; }
        }

        @media (max-width: 480px) {
          .gd-header__title { font-size: 14px; }
          .gd-content { padding: 8px 8px 96px; }
        }
      `}</style>
    </div>
  );
}
