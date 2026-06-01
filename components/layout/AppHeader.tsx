"use client";

import { RefreshCw } from "lucide-react";

interface AppHeaderProps {
  onReset: () => void;
}

/**
 * Top header bar matching the reference design:
 *  LEFT  — gradient logo cube + "NILAM" wordmark + divider + subtitle
 *  RIGHT — "Demo Mode" pill + "Reset Flow" button
 *
 * Height: ~56px (h-14). White background, bottom border.
 */
export function AppHeader({ onReset }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-nx-line bg-nx-card px-4">
      {/* ── LEFT: Logo + wordmark + subtitle ─────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Gradient cube logo — blue → indigo rounded square with inner cross */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)" }}
          aria-hidden="true"
        >
          {/* Stylised hex / snowflake mark — pure SVG, no extra dep */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer hexagon outline */}
            <path
              d="M9 1.5L15.5 5.25V12.75L9 16.5L2.5 12.75V5.25L9 1.5Z"
              stroke="white"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Inner cross spokes */}
            <line x1="9" y1="5" x2="9" y2="13" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="5" y1="7" x2="13" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="13" y1="7" x2="5" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            {/* Centre dot */}
            <circle cx="9" cy="9" r="1.2" fill="white" />
          </svg>
        </div>

        {/* Wordmark */}
        <span className="text-lg font-bold tracking-widest text-nx-ink">NILAM</span>

        {/* Thin vertical divider */}
        <span className="mx-1 h-5 w-px bg-nx-line" aria-hidden="true" />

        {/* Subtitle */}
        <span className="text-sm text-nx-muted">New Intelligent Loan Application Management</span>
      </div>

      {/* ── RIGHT: Demo Mode pill + Reset Flow button ──────────────────── */}
      <div className="flex items-center gap-2">
        {/* Demo Mode pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-nx-line bg-nx-card px-3 py-1 text-sm text-nx-ink">
          <span className="h-2 w-2 rounded-full bg-nx-ok" aria-hidden="true" />
          Demo Mode
        </div>

        {/* Reset Flow button */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-full border border-nx-line bg-nx-card px-3 py-1 text-sm text-nx-ink transition-colors hover:border-nx-blue hover:text-nx-blue"
        >
          <RefreshCw size={13} aria-hidden="true" />
          Reset Flow
        </button>
      </div>
    </header>
  );
}
