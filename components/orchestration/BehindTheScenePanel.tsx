"use client";

import { Cpu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LiveIndicator } from "@/components/common/LiveIndicator";
import { SectionHeading } from "@/components/common/SectionHeading";
import { GlassCard } from "@/components/common/GlassCard";
import { PersonaSelector } from "./PersonaSelector";
import { PersonaSwitcher } from "./PersonaSwitcher";
import { JourneyFlowTracker } from "./JourneyFlowTracker";
import { PipelineNode } from "./PipelineNode";
import { OcrExtraction } from "./OcrExtraction";
import { FraudChecks } from "./FraudChecks";
import { SlikDetail } from "./SlikDetail";
import { IdentityFields } from "./IdentityFields";
import { ReasoningLog } from "./ReasoningLog";
import { buildPipeline } from "@/engines/orchestrator/pipelines";
import { useOrchestrationFeed } from "@/hooks/useOrchestrationFeed";
import { nodeKey } from "@/types/orchestration";
import type { FlowStep, PersonaConfig } from "@/types/flow";
import type { OrchestrationEvent, NodeLeg } from "@/types/orchestration";
import type { CustomerIncome } from "@/types/income";
import type { OcrMutasiResult, FraudResult, SlikResult, IdentityResult } from "@/types/engines";

