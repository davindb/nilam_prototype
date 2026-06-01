"use client";

import { useOrchestrationFeed } from "@/hooks/useOrchestrationFeed";
import { PERSONAS } from "@/data/personas";
import { SLIP_GAJI, MUTASI } from "@/data/ocrFixtures";
import type { PersonaConfig, FlowStep } from "@/types/flow";
import type { OrchestrationEvent } from "@/types/orchestration";
import type { FraudResult, IdentityResult, SlikResult } from "@/types/engines";
import type { CustomerIncome, ComponentKey, ComponentMode } from "@/types/income";
import { PersonaSelector } from "./PersonaSelector";
import { OrchestrationPipeline } from "./OrchestrationPipeline";
import { OcrProcessingCard } from "./OcrProcessingCard";
import { OcrJsonCard } from "./OcrJsonCard";
import { FraudDetectionCard } from "./FraudDetectionCard";
import { IdentityCheckCard } from "./IdentityCheckCard";
import { SlikRetrievalCard } from "./SlikRetrievalCard";
import { IncomeComponentsCard } from "./IncomeComponentsCard";
import { ThpEngineCard } from "./ThpEngineCard";

interface BehindTheSceneProps {
  persona: PersonaConfig | null;
  currentStep: FlowStep;
  events: OrchestrationEvent[];
  nasabah: CustomerIncome | undefined;
  pasangan: CustomerIncome | undefined;
  onSelectPersona: (id: string) => void;
  onReset: () => void;
  setComponentMode: (role: "nasabah" | "pasangan", key: ComponentKey, mode: ComponentMode) => void;
  setComponentWeight: (role: "nasabah" | "pasangan", key: ComponentKey, weight: number) => void;
}

/**
 * BehindTheScene — the full right-side "BEHIND THE SCENE LOGIC" dashboard panel.
 *
 * Fixed, no-scroll grid composed of three rows:
 *   ROW A: PersonaSelector | [OrchestrationPipeline / OCR cards]
 *   ROW B: Fraud · Identity · SLIK placeholders (Pass 5)
 *   ROW C: Income Nasabah · THP · Income Pasangan placeholders (Pass 6)
 */
export function BehindTheScene({
  persona,
  events,
  nasabah,
  pasangan,
  onSelectPersona,
  onReset,
  setComponentMode,
  setComponentWeight,
}: BehindTheSceneProps) {
  const { latest, statusOf } = useOrchestrationFeed(events);
  const ocrStatus = statusOf("ocr");

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      {/* ── ROW A ─────────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 gap-2">
        {/* Narrow left: persona selector */}
        <PersonaSelector
          personas={PERSONAS}
          activePersonaId={persona?.id ?? null}
          onSelect={onSelectPersona}
          onReset={onReset}
        />

        {/* Right column: pipeline + OCR cards stacked */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* AI Orchestration Pipeline — full width */}
          <OrchestrationPipeline statusOf={statusOf} />

          {/* OCR row: Processing (~40%) + JSON (~60%) */}
          <div className="flex gap-2">
            <div className="w-[40%] shrink-0">
              <OcrProcessingCard ocrStatus={ocrStatus} />
            </div>
            <div className="flex min-w-0 flex-1">
              <OcrJsonCard
                ocrStatus={ocrStatus}
                slip={SLIP_GAJI}
                mutasi={MUTASI}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW B — Fraud · Identity · SLIK (Pass 5) ─────────────────────── */}
      <div className="grid shrink-0 grid-cols-3 gap-2">
        <FraudDetectionCard
          status={statusOf("fraud")}
          result={latest.get("fraud")?.output as FraudResult | undefined}
        />
        <IdentityCheckCard
          status={statusOf("identity")}
          identity={latest.get("identity")?.output as IdentityResult | null | undefined}
          isJoint={!!persona?.isJointIncome}
        />
        <SlikRetrievalCard
          status={statusOf("slik")}
          slik={latest.get("slik")?.output as SlikResult | undefined}
        />
      </div>

      {/* ── ROW C — Income Nasabah · THP · Income Pasangan (Pass 6) ─────── */}
      <div className="grid shrink-0 grid-cols-3 gap-2">
        <IncomeComponentsCard
          title="INCOME COMPONENTS - NASABAH"
          income={nasabah}
          onMode={(k, m) => setComponentMode("nasabah", k, m)}
          onWeight={(k, w) => setComponentWeight("nasabah", k, w)}
        />
        <ThpEngineCard
          nasabah={nasabah}
          pasangan={pasangan}
          isJoint={!!persona?.isJointIncome}
        />
        <IncomeComponentsCard
          title="INCOME COMPONENTS - PASANGAN"
          income={pasangan}
          stripped={!persona?.isJointIncome}
          onMode={(k, m) => setComponentMode("pasangan", k, m)}
          onWeight={(k, w) => setComponentWeight("pasangan", k, w)}
        />
      </div>
    </div>
  );
}
