// hooks/useFileViewer.ts
// Reusable hook: fetch a file from a URL (API endpoint or static),
// detect its MIME type, and return a blob object URL ready for rendering.
//
// Usage:
//   const { objectUrl, fileType, loading, error, reload } = useFileViewer({
//     url: "/api/guide/handbook.pdf",
//     headers: { Authorization: `Bearer ${token}` },
//   });

import { useState, useEffect, useCallback, useRef } from "react";

export type SupportedFileType =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "text"
  | "html"
  | "unknown";

export interface UseFileViewerOptions {
  url: string | null;
  headers?: Record<string, string>;
  forceType?: SupportedFileType;
  directUrl?: string;
  onSuccess?: (objectUrl: string, fileType: SupportedFileType) => void;
  onError?: (error: Error) => void;
}

export interface UseFileViewerResult {
  objectUrl: string | null;
  fileType: SupportedFileType;
  mimeType: string;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

function detectFileType(mime: string): SupportedFileType {
  if (mime.startsWith("application/pdf")) return "pdf";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("text/html")) return "html";
  if (mime.startsWith("text/")) return "text";
  return "unknown";
}

export function useFileViewer({
  url,
  headers = {},
  forceType,
  directUrl,
  onSuccess,
  onError,
}: UseFileViewerOptions): UseFileViewerResult {
  const [objectUrl, setObjectUrl] = useState<string | null>(directUrl ?? null);
  const [fileType, setFileType] = useState<SupportedFileType>(
    forceType ?? "unknown",
  );
  const [mimeType, setMimeType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const prevObjectUrl = useRef<string | null>(null);

  const fetchFile = useCallback(async () => {
    if (!url && !directUrl) return;

    if (directUrl) {
      const detectedType = forceType ?? "pdf";
      setObjectUrl(directUrl);
      setFileType(detectedType);
      onSuccess?.(directUrl, detectedType);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url!, {
        signal: controller.signal,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("Content-Type") ?? "";
      const mime = contentType.split(";")[0].trim();
      const type = forceType ?? detectFileType(mime);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (prevObjectUrl.current) {
        URL.revokeObjectURL(prevObjectUrl.current);
      }
      prevObjectUrl.current = blobUrl;

      setObjectUrl(blobUrl);
      setFileType(type);
      setMimeType(mime);
      onSuccess?.(blobUrl, type);
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") return;
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      onError?.(e);
    } finally {
      setLoading(false);
    }
  }, [url, directUrl, forceType, JSON.stringify(headers)]);

  useEffect(() => {
    fetchFile();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchFile]);

  useEffect(() => {
    return () => {
      if (prevObjectUrl.current) {
        URL.revokeObjectURL(prevObjectUrl.current);
      }
    };
  }, []);

  return { objectUrl, fileType, mimeType, loading, error, reload: fetchFile };
}
