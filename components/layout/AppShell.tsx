import type { ReactNode } from "react";
import { ShowcaseHeader } from "./ShowcaseHeader";

interface AppShellProps {
  /** The phone-framed flow UI — rendered on the left, fixed width. */
  phone: ReactNode;
  /** The wide explainability / orchestration panel — rendered on the right, flex-1. */
  panel: ReactNode;
}

/**
 * Two-column showcase layout for NILAM.
 *
 * Renders the {@link ShowcaseHeader} on top and, below it, a horizontally
 * centered, wrap-aware row holding the phone (fixed width, `shrink-0`) on
 * the left and the panel (`flex-1`, `min-w-[480px]`) on the right.
 *
 * Mirrors the SOFIA AppShell structure (`max-w-[1400px]`, `gap-8`,
 * `bg-[#F5F7FA]`). Columns wrap onto multiple rows on narrow viewports.
 */
export function AppShell({ phone, panel }: AppShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#F5F7FA] px-4 py-10 sm:px-6">
      <ShowcaseHeader className="mb-10" />
      <div className="flex w-full max-w-[1400px] flex-1 flex-wrap items-start justify-center gap-8">
        <div className="shrink-0">{phone}</div>
        <div className="min-w-[480px] flex-1">{panel}</div>
      </div>
    </main>
  );
}
