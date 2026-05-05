import { BookOpen, Download, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useFileViewer } from "../hooks/useFileViewer";
import FileViewer from "../components/FileViewer";
import { useTranslation } from "../hooks/useTranslation";
import { useAppSelector } from "../hooks/auth";
import type { Book } from "../types/guide";
import guideApi from "../api/features/guide";

const TARGET_BOOK_ID = "BK0000000000001";
const FILE_BASE = import.meta.env.VITE_FILES_URL ?? null;

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
          setFetchError(
            new Error(`Can not find book with ID: ${TARGET_BOOK_ID}`),
          );
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

  const fileUrl = fileName ? `${FILE_BASE}${user.factory}/${fileName}` : null;

  const {
    objectUrl,
    fileType: detectedType,
    loading,
    error: viewerError,
    reload,
  } = useFileViewer({ url: null, directUrl: fileUrl, forceType: "pdf" });

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

  const actionBtnCls = `
    inline-flex items-center gap-1.5 rounded-lg border cursor-pointer
    text-[13px] font-semibold font-['DM_Sans',sans-serif] transition-all duration-150 whitespace-nowrap
    border-black/10 text-slate-500/90 bg-transparent
    dark:border-white/10 dark:text-white/65
    hover:bg-blue-600/[0.06] hover:text-[#2563eb] hover:border-blue-600/20
    dark:hover:bg-blue-300/[0.08] dark:hover:text-[#93c5fd] dark:hover:border-blue-300/25
  `;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden box-border">
      {/* ── Header ── */}
      <div
        className="
          shrink-0 flex items-center justify-between gap-3 z-1
          border-b transition-colors duration-300
          bg-white/80 border-black/[0.07] backdrop-blur-sm
          dark:bg-[rgba(15,27,48,0.6)] dark:border-white/[0.07]
        "
        style={{ padding: "14px 24px" }}
      >
        {/* Left */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="
              w-8.5 h-8.5 rounded-[9px] flex items-center justify-center not-only:shrink-0
              transition-colors duration-300
              bg-blue-600/8 text-[#2563eb]
              dark:bg-blue-300/10 dark:text-[#93c5fd]
            "
          >
            <BookOpen size={18} />
          </div>
          <h1
            className="
              font-bold font-['DM_Sans',sans-serif] m-0 whitespace-nowrap overflow-hidden text-ellipsis
              transition-colors duration-300
              text-[#0f2544] dark:text-white/90
              text-[15px] max-[480px]:text-[14px]
            "
          >
            {t("huongDanSuDung")}
          </h1>
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
    </div>
  );
}
