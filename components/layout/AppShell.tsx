import type { ReactNode } from "react";
import { Smartphone, ClipboardList } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

interface AppShellProps {
  /** Phone-frame UI rendered in the narrow left column. */
  mobile: ReactNode;
  /** Behind-the-scene dashboard rendered in the wide right column. */
  dashboard: ReactNode;
  /** Called when the user clicks "Reset Flow" in the header. */
  onReset: () => void;
}

/**
 * Full-viewport, no-scroll layout shell — SOFIA/BRI design theme.
 *
 * Structure (top → bottom, 100vh):
 *   1. AppHeader  (~56px, white + shadow-soft)
 *   2. Sub-header row — section titles in bri-navy over the two columns
 *   3. Body row   — narrow left (≈300px) | wide right (flex-1)
 *   4. AppFooter  (~44px, white)
 *
 * The body row fills all remaining height via `flex-1 min-h-0` so neither
 * column overflows vertically. The left column is a flex-col so MobileApp
 * can use flex-1 for the phone and shrink-0 for the FlowStepper.
 */
export function AppShell({ mobile, dashboard, onReset }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#F5F7FA]">
      {/* ── 1. Header ────────────────────────────────────────────────── */}
      <AppHeader onReset={onReset} />

      {/* ── 2. Sub-header row: section titles aligned over columns ────── */}
      <div className="flex shrink-0 items-end gap-3 px-3 pb-1.5 pt-2">
        {/* Left title — sits above the ~300px mobile column */}
        <div className="flex w-[300px] shrink-0 items-center gap-2 pl-1">
          <Smartphone size={15} className="text-bri-navy" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-bri-navy">MOBILE APP</span>
          <span className="text-[10px] text-bri-muted">(Customer Journey)</span>
        </div>

        {/* Right title — sits above the flex-1 dashboard column */}
        <div className="flex min-w-0 flex-1 items-center gap-2 pl-1">
          <ClipboardList size={15} className="text-bri-navy" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-bri-navy">BEHIND THE SCENE LOGIC</span>
          <span className="text-[10px] text-bri-muted">(NILAM Engine)</span>
        </div>
      </div>

      {/* ── 3. Body row (fills remaining height, no scroll) ───────────── */}
      <div className="flex min-h-0 flex-1 gap-3 px-3 pb-2">
        {/* Narrow left — mobile / phone column
            flex-col so MobileApp can use flex-1 for phone + shrink-0 for stepper */}
        <div className="flex w-[300px] shrink-0 flex-col overflow-hidden rounded-card bg-white ring-1 ring-bri-line shadow-soft">
          {mobile}
        </div>

        {/* Wide right — dashboard / behind-the-scene column */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-card bg-white ring-1 ring-bri-line shadow-soft">
          {dashboard}
        </div>
      </div>

      {/* ── 4. Footer ────────────────────────────────────────────────── */}
      <AppFooter />
    </div>
  );
}
