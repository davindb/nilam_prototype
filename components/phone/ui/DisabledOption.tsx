import { Lock } from "lucide-react";

interface DisabledOptionProps {
  label: string;
  sublabel?: string;
}

/**
 * A visibly disabled card with a lock badge and a "Segera hadir" pill.
 * Used to represent upcoming features that are not yet available.
 */
export function DisabledOption({ label, sublabel }: DisabledOptionProps) {
  return (
    <div className="flex cursor-not-allowed items-center gap-4 rounded-card bg-white p-4 opacity-60 ring-1 ring-bri-line shadow-soft">
      {/* Lock badge */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bri-bubble">
        <Lock size={18} strokeWidth={2} className="text-bri-muted" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-bri-ink">{label}</p>
        {sublabel && <p className="text-xs text-bri-muted">{sublabel}</p>}
      </div>
      <span className="shrink-0 rounded-pill bg-bri-bubble px-2.5 py-1 text-xs font-medium text-bri-muted">
        Segera hadir
      </span>
    </div>
  );
}
