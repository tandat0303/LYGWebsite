import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Building2, ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  options?: Option[];
  icon?: React.ReactNode;
}

export const CustomSelect = ({
  value,
  onChange,
  placeholder = "Select...",
  options = [],
  icon = <Building2 size={15} />,
}: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const dropH = Math.min(options.length * 44 + 12, 232);
    const spaceBelow = window.innerHeight - r.bottom;
    const spaceAbove = r.top;
    const openUp = spaceBelow < dropH && spaceAbove > spaceBelow;

    setDropStyle({
      position: "fixed",
      left: r.left,
      width: r.width,
      zIndex: 99999,
      ...(openUp
        ? { bottom: window.innerHeight - r.top + 6 }
        : { top: r.bottom + 6 }),
    });
  }, [options.length]);

  const handleOpen = () => {
    updatePos();
    setOpen((v) => !v);
  };

  // Reposition on scroll/resize — keep dropdown anchored to trigger
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open, updatePos]);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <div
      className={`lp-cselect${open ? " is-open" : ""}${selected ? " has-value" : ""}`}
    >
      <div
        ref={triggerRef}
        className="lp-cselect__trigger"
        onClick={handleOpen}
        role="combobox"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOpen();
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <span className="lp-cselect__icon">{icon}</span>
        <span
          className={`lp-cselect__value${!selected ? " is-placeholder" : ""}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className="lp-cselect__chevron" />
      </div>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="lp-cselect__dropdown"
            style={dropStyle}
          >
            <div className="lp-cselect__dropdown-inner">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  className={`lp-cselect__option${opt.value === value ? " is-selected" : ""}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(opt.value)}
                  role="option"
                  aria-selected={opt.value === value}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && (
                    <Check size={13} className="lp-cselect__check" />
                  )}
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
