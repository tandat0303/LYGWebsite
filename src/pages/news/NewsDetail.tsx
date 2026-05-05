import { ArrowLeft, Clock, FileText, ExternalLink } from "lucide-react";
import type { NewsDetailProps } from "../../types/news";
import { Tag } from "./Tag";
import { formatDateTime } from "../../libs/helper";

const IMAGE_BASE = import.meta.env.VITE_NEWS_IMG_URL ?? "";

function renderContent(content: string) {
  return content
    .split(/\r?\n\r?\n/)
    .filter((p) => p.trim())
    .map((para, i) => (
      <p
        key={i}
        className="leading-[1.8] text-[14px] text-slate-700/90 dark:text-white/75 m-0"
        style={{ marginBottom: "1em" }}
      >
        {para.trim()}
      </p>
    ));
}

export default function NewsDetail({ item, onBack }: NewsDetailProps) {
  const imgSrc = item.image_news ? `${IMAGE_BASE}${item.image_news}` : null;

  return (
    <div
      className="w-full min-h-full box-border overflow-x-hidden p-6
        animate-[detailFadeIn_0.28s_cubic-bezier(0.22,1,0.36,1)]"
    >
      <button
        className="inline-flex items-center gap-2 rounded-xl border cursor-pointer
          text-[13px] font-semibold
          transition-all duration-160
          bg-white/80 border-slate-200 text-slate-600
          dark:bg-white/6 dark:border-white/10 dark:text-white/65
          hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800
          dark:hover:bg-white/10 dark:hover:border-white/18 dark:hover:text-white/90"
        style={{ padding: "8px 16px", marginBottom: "24px" }}
        onClick={onBack}
      >
        <ArrowLeft size={15} />
      </button>

      {/* ── Content card ── */}
      <div
        className="w-full max-w-215 mx-auto rounded-[20px]
          bg-white border border-slate-200/70
          dark:bg-[rgba(15,27,48,0.7)] dark:border-white/[0.07]
          shadow-[0_8px_32px_rgba(0,0,0,0.06)]
          dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          overflow-hidden"
      >
        {/* Hero image */}
        {imgSrc && (
          <div className="w-full aspect-16/7 overflow-hidden bg-slate-100 dark:bg-white/5">
            <img
              src={imgSrc}
              alt={item.title}
              className="w-full h-full object-fit"
            />
          </div>
        )}

        <div style={{ padding: "28px 32px 36px" }}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Tag postType={item.post_type} />

            <span className="flex items-center gap-1.5 text-[12px] text-slate-400/80 dark:text-white/35">
              <Clock size={12} />
              {formatDateTime(item.post_time)}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-bold leading-[1.35] text-slate-900 dark:text-white/92 m-0 text-[clamp(18px,3vw,24px)] mb-6">
            {item.title}
          </h1>

          <div className="h-px bg-slate-200 dark:bg-white/7 mb-6" />

          {/* Content */}
          <div className="flex flex-col">{renderContent(item.content)}</div>

          {/* Attachments / link */}
          {(item.file_news || item.link_url) && (
            <div
              className="flex flex-col gap-3 rounded-xl border
                bg-slate-50 border-slate-200 p-4 mt-7
                dark:bg-white/4 dark:border-white/7"
            >
              <p
                className="text-[12px] font-semibold uppercase tracking-wider m-0
                text-slate-400 dark:text-white/35"
              >
                Đính kèm
              </p>

              {item.file_news && (
                <a
                  href={`${IMAGE_BASE}${item.file_news}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[13px] font-medium
                    text-blue-600 dark:text-blue-400
                    hover:text-blue-700 dark:hover:text-blue-300
                    transition-colors duration-150 no-underline"
                >
                  <FileText size={14} />
                  Tải tài liệu đính kèm
                </a>
              )}

              {item.link_url && (
                <a
                  href={item.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[13px] font-medium
                    text-blue-600 dark:text-blue-400
                    hover:text-blue-700 dark:hover:text-blue-300
                    transition-colors duration-150 no-underline"
                >
                  <ExternalLink size={14} />
                  {item.link_url}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes detailFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