// ---------------------------------------------------------------------------
// Animation constants — mirror SOFIA's staggered section pattern
// ---------------------------------------------------------------------------

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};
const SECTION_TRANSITION = { duration: 0.3, ease: "easeOut" } as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BehindTheScenePanelProps {
  persona: PersonaConfig | null;
  personas: PersonaConfig[];
  currentStep: FlowStep;
  steps: FlowStep[];
  events: OrchestrationEvent[];
  /** Structured income result for nasabah — produced after income_extraction succeeds. */
  nasabah?: CustomerIncome;
  /** Structured income result for pasangan — produced after income_extraction succeeds (joint only). */
  pasangan?: CustomerIncome;
  onSelectPersona: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Helper: get typed output from event map
// ---------------------------------------------------------------------------

function getOutput<T>(
  latest: Map<string, OrchestrationEvent>,
  leg: NodeLeg,
  nodeId: string
): T | undefined {
  return latest.get(nodeKey(leg, nodeId as Parameters<typeof nodeKey>[1]))?.output as T | undefined;
}

// ---------------------------------------------------------------------------
// Sub-section: idle pipeline preview (all nodes idle, no events)
// ---------------------------------------------------------------------------

function IdlePipelinePreview({ persona }: { persona: PersonaConfig }) {
  const specs = buildPipeline(persona);

  // Group specs by leg
  const nasabahSpecs = specs.filter((s) => s.leg === "nasabah");
  const pasanjanSpecs = specs.filter((s) => s.leg === "pasangan");
  const isJoint = pasanjanSpecs.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>Pipeline Mesin AI (Preview)</SectionHeading>
      <GlassCard className="px-4 py-3">
        <div className="flex flex-col gap-2">
          {isJoint && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-bri-blue">
              Nasabah
            </span>
          )}
          {nasabahSpecs.map((spec) => (
            <PipelineNode key={nodeKey(spec.leg, spec.nodeId)} spec={spec} status="idle" />
          ))}
          {isJoint && (
            <>
              <div className="my-1 border-t border-bri-line" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-bri-sky">
                Pasangan
              </span>
              {pasanjanSpecs.map((spec) => (
                <PipelineNode key={nodeKey(spec.leg, spec.nodeId)} spec={spec} status="idle" />
              ))}
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-section: live pipeline during processing
// ---------------------------------------------------------------------------

function LivePipeline({
  persona,
  events,
}: {
  persona: PersonaConfig;
  events: OrchestrationEvent[];
}) {
  const feed = useOrchestrationFeed(events);
  const specs = buildPipeline(persona);

  const nasabahSpecs = specs.filter((s) => s.leg === "nasabah");
  const pasanjanSpecs = specs.filter((s) => s.leg === "pasangan");
  const isJoint = pasanjanSpecs.length > 0;

  // Extract group-detail outputs
  const nasabahMutasi = getOutput<OcrMutasiResult>(feed.latest, "nasabah", "ocr_mutasi");
  const nasabahFraud = getOutput<FraudResult>(feed.latest, "nasabah", "fraud_screening");
  const nasabahSlik = getOutput<SlikResult>(feed.latest, "nasabah", "slik_retrieval");

  const pasanjanIdentity = getOutput<IdentityResult>(feed.latest, "pasangan", "identity_ocr");
  const pasanjanLiveness = getOutput<FraudResult>(feed.latest, "pasangan", "liveness_selfie");
  const pasanjanMutasi = getOutput<OcrMutasiResult>(feed.latest, "pasangan", "ocr_mutasi");
  const pasanjanFraud = getOutput<FraudResult>(feed.latest, "pasangan", "fraud_screening");
  const pasanjanSlik = getOutput<SlikResult>(feed.latest, "pasangan", "slik_retrieval");

  return (
    <div className="flex flex-col gap-3">
      <SectionHeading>Pipeline Mesin AI — Sedang Berjalan</SectionHeading>

      {/* Nasabah leg */}
      <GlassCard className="px-4 py-3">
        {isJoint && (
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-bri-blue">
            Nasabah
          </span>
        )}
        <div className="flex flex-col gap-2.5">
          {nasabahSpecs.map((spec) => (
            <PipelineNode
              key={nodeKey(spec.leg, spec.nodeId)}
              spec={spec}
              status={feed.statusOf(spec.leg, spec.nodeId)}
              event={feed.latest.get(nodeKey(spec.leg, spec.nodeId))}
            />
          ))}
        </div>

        {/* Interleaved group-detail components for nasabah */}
        {nasabahMutasi && (
          <div className="mt-3 border-t border-bri-line pt-3">
            <OcrExtraction mutasi={nasabahMutasi} />
          </div>
        )}
        {nasabahFraud && (
          <div className="mt-3 border-t border-bri-line pt-3">
            <FraudChecks result={nasabahFraud} title="Fraud Screening — Nasabah" />
          </div>
        )}
        {nasabahSlik && (
          <div className="mt-3 border-t border-bri-line pt-3">
            <SlikDetail result={nasabahSlik} />
          </div>
        )}
      </GlassCard>

      {/* Pasangan leg — only for joint personas */}
      {isJoint && (
        <GlassCard className="px-4 py-3">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-bri-sky">
            Pasangan
          </span>
          <div className="flex flex-col gap-2.5">
            {pasanjanSpecs.map((spec) => (
              <PipelineNode
                key={nodeKey(spec.leg, spec.nodeId)}
                spec={spec}
                status={feed.statusOf(spec.leg, spec.nodeId)}
                event={feed.latest.get(nodeKey(spec.leg, spec.nodeId))}
              />
            ))}
          </div>

          {/* Interleaved group-detail components for pasangan */}
          {pasanjanIdentity && (
            <div className="mt-3 border-t border-bri-line pt-3">
              <IdentityFields identity={pasanjanIdentity} />
            </div>
          )}
          {pasanjanLiveness && (
            <div className="mt-3 border-t border-bri-line pt-3">
              <FraudChecks result={pasanjanLiveness} title="Liveness — Selfie vs KTP" />
            </div>
          )}
          {pasanjanMutasi && (
            <div className="mt-3 border-t border-bri-line pt-3">
              <OcrExtraction mutasi={pasanjanMutasi} />
            </div>
          )}
          {pasanjanFraud && (
            <div className="mt-3 border-t border-bri-line pt-3">
              <FraudChecks result={pasanjanFraud} title="Fraud Screening — Pasangan" />
            </div>
          )}
          {pasanjanSlik && (
            <div className="mt-3 border-t border-bri-line pt-3">
              <SlikDetail result={pasanjanSlik} />
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-section: completed pipeline summary (submitted state)
// ---------------------------------------------------------------------------

function CompletedPipeline({ persona }: { persona: PersonaConfig }) {
  const specs = buildPipeline(persona);
  const nasabahSpecs = specs.filter((s) => s.leg === "nasabah");
  const pasanjanSpecs = specs.filter((s) => s.leg === "pasangan");
  const isJoint = pasanjanSpecs.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>Pipeline Selesai</SectionHeading>
      <GlassCard className="px-4 py-3">
        <div className="flex flex-col gap-2">
          {isJoint && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-bri-blue">
              Nasabah
            </span>
          )}
          {nasabahSpecs.map((spec) => (
            <PipelineNode
              key={nodeKey(spec.leg, spec.nodeId)}
              spec={spec}
              status="success"
            />
          ))}
          {isJoint && (
            <>
              <div className="my-1 border-t border-bri-line" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-bri-sky">
                Pasangan
              </span>
              {pasanjanSpecs.map((spec) => (
                <PipelineNode
                  key={nodeKey(spec.leg, spec.nodeId)}
                  spec={spec}
                  status="success"
                />
              ))}
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main container
// ---------------------------------------------------------------------------

/**
 * Phase 4 "Behind The Scene Logic" panel for NILAM.
 *
 * 760px tall, flex-col, overflow-hidden. Header mirrors SOFIA's Cpu badge +
 * title + LiveIndicator. Body has staggered AnimatePresence sections keyed on
 * currentStep + (persona?.id). Content adapts per step:
 *
 *  opening       → PersonaSelector only
 *  input steps   → JourneyFlowTracker + PersonaSwitcher + IdlePipelinePreview + idle ReasoningLog
 *  processing    → JourneyFlowTracker + PersonaSwitcher + LivePipeline (live nodes + group details) + ReasoningLog
 *  submitted     → JourneyFlowTracker (done) + CompletedPipeline + SlikDetail (Angsuran lineage) + Phase 5 placeholder
 */
export function BehindTheScenePanel({
  persona,
  personas,
  currentStep,
  steps,
  events,
  // nasabah and pasangan are accepted for Phase 5 CustomerCard / ThpEngineCard usage
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nasabah: _nasabah,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pasangan: _pasangan,
  onSelectPersona,
}: BehindTheScenePanelProps) {
  const feed = useOrchestrationFeed(events);
  const animKey = `${currentStep}-${persona?.id ?? "none"}`;

  const inputSteps: FlowStep[] = ["income_type", "payroll_confirm", "document_upload", "joint_documents"];

  return (
    <div className="flex h-[760px] w-full flex-col overflow-hidden rounded-card bg-white shadow-panel">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-bri-line px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bri-bg text-bri-blue">
            <Cpu size={16} strokeWidth={2.25} />
          </span>
          <h2 className="text-sm font-bold text-bri-navy">Behind The Scene Logic</h2>
        </div>
        <LiveIndicator />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Body                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="scroll-thin flex-1 overflow-y-auto px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="flex flex-col gap-5"
          >
            {/* ============================================================ */}
            {/* OPENING — persona selector only                               */}
            {/* ============================================================ */}
            {currentStep === "opening" && (
              <motion.div
                variants={SECTION_VARIANTS}
                transition={SECTION_TRANSITION}
              >
                <GlassCard className="px-5 py-5">
                  <PersonaSelector
                    personas={personas}
                    activeId={persona?.id}
                    onSelect={onSelectPersona}
                  />
                </GlassCard>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* INPUT STEPS — journey + switcher + idle pipeline preview       */}
            {/* ============================================================ */}
            {inputSteps.includes(currentStep) && persona && (
              <>
                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <GlassCard className="px-4 py-4">
                    <JourneyFlowTracker steps={steps} currentStep={currentStep} />
                  </GlassCard>
                </motion.div>

                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <div className="flex items-center justify-between">
                    <SectionHeading>Persona Aktif</SectionHeading>
                    <PersonaSwitcher
                      persona={persona}
                      personas={personas}
                      onSelect={onSelectPersona}
                    />
                  </div>
                </motion.div>

                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <IdlePipelinePreview persona={persona} />
                </motion.div>

                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <ReasoningLog events={[]} />
                </motion.div>
              </>
            )}

            {/* ============================================================ */}
            {/* PROCESSING — live pipeline + reasoning log                    */}
            {/* ============================================================ */}
            {currentStep === "processing" && persona && (
              <>
                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <GlassCard className="px-4 py-4">
                    <JourneyFlowTracker steps={steps} currentStep={currentStep} />
                  </GlassCard>
                </motion.div>

                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <div className="flex items-center justify-between">
                    <SectionHeading>Persona Aktif</SectionHeading>
                    <PersonaSwitcher
                      persona={persona}
                      personas={personas}
                      onSelect={onSelectPersona}
                    />
                  </div>
                </motion.div>

                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <LivePipeline persona={persona} events={events} />
                </motion.div>

                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <ReasoningLog events={events} />
                </motion.div>
              </>
            )}

            {/* ============================================================ */}
            {/* SUBMITTED — completed summary + SLIK lineage + Phase 5 slot   */}
            {/* ============================================================ */}
            {currentStep === "submitted" && persona && (
              <>
                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <GlassCard className="px-4 py-4">
                    <JourneyFlowTracker steps={steps} currentStep={currentStep} />
                  </GlassCard>
                </motion.div>

                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <CompletedPipeline persona={persona} />
                </motion.div>

                {/* SLIK detail stays visible to show Angsuran lineage */}
                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <GlassCard className="px-4 py-4">
                    <SlikDetail
                      result={
                        feed.latest.get(nodeKey("nasabah", "slik_retrieval"))?.output as
                          | SlikResult
                          | undefined
                      }
                    />
                  </GlassCard>
                </motion.div>

                {/* -------------------------------------------------------- */}
                {/* PHASE 5 placeholder: CustomerCard + ThpEngineCard          */}
                {/* -------------------------------------------------------- */}
                <motion.div variants={SECTION_VARIANTS} transition={SECTION_TRANSITION}>
                  <GlassCard className="px-4 py-4">
                    {/* PHASE 5: <CustomerCard/> + <ThpEngineCard/> mount here */}
                    <SectionHeading className="mb-3">
                      Hasil Asesmen Penghasilan
                    </SectionHeading>
                    <p className="text-xs text-bri-muted">
                      Hasil asesmen penghasilan (kartu interaktif menyusul pada Phase 5).
                    </p>
                  </GlassCard>
                </motion.div>
              </>
            )}

            {/* ============================================================ */}
            {/* No persona selected hint (opening, no persona yet)             */}
            {/* ============================================================ */}
            {currentStep === "opening" && !persona && (
              <motion.p
                variants={SECTION_VARIANTS}
                transition={SECTION_TRANSITION}
                className="px-2 text-center text-sm leading-relaxed text-bri-muted"
              >
                Pilih persona di atas untuk memulai simulasi NILAM.
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
