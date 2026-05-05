import { AlertCircle, RefreshCw, FileX } from "lucide-react";
import type { SupportedFileType } from "../hooks/useFileViewer";

export interface FileViewerProps {
  objectUrl: string | null;
  fileType: SupportedFileType;
  loading?: boolean;
  error?: Error | null;
  onReload?: () => void;
  height?: string;
  className?: string;
  loadingText?: string;
}

const stateWrapCls =
  "flex flex-col items-center justify-center gap-3 rounded-xl " +
  "bg-black/[0.03] dark:bg-white/[0.03]";

const stateTextCls =
  "text-[13.5px] font-['DM_Sans',sans-serif] m-0 text-center " +
  "text-slate-500 dark:text-white/45";

const stateIconCls =
  "transition-colors duration-300 text-black/[0.18] dark:text-white/20";

const reloadBtnCls =
  "inline-flex items-center gap-1.5 rounded-lg border cursor-pointer no-underline " +
  "text-[13px] font-semibold font-['DM_Sans',sans-serif] transition-all duration-150 " +
  "border-blue-600/25 text-[#2563eb] bg-transparent " +
  "dark:border-blue-300/30 dark:text-blue-300/85 " +
  "hover:bg-blue-600/[0.06] dark:hover:bg-blue-300/[0.08]";

export default function FileViewer({
  objectUrl,
  fileType,
  loading = false,
  error = null,
  onReload,
  height = "100%",
  className = "",
  loadingText = "Loading file...",
}: FileViewerProps) {
  // ── Loading ──
  if (loading) {
    return (
      <div className={`${stateWrapCls} ${className}`} style={{ height }}>
        {/* Spinner */}
        <span
          className="
            w-9 h-9 rounded-full border-[3px] border-transparent
            border-t-[#2563eb] dark:border-t-blue-300/70
            animate-spin
          "
        />
        <p className={stateTextCls}>{loadingText}</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className={`${stateWrapCls} ${className}`} style={{ height }}>
        <AlertCircle
          size={36}
          className="transition-colors duration-300 text-[#ef4444] dark:text-[#f87171]"
        />
        <p className={stateTextCls}>{error.message}</p>
        {onReload && (
          <button
            className={reloadBtnCls}
            style={{ padding: "7px 16px" }}
            onClick={onReload}
          >
            <RefreshCw size={14} />
            Retry
          </button>
        )}
      </div>
    );
  }

  // ── No file ──
  if (!objectUrl) {
    return (
      <div className={`${stateWrapCls} ${className}`} style={{ height }}>
        <FileX size={36} className={stateIconCls} />
        <p className={stateTextCls}>
          No file chosen. Please choose file to view
        </p>
      </div>
    );
  }

  // ── Render by type ──
  return (
    <div
      className={`w-full overflow-hidden rounded-xl relative ${className}`}
      style={{ height }}
    >
      {/* PDF / HTML / Text */}
      {(fileType === "pdf" || fileType === "text" || fileType === "html") && (
        <iframe
          src={objectUrl}
          className="w-full h-full border-none block rounded-xl"
          title={fileType === "pdf" ? "PDF Viewer" : "Text / HTML Viewer"}
          sandbox={fileType !== "pdf" ? "allow-same-origin" : undefined}
        />
      )}

      {/* Image */}
      {fileType === "image" && (
        <div className="w-full h-full flex items-start justify-center overflow-y-auto box-border p-4">
          <img
            src={objectUrl}
            alt="File preview"
            className="max-w-full h-auto rounded-lg block object-contain"
          />
        </div>
      )}

      {/* Video */}
      {fileType === "video" && (
        <div className="w-full h-full flex items-center justify-center box-border p-4">
          <video
            src={objectUrl}
            controls
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}

      {/* Audio */}
      {fileType === "audio" && (
        <div className="w-full h-full flex items-center justify-center p-6">
          <audio src={objectUrl} controls className="w-full max-w-120" />
        </div>
      )}

      {/* Unknown */}
      {fileType === "unknown" && (
        <div className={`${stateWrapCls} w-full`} style={{ height: "100%" }}>
          <FileX size={36} className={stateIconCls} />
          <p className={stateTextCls}>File format not supported</p>
          <a
            href={objectUrl}
            download
            className={reloadBtnCls}
            style={{ padding: "7px 16px" }}
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}
