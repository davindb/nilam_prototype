"use client";

import { AppShell } from "@/components/layout/AppShell";
import { MobileApp } from "@/components/mobile/MobileApp";
import { BehindTheScene } from "@/components/dashboard/BehindTheScene";
import { useNilamFlow } from "@/hooks/useNilamFlow";

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
      dashboard={
        <BehindTheScene
          persona={flow.persona}
          currentStep={flow.currentStep}
          events={flow.events}
          nasabah={flow.nasabah}
          pasangan={flow.pasangan}
          onSelectPersona={flow.selectPersona}
          onReset={flow.reset}
          setComponentMode={flow.setComponentMode}
          setComponentWeight={flow.setComponentWeight}
        />
      }
    />
  );
}
