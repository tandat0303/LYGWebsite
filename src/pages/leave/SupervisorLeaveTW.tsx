import { useState, useRef } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TaiwanSummary {
  // Home Leave
  homeLeave_total: number;
  homeLeave_usedApproved: number;
  homeLeave_usedPending: number;
  homeLeave_remaining: number;

  // Annual Leave periods
  annualLeave_periods: Array<{
    label: string; // e.g. "Period 1 (After 9 yr.) 2025-07-22 ~ 2026-07-21"
    total: number; // days
    usedApproved: number;
    usedPending: number;
    remaining: number;
  }>;

  // Annual Tickets
  tickets_total: number;
  tickets_used: number;
  tickets_pending: number;
  tickets_remaining: number;
}

export interface LeaveRecord {
  id: string; // "Leave #2"
  status: "Approved" | "Pending" | "Rejected";
  dateRange: string; // "2026-04-25 ~ 2026-05-06"
  type: string; // "Home Leave"
  days: number;
}

interface Props {
  summary: TaiwanSummary;
  records: LeaveRecord[];
  year: string;
  onYearChange: (y: string) => void;
  loading?: boolean;
}

// ─── YearPicker ──────────────────────────────────────────────────────────────

function YearPicker({
  year,
  onChange,
}: {
  year: string;
  onChange: (y: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  const today = new Date();
  const years = Array.from(
    { length: 11 },
    (_, i) => today.getFullYear() - 5 + i,
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span
          style={{
            color: "rgba(180,200,255,0.6)",
            fontWeight: 500,
            fontSize: 13,
          }}
        >
          Year
        </span>
        <span
          style={{
            borderLeft: "1px solid rgba(255,255,255,0.15)",
            paddingLeft: 8,
          }}
        >
          {year}
        </span>
        <ChevronDown
          size={14}
          style={{
            opacity: 0.5,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 50,
            background: "rgba(18,28,52,0.98)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: 8,
            minWidth: 180,
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 4,
          }}
        >
          {years.map((y) => (
            <button
              key={y}
              onClick={() => {
                onChange(String(y));
                setOpen(false);
              }}
              style={{
                padding: "6px 0",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                background: String(y) === year ? "#3b82f6" : "transparent",
                color: String(y) === year ? "#fff" : "rgba(255,255,255,0.6)",
              }}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "18px 20px",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#3b82f6",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── Remaining box ────────────────────────────────────────────────────────────

function RemainingBox({
  value,
  unit = "Days",
}: {
  value: number;
  unit?: string;
}) {
  return (
    <div
      style={{
        background: "rgba(59,130,246,0.12)",
        border: "1.5px solid rgba(59,130,246,0.3)",
        borderRadius: 12,
        padding: "12px 16px",
        minWidth: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
          fontWeight: 500,
          marginBottom: 2,
        }}
      >
        Remaining
      </span>
      <span
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "#60a5fa",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
          fontWeight: 500,
          marginTop: 2,
        }}
      >
        {unit}
      </span>
    </div>
  );
}

// ─── Row stat ─────────────────────────────────────────────────────────────────

function StatRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
      }}
    >
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: accent ? "#60a5fa" : "rgba(255,255,255,0.85)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Home Leave section ───────────────────────────────────────────────────────

function HomeLeaveSec({ data }: { data: TaiwanSummary }) {
  return (
    <SectionCard title="Home Leave">
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <RemainingBox value={data.homeLeave_remaining} />
        <div style={{ flex: 1 }}>
          <StatRow
            label="Total"
            value={`${data.homeLeave_total} Days`}
            accent
          />
          <StatRow
            label="Used (Approved)"
            value={`${data.homeLeave_usedApproved} Days`}
            accent
          />
          <StatRow
            label="Used (Pending)"
            value={`${data.homeLeave_usedPending} Days`}
            accent
          />
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Annual Leave section ─────────────────────────────────────────────────────

function AnnualLeaveSec({ data }: { data: TaiwanSummary }) {
  return (
    <SectionCard title="Annual Leave">
      {data.annualLeave_periods.map((p, idx) => (
        <div key={idx}>
          {idx > 0 && (
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                margin: "14px 0",
              }}
            />
          )}
          <p
            style={{
              fontSize: 11.5,
              color: "rgba(255,255,255,0.35)",
              margin: "0 0 10px",
            }}
          >
            {p.label}
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <RemainingBox value={p.remaining} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                  textAlign: "center",
                }}
              >
                {[
                  { label: "Total", value: `${p.total}d` },
                  { label: "Used (Approved)", value: `${p.usedApproved}d` },
                  { label: "Used (Pending)", value: `${p.usedPending}d` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.35)",
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

// ─── Annual Tickets section ───────────────────────────────────────────────────

function AnnualTicketsSec({ data }: { data: TaiwanSummary }) {
  return (
    <SectionCard title="Annual Tickets">
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <RemainingBox value={data.tickets_remaining} unit="tickets" />
        <div style={{ flex: 1 }}>
          <StatRow
            label="Total"
            value={`${data.tickets_total} tickets`}
            accent
          />
          <StatRow label="Used" value={`${data.tickets_used} tickets`} accent />
          <StatRow
            label="Pending"
            value={`${data.tickets_pending} tickets`}
            accent
          />
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Leave record item ────────────────────────────────────────────────────────

const STATUS_STYLE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  Approved: {
    bg: "rgba(34,197,94,0.12)",
    color: "#4ade80",
    border: "rgba(34,197,94,0.25)",
  },
  Pending: {
    bg: "rgba(251,191,36,0.12)",
    color: "#fbbf24",
    border: "rgba(251,191,36,0.25)",
  },
  Rejected: {
    bg: "rgba(239,68,68,0.12)",
    color: "#f87171",
    border: "rgba(239,68,68,0.25)",
  },
};

function LeaveRecordItem({ record }: { record: LeaveRecord }) {
  const s = STATUS_STYLE[record.status] ?? STATUS_STYLE.Pending;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 14,
        cursor: "pointer",
      }}
    >
      <div style={{ minWidth: 70 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            marginBottom: 4,
          }}
        >
          {record.id}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: s.bg,
            color: s.color,
            border: `1px solid ${s.border}`,
            borderRadius: 6,
            padding: "2px 8px",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {record.status === "Approved" && <Check size={10} strokeWidth={3} />}
          {record.status}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.75)",
            marginBottom: 2,
          }}
        >
          {record.dateRange}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          {record.type} ({record.days} Days)
        </div>
      </div>
      <ChevronRight
        size={16}
        style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SupervisorLeaveTW({
  summary,
  records,
  year,
  onYearChange,
  loading,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        boxSizing: "border-box",
        padding: "20px 16px",
        background: "#0d1628",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: 4,
          }}
        >
          ←
        </button>
        <YearPicker year={year} onChange={onYearChange} />
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 120,
                borderRadius: 16,
                background: "rgba(255,255,255,0.05)",
              }}
            />
          ))}
        </div>
      ) : (
        <>
          <HomeLeaveSec data={summary} />
          <AnnualLeaveSec data={summary} />
          <AnnualTicketsSec data={summary} />

          <div style={{ marginTop: 8 }}>
            {records.map((r) => (
              <LeaveRecordItem key={r.id} record={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
