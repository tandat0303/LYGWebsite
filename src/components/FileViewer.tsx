// components/ui/FileViewer.tsx
// Reusable file renderer — renders the correct viewer based on fileType.
// Designed to be used with useFileViewer hook.
//
// Usage:
//   <FileViewer
//     objectUrl={objectUrl}
//     fileType={fileType}
//     loading={loading}
//     error={error}
//     onReload={reload}
//   />

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
  if (loading) {
    return (
      <div
        className={`fv-state fv-state--loading ${className}`}
        style={{ height }}
      >
        <span className="fv-spinner" />
        <p className="fv-state__text">{loadingText}</p>
        <style>{stateStyles}</style>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div
        className={`fv-state fv-state--error ${className}`}
        style={{ height }}
      >
        <AlertCircle
          size={36}
          className="fv-state__icon fv-state__icon--error"
        />
        <p className="fv-state__text">{error.message}</p>
        {onReload && (
          <button className="fv-reload-btn" onClick={onReload}>
            <RefreshCw size={14} />
            Retry
          </button>
        )}
        <style>{stateStyles}</style>
      </div>
    );
  }

  // ── No file ──
  if (!objectUrl) {
    return (
      <div
        className={`fv-state fv-state--empty ${className}`}
        style={{ height }}
      >
        <FileX size={36} className="fv-state__icon" />
        <p className="fv-state__text">No file</p>
        <style>{stateStyles}</style>
      </div>
    );
  }

  // ── Render by type ──
  return (
    <div className={`fv-root ${className}`} style={{ height }}>
      {fileType === "pdf" && (
        <iframe
          src={objectUrl}
          className="fv-iframe"
          title="PDF Viewer"
          // Hide default PDF toolbar on supported browsers
          // Add #toolbar=0&navpanes=0 for Chrome
          // Firefox ignores it — content still shows
        />
      )}

      {fileType === "image" && (
        <div className="fv-image-wrap">
          <img src={objectUrl} alt="File preview" className="fv-image" />
        </div>
      )}

      {fileType === "video" && (
        <div className="fv-video-wrap">
          <video src={objectUrl} controls className="fv-video" />
        </div>
      )}

      {fileType === "audio" && (
        <div className="fv-audio-wrap">
          <audio src={objectUrl} controls className="fv-audio" />
        </div>
      )}

      {(fileType === "text" || fileType === "html") && (
        <iframe
          src={objectUrl}
          className="fv-iframe"
          title="Text / HTML Viewer"
          sandbox="allow-same-origin"
        />
      )}

      {fileType === "unknown" && (
        <div className="fv-state fv-state--empty" style={{ height: "100%" }}>
          <FileX size={36} className="fv-state__icon" />
          <p className="fv-state__text">File format not supported</p>
          <a href={objectUrl} download className="fv-reload-btn">
            Download
          </a>
        </div>
      )}

      <style>{viewerStyles}</style>
      <style>{stateStyles}</style>
    </div>
  );
}

const stateStyles = `
  .fv-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border-radius: 12px;
    transition: background 0.3s;
  }
  .dark .fv-state  { background: rgba(255,255,255,0.03); }
  .light .fv-state { background: rgba(0,0,0,0.03); }

  .fv-state__text {
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    margin: 0;
    text-align: center;
    transition: color 0.3s;
  }
  .dark .fv-state__text  { color: rgba(255,255,255,0.45); }
  .light .fv-state__text { color: #64748b; }

  .fv-state__icon { transition: color 0.3s; }
  .dark .fv-state__icon  { color: rgba(255,255,255,0.2); }
  .light .fv-state__icon { color: rgba(0,0,0,0.18); }
  .fv-state__icon--error { }
  .dark .fv-state__icon--error  { color: #f87171; }
  .light .fv-state__icon--error { color: #ef4444; }

  /* Spinner */
  .fv-spinner {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: var(--fv-spinner-color);
    animation: fv-spin 0.75s linear infinite;
    transition: border-top-color 0.3s;
  }
  .dark  { --fv-spinner-color: rgba(147,197,253,0.7); }
  .light { --fv-spinner-color: #2563eb; }

  @keyframes fv-spin {
    to { transform: rotate(360deg); }
  }

  /* Reload / download button */
  .fv-reload-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 8px;
    border: 1px solid var(--fv-btn-border);
    background: transparent;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
    color: var(--fv-btn-color);
  }
  .dark  { --fv-btn-border: rgba(147,197,253,0.3); --fv-btn-color: rgba(147,197,253,0.85); }
  .light { --fv-btn-border: rgba(37,99,235,0.25);  --fv-btn-color: #2563eb; }
  .fv-reload-btn:hover {
    background: var(--fv-btn-hover);
  }
  .dark  { --fv-btn-hover: rgba(147,197,253,0.08); }
  .light { --fv-btn-hover: rgba(37,99,235,0.06); }
`;

const viewerStyles = `
  .fv-root {
    width: 100%;
    overflow: hidden;
    border-radius: 12px;
    transition: background 0.3s;
    position: relative;
  }

  /* PDF / HTML / Text iframe */
  .fv-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    border-radius: 12px;
    transition: filter 0.3s;
  }

  /* Image */
  .fv-image-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    padding: 16px;
    box-sizing: border-box;
  }
  .fv-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    display: block;
    object-fit: contain;
  }

  /* Video */
  .fv-video-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
  }
  .fv-video {
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
  }

  /* Audio */
  .fv-audio-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .fv-audio { width: 100%; max-width: 480px; }
`;
