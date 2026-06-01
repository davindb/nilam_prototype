"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import type { FlowStep, PersonaConfig } from "@/types/flow";
import type { OrchestrationEvent, NodeLeg } from "@/types/orchestration";
import { nodeKey } from "@/types/orchestration";
import type { CustomerIncome, ComponentKey, ComponentMode } from "@/types/income";
import type { EventListener } from "@/engines/orchestrator/events";
import { planFlow } from "@/engines/persona/personaEngine";
import { extractIncome } from "@/engines/income/incomeExtractionEngine";
import { WorkflowOrchestrator } from "@/engines/orchestrator/workflowOrchestrator";
import { screen, livenessMatch } from "@/engines/fraud/fraudEngine";
import { personaById } from "@/data/personas";
import { MUTASI, SLIP_GAJI, SPOUSE_MUTASI, SPOUSE_SLIP_GAJI, KTP_PASANGAN } from "@/data/ocrFixtures";
import { SLIK_NASABAH, SLIK_PASANGAN } from "@/data/slikFixtures";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface NilamState {
  persona: PersonaConfig | null;
  steps: FlowStep[];
  stepIndex: number;
  uploads: Record<string, boolean>;
  events: OrchestrationEvent[];
  nasabah?: CustomerIncome;
  pasangan?: CustomerIncome;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type NilamAction =
  | { type: "selectPersona"; persona: PersonaConfig }
  | { type: "next" }
  | { type: "goTo"; step: FlowStep }
  | { type: "goBack" }
  | { type: "setUpload"; key: string }
  | { type: "appendEvent"; event: OrchestrationEvent }
  | { type: "setIncome"; leg: NodeLeg; income: CustomerIncome }
  | { type: "setComponent"; role: NodeLeg; key: ComponentKey; patch: { mode?: ComponentMode; weight?: number } }
  | { type: "reset" };

// ---------------------------------------------------------------------------
// Initial state factory
// ---------------------------------------------------------------------------

export function initialState(): NilamState {
  return {
    persona: null,
    steps: ["opening"],
    stepIndex: 0,
    uploads: {},
    events: [],
    nasabah: undefined,
    pasangan: undefined,
  };
}

// ---------------------------------------------------------------------------
// Pure reducer — exported so it can be unit-tested in isolation
// ---------------------------------------------------------------------------

export function nilamReducer(state: NilamState, action: NilamAction): NilamState {
  switch (action.type) {
    case "selectPersona":
      return {
        ...initialState(),
        persona: action.persona,
        steps: planFlow(action.persona),
        stepIndex: 0,
      };

    case "next":
      return {
        ...state,
        stepIndex: Math.min(state.stepIndex + 1, state.steps.length - 1),
      };

    case "goTo": {
      const idx = state.steps.indexOf(action.step);
      if (idx === -1) return state;
      return { ...state, stepIndex: idx };
    }

    case "goBack": {
      const leavingStep = state.steps[state.stepIndex];
      const nextIndex = Math.max(state.stepIndex - 1, 0);
      const isRollingBack = leavingStep === "processing" || leavingStep === "submitted";
      return {
        ...state,
        stepIndex: nextIndex,
        // Rollback pipeline state when leaving processing or submitted
        ...(isRollingBack
          ? { events: [], nasabah: undefined, pasangan: undefined }
          : {}),
      };
    }

    case "setUpload":
      return { ...state, uploads: { ...state.uploads, [action.key]: true } };

    case "appendEvent":
      return { ...state, events: [...state.events, action.event] };

    case "setIncome":
      return {
        ...state,
        [action.leg === "nasabah" ? "nasabah" : "pasangan"]: action.income,
      };

    case "setComponent": {
      const field = action.role === "nasabah" ? "nasabah" : "pasangan";
      const customer = state[field];
      if (!customer) return state;
      return {
        ...state,
        [field]: {
          ...customer,
          components: customer.components.map((c) =>
            c.key === action.key ? { ...c, ...action.patch } : c
          ),
        },
      };
    }

    case "reset":
      return initialState();

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useNilamFlow() {
  const [state, dispatch] = useReducer(nilamReducer, undefined, initialState);

  // Holds the active orchestrator so we can cancel it on navigation or reset.
  const orchestratorRef = useRef<WorkflowOrchestrator | null>(null);

  // Cancel the current orchestrator and clear the ref so the `.then` guard
  // in submit() knows the run was abandoned.
  const cancelOrchestrator = useCallback(() => {
    orchestratorRef.current?.cancel();
    orchestratorRef.current = null;
  }, []);

  // Cancel on unmount to prevent dispatching to a stale component.
  useEffect(() => {
    return () => {
      cancelOrchestrator();
    };
  }, [cancelOrchestrator]);

  // Derived state
  const currentStep = state.steps[state.stepIndex];
  const canGoBack =
    state.stepIndex > 0 &&
    currentStep !== "processing" &&
    currentStep !== "submitted";

  // -------------------------------------------------------------------------
  // Public actions
  // -------------------------------------------------------------------------

  const selectPersona = useCallback(
    (id: string) => {
      const persona = personaById(id);
      if (!persona) return;
      cancelOrchestrator();
      dispatch({ type: "selectPersona", persona });
    },
    [cancelOrchestrator]
  );

  const start = useCallback(() => {
    dispatch({ type: "next" });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: "next" });
  }, []);

  const goBack = useCallback(() => {
    cancelOrchestrator();
    dispatch({ type: "goBack" });
  }, [cancelOrchestrator]);

  const setUpload = useCallback((key: string) => {
    dispatch({ type: "setUpload", key });
  }, []);

  const setComponentMode = useCallback(
    (role: NodeLeg, key: ComponentKey, mode: ComponentMode) => {
      dispatch({ type: "setComponent", role, key, patch: { mode } });
    },
    []
  );

  const setComponentWeight = useCallback(
    (role: NodeLeg, key: ComponentKey, weight: number) => {
      dispatch({ type: "setComponent", role, key, patch: { weight } });
    },
    []
  );

  const reset = useCallback(() => {
    cancelOrchestrator();
    dispatch({ type: "reset" });
  }, [cancelOrchestrator]);

  // -------------------------------------------------------------------------
  // submit() — orchestration kick
  // -------------------------------------------------------------------------

  const submit = useCallback(() => {
    // Snapshot persona at call time — reducer state captured via closure.
    // We must read state.persona from the latest render via a ref pattern,
    // but since submit() is called by user interaction (not inside an effect),
    // reading `state` directly from the useCallback closure is fine if we
    // accept the re-creation on every render. We use the "latest ref" pattern
    // to avoid stale closure issues without over-creating the callback.
    const persona = state.persona;
    if (!persona) return;

    // Build income values using SLIK totals for angsuran.
    const incomeN = extractIncome("nasabah", "Nasabah", MUTASI, SLIK_NASABAH.totalAngsuran);
    const incomeP = persona.isJointIncome
      ? extractIncome("pasangan", KTP_PASANGAN.Nama, SPOUSE_MUTASI, SLIK_PASANGAN.totalAngsuran)
      : undefined;

    // Build full outputs map — over-including is fine; orchestrator reads by key.
    const outputs: Record<string, unknown> = {
      [nodeKey("nasabah", "payroll_pull")]: { source: "BRI Payroll", mutasi: MUTASI },
      [nodeKey("nasabah", "ocr_slip")]: SLIP_GAJI,
      [nodeKey("nasabah", "ocr_mutasi")]: MUTASI,
      [nodeKey("nasabah", "fraud_screening")]: screen("dokumen nasabah"),
      [nodeKey("nasabah", "slik_retrieval")]: SLIK_NASABAH,
      [nodeKey("nasabah", "income_extraction")]: incomeN,
      [nodeKey("pasangan", "identity_ocr")]: KTP_PASANGAN,
      [nodeKey("pasangan", "liveness_selfie")]: livenessMatch(),
      [nodeKey("pasangan", "ocr_slip")]: SPOUSE_SLIP_GAJI,
      [nodeKey("pasangan", "ocr_mutasi")]: SPOUSE_MUTASI,
      [nodeKey("pasangan", "fraud_screening")]: screen("dokumen pasangan"),
      [nodeKey("pasangan", "slik_retrieval")]: SLIK_PASANGAN,
      [nodeKey("pasangan", "income_extraction")]: incomeP,
    };

    // Navigate to the processing step.
    dispatch({ type: "goTo", step: "processing" });

    // Create a fresh orchestrator and wire events.
    const orch = new WorkflowOrchestrator();
    orchestratorRef.current = orch;

    const emit: EventListener = (e) => {
      dispatch({ type: "appendEvent", event: e });
      // When income_extraction succeeds, persist the structured income result.
      if (e.status === "success" && e.nodeId === "income_extraction" && e.output) {
        dispatch({
          type: "setIncome",
          leg: e.leg,
          income: e.output as CustomerIncome,
        });
      }
    };

    // Run the pipeline. Only advance to `submitted` if this specific
    // orchestrator instance is still the active one — a cancel() + reset/back
    // sets orchestratorRef.current = null, so the guard below prevents a
    // cancelled run from silently advancing the flow.
    orch.run(persona, outputs, emit).then(() => {
      if (orchestratorRef.current === orch) {
        dispatch({ type: "goTo", step: "submitted" });
      }
    });
  // We intentionally include state.persona so submit() always uses the
  // current persona. The callback is re-created when persona changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.persona]);

  return {
    persona: state.persona,
    steps: state.steps,
    currentStep,
    stepIndex: state.stepIndex,
    canGoBack,
    uploads: state.uploads,
    events: state.events,
    nasabah: state.nasabah,
    pasangan: state.pasangan,
    selectPersona,
    start,
    next,
    goBack,
    setUpload,
    submit,
    setComponentMode,
    setComponentWeight,
    reset,
  };
}
