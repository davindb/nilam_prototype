import { Signal, Wifi, BatteryFull } from "lucide-react";

/**
 * Faux iOS-style status bar.
 *
 * Left: time 09:41 (static, as in design mockups).
 * Right: Signal, Wifi, BatteryFull icons.
 * Height: ~32px (py-2 + text-xs).
 */
export function PhoneStatusBar() {
  return (
    <div className="flex shrink-0 items-center justify-between px-5 py-2 text-xs text-bri-ink/70">
      <span className="font-semibold tracking-tight">09:41</span>
      <div className="flex items-center gap-1.5">
        <Signal size={14} strokeWidth={2} />
        <Wifi size={14} strokeWidth={2} />
        <BatteryFull size={14} strokeWidth={2} />
      </div>
    </div>
  );
}
