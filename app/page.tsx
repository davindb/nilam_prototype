"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { BackButton } from "@/components/phone/ui/BackButton";
import { OpeningScreen } from "@/components/phone/screens/OpeningScreen";
import { IncomeTypeScreen } from "@/components/phone/screens/IncomeTypeScreen";
import { PayrollConfirmScreen } from "@/components/phone/screens/PayrollConfirmScreen";
import { DocumentUploadScreen } from "@/components/phone/screens/DocumentUploadScreen";
import { JointDocumentScreen } from "@/components/phone/screens/JointDocumentScreen";
import { ProcessingScreen } from "@/components/phone/screens/ProcessingScreen";
import { SubmittedScreen } from "@/components/phone/screens/SubmittedScreen";
import { useNilamFlow } from "@/hooks/useNilamFlow";
import { PERSONAS } from "@/data/personas";
import { cn } from "@/lib/cn";

/** Slide-x + fade transition variants for AnimatePresence screens. */
const slideVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

const slideTransition = { duration: 0.25 };

export default function Page() {
  const {
    persona,
    currentStep,
    canGoBack,
    uploads,
    events,
    selectPersona,
    start,
    next,
    goBack,
    setUpload,
    submit,
    reset,
  } = useNilamFlow();

  // -------------------------------------------------------------------------
  // Phone: screen switcher
  // -------------------------------------------------------------------------

  function renderScreen() {
    switch (currentStep) {
      case "opening":
        return (
          <motion.div
            key="opening"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <OpeningScreen personaSelected={!!persona} onStart={start} />
          </motion.div>
        );

      case "income_type":
        return (
          <motion.div
            key="income_type"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <IncomeTypeScreen onPickFix={next} />
          </motion.div>
        );

      case "payroll_confirm":
        return (
          <motion.div
            key="payroll_confirm"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <PayrollConfirmScreen onConfirm={submit} />
          </motion.div>
        );

      case "document_upload":
        return (
          <motion.div
            key="document_upload"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <DocumentUploadScreen
              uploads={uploads}
              onUpload={setUpload}
              onSubmit={persona?.isJointIncome ? next : submit}
              submitLabel={
                persona?.isJointIncome ? "Lanjut ke Dokumen Pasangan" : "Ajukan Aplikasi"
              }
            />
          </motion.div>
        );

      case "joint_documents":
        return (
          <motion.div
            key="joint_documents"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <JointDocumentScreen
              uploads={uploads}
              onUpload={setUpload}
              onCapture={() => setUpload("selfie")}
              onSubmit={submit}
            />
          </motion.div>
        );

      case "processing":
        return (
          <motion.div
            key="processing"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <ProcessingScreen />
          </motion.div>
        );

      case "submitted":
        return (
          <motion.div
            key="submitted"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <SubmittedScreen onRestart={reset} />
          </motion.div>
        );

      default:
        return null;
    }
  }

  // -------------------------------------------------------------------------
  // Phone column
  // -------------------------------------------------------------------------

  const phone = (
    <PhoneFrame>
      {/* Back button header — always reserves height so layout doesn't jump */}
      <div className="flex h-9 shrink-0 items-center px-5">
        {canGoBack && <BackButton onClick={goBack} />}
      </div>

      {/* Animated screen switcher */}
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </PhoneFrame>
  );

  // -------------------------------------------------------------------------
  // Panel column — TEMP persona selector for Phase 3 testability
  // {/* TEMP: replaced by real BehindTheScenePanel in Phase 4 */}
  // -------------------------------------------------------------------------

  const panel = (
    <div className="rounded-card bg-white p-6 shadow-panel ring-1 ring-bri-line">
      {/* TEMP: replaced by real BehindTheScenePanel in Phase 4 */}
      <h3 className="mb-1 text-base font-bold text-bri-navy">Behind The Scene Logic</h3>
      <p className="mb-5 text-xs text-bri-muted">
        Persona selector — pilih untuk memulai skenario aplikasi.
      </p>

      {/* Persona selector buttons */}
      <div className="mb-6 flex flex-col gap-2">
        {PERSONAS.map((p) => {
          const isActive = persona?.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPersona(p.id)}
              className={cn(
                "rounded-bubble px-4 py-3 text-left text-sm font-medium transition",
                "ring-1",
                isActive
                  ? "bg-bri-navy text-white ring-bri-navy shadow-soft"
                  : "bg-bri-bg text-bri-ink ring-bri-line hover:ring-bri-blue hover:bg-white"
              )}
            >
              <span className="font-semibold">{p.shortLabel}</span>
              <span
                className={cn(
                  "ml-2 text-xs",
                  isActive ? "text-bri-sky" : "text-bri-muted"
                )}
              >
                {p.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Debug info */}
      <div className="rounded-card bg-bri-bg px-4 py-3 ring-1 ring-bri-line">
        <p className="text-xs font-semibold uppercase tracking-wide text-bri-muted mb-2">
          Debug
        </p>
        <div className="space-y-1 text-xs text-bri-ink">
          <div className="flex justify-between">
            <span className="text-bri-muted">current step</span>
            <span className="font-mono font-semibold text-bri-navy">{currentStep}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bri-muted">events fired</span>
            <span className="font-mono font-semibold text-bri-navy">{events.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bri-muted">persona</span>
            <span className="font-mono font-semibold text-bri-navy">
              {persona?.id ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return <AppShell phone={phone} panel={panel} />;
}
