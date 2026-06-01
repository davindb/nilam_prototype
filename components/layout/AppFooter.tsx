import { Settings2, FileText, ShieldCheck, CircleDot, Database } from "lucide-react";

/** One status item in the footer. */
interface StatusItem {
  icon: React.ReactNode;
  label: string;
  statusText: string;
  statusColor?: string; // tailwind text class, defaults to text-nx-ok
}

const STATUS_ITEMS: StatusItem[] = [
  {
    icon: <Settings2 size={14} aria-hidden="true" />,
    label: "AI Model",
    statusText: "Active",
  },
  {
    icon: <FileText size={14} aria-hidden="true" />,
    label: "OCR Engine",
    statusText: "Active",
  },
  {
    icon: <ShieldCheck size={14} aria-hidden="true" />,
    label: "Fraud Detection",
    statusText: "Active",
  },
  {
    icon: <CircleDot size={14} aria-hidden="true" />,
    label: "SLIK Gateway",
    statusText: "Active",
  },
  {
    icon: <Database size={14} aria-hidden="true" />,
    label: "Database",
    statusText: "Connected",
  },
];

/**
 * Bottom footer bar matching the reference design:
 *  LEFT  — "SYSTEM STATUS" label + "All Systems Operational" green pill
 *  CENTER — evenly-spaced status items (icon + label + green status text)
 *  RIGHT  — "Last Update" + hardcoded timestamp "10:24:35"
 *
 * Height: ~44px (h-11). White background, top border.
 */
export function AppFooter() {
  return (
    <footer className="flex h-11 shrink-0 items-center border-t border-nx-line bg-nx-card px-4">
      {/* ── LEFT: System Status label + pill ───────────────────────── */}
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="text-xs font-bold tracking-wider text-nx-ink">SYSTEM STATUS</span>
        <span className="flex items-center gap-1.5 rounded-full bg-nx-okLight px-2.5 py-0.5 text-xs font-medium text-nx-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-nx-ok" aria-hidden="true" />
          All Systems Operational
        </span>
      </div>

      {/* ── CENTER: Status items (evenly spaced, fill remaining space) ─ */}
      <div className="flex flex-1 items-center justify-evenly px-4">
        {STATUS_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            {/* Icon in blue */}
            <span className="text-nx-blue">{item.icon}</span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-medium text-nx-ink">{item.label}</span>
              <span className="text-[10px] font-medium text-nx-ok">{item.statusText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── RIGHT: Last Update timestamp ────────────────────────────── */}
      <div className="flex shrink-0 flex-col items-end leading-tight">
        <span className="text-[10px] text-nx-muted">Last Update</span>
        <span className="text-xs font-semibold text-nx-ink">10:24:35</span>
      </div>
    </footer>
  );
}
