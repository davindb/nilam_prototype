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
import { BehindTheScenePanel } from "@/components/orchestration/BehindTheScenePanel";
import { useNilamFlow } from "@/hooks/useNilamFlow";
import { PERSONAS } from "@/data/personas";

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
    steps,
    currentStep,
    canGoBack,
    uploads,
    events,
    nasabah,
    pasangan,
    selectPersona,
    start,
    next,
    goBack,
    setUpload,
    submit,
    reset,
    setComponentMode,
    setComponentWeight,
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
  // Panel column — Phase 4: BehindTheScenePanel
  // -------------------------------------------------------------------------

  const panel = (
    <BehindTheScenePanel
      persona={persona}
      personas={PERSONAS}
      currentStep={currentStep}
      steps={steps}
      events={events}
      nasabah={nasabah}
      pasangan={pasangan}
      onSelectPersona={selectPersona}
      setComponentMode={setComponentMode}
      setComponentWeight={setComponentWeight}
    />
  );

  return <AppShell phone={phone} panel={panel} />;
}
