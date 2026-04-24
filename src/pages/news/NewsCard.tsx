import { ArrowRight, Clock, Newspaper } from "lucide-react";
import type { NewsCardProps } from "../../types/news";
import { formatTime } from "../../libs/helper";
import { Tag } from "./Tag";

const IMAGE_BASE = import.meta.env.VITE_NEWS_IMG_URL ?? "";

export function NewsCard({
  item,
  onSelect,
  horizontal = false,
}: NewsCardProps) {
  const imgSrc = item.image_news ? `${IMAGE_BASE}${item.image_news}` : null;

  if (horizontal) {
    return (
      <article
        className="flex gap-3 rounded-2xl overflow-hidden cursor-pointer group
          transition-all duration-200 p-3
          bg-white/4 border border-white/7 hover:border-blue-400/30
          dark:bg-white/4 dark:border-white/[0.07] dark:hover:border-blue-400/30
          hover:shadow-[0_4px_24px_rgba(59,130,246,0.1)]"
        onClick={() => onSelect(item)}
      >
        <div className="w-24 h-[72px] rounded-xl overflow-hidden shrink-0 bg-slate-200/20 dark:bg-white/5">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Newspaper
                size={22}
                className="text-slate-400/40 dark:text-white/20"
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-[11px] text-slate-400/70 dark:text-white/35 shrink-0">
              <Clock size={10} />
              {formatTime(item.post_time)}
            </span>
          </div>
          <h3
            className="text-[13px] font-semibold leading-snug line-clamp-2
            text-slate-800/90 dark:text-white/88 group-hover:text-blue-600 dark:group-hover:text-blue-300
            transition-colors duration-150 m-0"
          >
            {item.title}
          </h3>
          <button
            className="self-start flex items-center gap-1 text-[12px] font-semibold
              text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300
              transition-colors duration-150 bg-transparent border-none cursor-pointer"
            style={{ padding: 0 }}
          >
            Read More <ArrowRight size={11} />
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      className="flex flex-col rounded-2xl overflow-hidden cursor-pointer group
        transition-all duration-200
        border
        bg-white border-slate-200/70 hover:border-blue-400/50
        dark:bg-[rgba(15,27,48,0.6)] dark:border-white/[0.07] dark:hover:border-blue-400/30
        hover:shadow-[0_8px_32px_rgba(59,130,246,0.10)]
        dark:hover:shadow-[0_8px_32px_rgba(59,130,246,0.12)]
        hover:-translate-y-0.5"
      onClick={() => onSelect(item)}
    >
      <div className="relative w-full aspect-16/10 overflow-hidden bg-slate-100 dark:bg-white/5">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper
              size={36}
              className="text-slate-300 dark:text-white/15"
            />
          </div>
        )}
      </div>

      <div
        className="flex flex-col flex-1 gap-2"
        style={{ padding: "14px 16px 16px" }}
      >
        <div className="flex items-center justify-between gap-1.5 text-[11px] text-slate-400/70 dark:text-white/35">
          <div className="flex gap-1 items-center">
            <Clock size={11} />
            {formatTime(item.post_time)}
          </div>

          <div>
            <Tag postType={item.post_type} />
          </div>
        </div>

        <h3
          className="text-[14px] font-bold leading-snug line-clamp-2
          text-slate-800/90 dark:text-white/88
          group-hover:text-blue-600 dark:group-hover:text-blue-300
          transition-colors duration-150 m-0 flex-1"
        >
          {item.title}
        </h3>

        {/* <button
          className="self-start flex items-center gap-1 text-[12px] font-semibold
            text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300
            transition-colors duration-150 bg-transparent border-none cursor-pointer mt-1"
          style={{ padding: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
        >
          Read More <ArrowRight size={11} />
        </button> */}
      </div>
    </article>
  );
}
