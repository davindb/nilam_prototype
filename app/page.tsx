"use client";

import { AppShell } from "@/components/layout/AppShell";
import { MobileApp } from "@/components/mobile/MobileApp";
import { useNilamFlow } from "@/hooks/useNilamFlow";

/** Placeholder slot rendered while the real dashboard panels are built in passes 4–6. */
function DashboardPlaceholder() {
  return (
    <div className="grid h-full place-items-center rounded-xl border border-dashed border-nx-line bg-white/50 text-nx-muted">
      Dashboard (Unit 4–6)
    </div>
  );
}

export default function Page() {
  const flow = useNilamFlow();

  return (
    <AppShell
      onReset={flow.reset}
      mobile={
        <MobileApp
          persona={flow.persona}
          currentStep={flow.currentStep}
          canGoBack={flow.canGoBack}
          uploads={flow.uploads}
          start={flow.start}
          next={flow.next}
          goBack={flow.goBack}
          setUpload={flow.setUpload}
          submit={flow.submit}
          reset={flow.reset}
        />
      }
      dashboard={<DashboardPlaceholder />}
    />
  );
}
