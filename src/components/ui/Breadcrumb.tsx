import { ChevronRight, Home } from "lucide-react";
import type { BreadcrumbItem } from "../../hooks/useBreadcrumb";
import { useTranslation } from "../../hooks/useTranslation";

interface BreadcrumbProps<T = unknown> {
  stack: BreadcrumbItem<T>[];
  onNavigate: (index: number) => void;
}

export default function Breadcrumb<T = unknown>({
  stack,
  onNavigate,
}: BreadcrumbProps<T>) {
  const { t } = useTranslation();

  const resolveLabel = (item: BreadcrumbItem<T>): string =>
    item.labelKey ? t(item.labelKey) : (item.label ?? "");

  if (stack.length <= 1) return null;

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center flex-wrap gap-0 mt-3"
    >
      {stack.map((item, index) => {
        const isLast = index === stack.length - 1;
        const isRoot = index === 0;
        const displayLabel = resolveLabel(item);

        return (
          <span key={index} className="flex items-center gap-0">
            {index > 0 && (
              <ChevronRight
                size={13}
                strokeWidth={2.5}
                className="mx-1 shrink-0 text-slate-300 dark:text-white/20"
                aria-hidden
              />
            )}

            {isLast ? (
              <span
                aria-current="page"
                className="flex items-center gap-1 text-[13px] font-semibold
                  text-slate-700 dark:text-white/85"
              >
                {isRoot && (
                  <Home
                    size={20}
                    strokeWidth={2.4}
                    className="shrink-0 opacity-70"
                  />
                )}
                {displayLabel}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate(index)}
                className="flex items-center gap-1 text-[13px] font-medium
                  bg-transparent border-0 cursor-pointer p-0 rounded
                  transition-colors duration-150
                  text-blue-600/70 dark:text-blue-300/55
                  hover:text-blue-600 dark:hover:text-blue-300
                  focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
              >
                {isRoot && (
                  <Home size={20} strokeWidth={2.4} className="shrink-0" />
                )}
                {displayLabel}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
