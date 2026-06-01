"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useNilamFlow } from "@/hooks/useNilamFlow";

/** Placeholder slot rendered while the real mobile phone UI is built in pass 3. */
function MobilePlaceholder() {
  return (
    <div className="grid h-full place-items-center rounded-xl border border-dashed border-nx-line bg-white/50 text-nx-muted">
      Mobile (Unit 3)
    </div>
  );
}

/** Placeholder slot rendered while the real dashboard panels are built in passes 4–6. */
function DashboardPlaceholder() {
  return (
    <div className="grid h-full place-items-center rounded-xl border border-dashed border-nx-line bg-white/50 text-nx-muted">
      Dashboard (Unit 4–6)
    </div>
  );
}

export default function Page() {
  const { reset } = useNilamFlow();

  return (
    <AppShell
      onReset={reset}
      mobile={<MobilePlaceholder />}
      dashboard={<DashboardPlaceholder />}
    />
  );
}
