"use client";

import { AppShell } from "@/components/layout/AppShell";
import { MobileApp } from "@/components/mobile/MobileApp";
import { BehindTheScene } from "@/components/dashboard/BehindTheScene";
import { useNilamFlow } from "@/hooks/useNilamFlow";

export default function Page() {
  const {
    persona,
    isJoint,
    currentStep,
    canGoBack,
    uploads,
    events,
    nasabah,
    pasangan,
    setNasabahPayroll,
    setPasanganPayroll,
    setJointAnswer,
    start,
    next,
    goBack,
    setUpload,
    submit,
    setComponentMode,
    setComponentWeight,
    reset,
  } = useNilamFlow();

  return (
    <AppShell
      mobile={
        <MobileApp
          persona={persona}
          isJoint={isJoint}
          currentStep={currentStep}
          canGoBack={canGoBack}
          uploads={uploads}
          start={start}
          next={next}
          goBack={goBack}
          setUpload={setUpload}
          setJointAnswer={setJointAnswer}
          submit={submit}
          reset={reset}
        />
      }
      dashboard={
        <BehindTheScene
          persona={persona}
          isJoint={isJoint}
          currentStep={currentStep}
          events={events}
          nasabah={nasabah}
          pasangan={pasangan}
          onSetNasabahPayroll={setNasabahPayroll}
          onSetPasanganPayroll={setPasanganPayroll}
          onReset={reset}
          setComponentMode={setComponentMode}
          setComponentWeight={setComponentWeight}
        />
      }
    />
  );
}
