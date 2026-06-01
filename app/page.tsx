"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { BackButton } from "@/components/phone/ui/BackButton";
import { OpeningScreen } from "@/components/phone/screens/OpeningScreen";
import { IncomeTypeScreen } from "@/components/phone/screens/IncomeTypeScreen";
import { JointIncomeScreen } from "@/components/phone/screens/JointIncomeScreen";
import { RequirementNasabahScreen } from "@/components/phone/screens/RequirementNasabahScreen";
import { SpouseIdentityScreen } from "@/components/phone/screens/SpouseIdentityScreen";
import { SpouseConfirmScreen } from "@/components/phone/screens/SpouseConfirmScreen";
import { SpouseIncomeScreen } from "@/components/phone/screens/SpouseIncomeScreen";
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
    stepIndex,
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

  // Derive whether this is the last input step (next step is "processing")
  const isLast = steps[stepIndex + 1] === "processing";
  const proceed = isLast ? submit : next;
  const proceedLabel = isLast ? "Ajukan Aplikasi" : "Lanjutkan";

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

      case "joint_income":
        return (
          <motion.div
            key="joint_income"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <JointIncomeScreen isJoint={!!persona?.isJointIncome} onProceed={next} />
          </motion.div>
        );

      case "requirement_nasabah":
        return (
          <motion.div
            key="requirement_nasabah"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <RequirementNasabahScreen
              isPayroll={!!persona?.isPayrollBRI}
              uploads={uploads}
              onUpload={setUpload}
              onProceed={proceed}
              proceedLabel={proceedLabel}
            />
          </motion.div>
        );

      case "spouse_identity":
        return (
          <motion.div
            key="spouse_identity"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <SpouseIdentityScreen
              uploads={uploads}
              onUpload={setUpload}
              onCapture={() => setUpload("selfie")}
              onProceed={next}
            />
          </motion.div>
        );

      case "spouse_confirm":
        return (
          <motion.div
            key="spouse_confirm"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <SpouseConfirmScreen onProceed={submit} proceedLabel="Ajukan Aplikasi" />
          </motion.div>
        );

      case "spouse_income":
        return (
          <motion.div
            key="spouse_income"
            className="flex flex-1 flex-col overflow-hidden"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <SpouseIncomeScreen
              uploads={uploads}
              onUpload={setUpload}
              onProceed={submit}
              proceedLabel="Ajukan Aplikasi"
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
