import { describe, it, expect } from "vitest";
import { nilamReducer, initialState } from "./useNilamFlow";
import type { NilamState } from "./useNilamFlow";
import { planFlow } from "@/engines/persona/personaEngine";
import { personaById } from "@/data/personas";
import type { PersonaConfig } from "@/types/flow";
import type { OrchestrationEvent } from "@/types/orchestration";
import type { CustomerIncome } from "@/types/income";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePersona(id: string): PersonaConfig {
  const p = personaById(id);
  if (!p) throw new Error(`Unknown persona id: ${id}`);
  return p;
}

function makeIncome(role: "nasabah" | "pasangan"): CustomerIncome {
  return {
    role,
    name: role === "nasabah" ? "Nasabah" : "Pasangan",
    components: [
      { key: "Gaji", avg: 10_000_000, min: 10_000_000, mode: "avg", weight: 1 },
      { key: "THR", avg: 20_000_000, min: 20_000_000, mode: "avg", weight: 1 },
      { key: "Bonus", avg: 30_000_000, min: 10_000_000, mode: "avg", weight: 1 },
      { key: "Insentif", avg: 1_000_000, min: 1_000_000, mode: "avg", weight: 1 },
    ],
    angsuran: 2_500_000,
  };
}

function makeEvent(nodeId: string = "slik_retrieval"): OrchestrationEvent {
  return {
    nodeId: nodeId as OrchestrationEvent["nodeId"],
    leg: "nasabah",
    status: "running",
    label: "Test node",
    progress: 0.5,
    ts: Date.now(),
  };
}

// ---------------------------------------------------------------------------
// selectPersona
// ---------------------------------------------------------------------------

describe("nilamReducer — selectPersona", () => {
  it("sets persona, steps = planFlow(persona), stepIndex = 0", () => {
    const persona = makePersona("nonpayroll-joint");
    const state = nilamReducer(initialState(), { type: "selectPersona", persona });

    expect(state.persona).toBe(persona);
    expect(state.steps).toEqual(planFlow(persona));
    expect(state.stepIndex).toBe(0);
  });

  it("clears uploads, events, nasabah, pasangan on selectPersona", () => {
    const prior: NilamState = {
      ...initialState(),
      persona: makePersona("payroll-single"),
      steps: ["opening", "payroll_confirm", "processing", "submitted"],
      stepIndex: 2,
      uploads: { slip: true },
      events: [makeEvent()],
      nasabah: makeIncome("nasabah"),
      pasangan: makeIncome("pasangan"),
    };
    const persona = makePersona("nonpayroll-joint");
    const state = nilamReducer(prior, { type: "selectPersona", persona });

    expect(state.uploads).toEqual({});
    expect(state.events).toEqual([]);
    expect(state.nasabah).toBeUndefined();
    expect(state.pasangan).toBeUndefined();
  });

  it("nonpayroll-joint planFlow contains income_type, document_upload, joint_documents", () => {
    const persona = makePersona("nonpayroll-joint");
    const state = nilamReducer(initialState(), { type: "selectPersona", persona });

    expect(state.steps).toEqual([
      "opening",
      "income_type",
      "document_upload",
      "joint_documents",
      "processing",
      "submitted",
    ]);
  });

  it("payroll-single planFlow contains payroll_confirm but not income_type", () => {
    const persona = makePersona("payroll-single");
    const state = nilamReducer(initialState(), { type: "selectPersona", persona });

    expect(state.steps).toContain("payroll_confirm");
    expect(state.steps).not.toContain("income_type");
    expect(state.steps).not.toContain("document_upload");
  });
});

// ---------------------------------------------------------------------------
// next
// ---------------------------------------------------------------------------

describe("nilamReducer — next", () => {
  it("increments stepIndex by 1", () => {
    const persona = makePersona("payroll-single");
    const s0 = nilamReducer(initialState(), { type: "selectPersona", persona });
    expect(s0.stepIndex).toBe(0);

    const s1 = nilamReducer(s0, { type: "next" });
    expect(s1.stepIndex).toBe(1);

    const s2 = nilamReducer(s1, { type: "next" });
    expect(s2.stepIndex).toBe(2);
  });

  it("clamps at the last step index — does not go beyond steps.length - 1", () => {
    const persona = makePersona("payroll-single");
    // payroll-single: opening, payroll_confirm, processing, submitted → 4 steps, last idx = 3
    let state = nilamReducer(initialState(), { type: "selectPersona", persona });

    // Advance past the last step many times
    for (let i = 0; i < 10; i++) {
      state = nilamReducer(state, { type: "next" });
    }

    expect(state.stepIndex).toBe(state.steps.length - 1);
  });
});

// ---------------------------------------------------------------------------
// goBack
// ---------------------------------------------------------------------------

describe("nilamReducer — goBack", () => {
  it("decrements stepIndex by 1 from a normal step", () => {
    const persona = makePersona("payroll-single");
    const s0 = nilamReducer(initialState(), { type: "selectPersona", persona });
    const s1 = nilamReducer(s0, { type: "next" }); // stepIndex = 1
    const s2 = nilamReducer(s1, { type: "goBack" }); // stepIndex → 0

    expect(s2.stepIndex).toBe(0);
  });

  it("clamps at 0 — does not go negative", () => {
    const persona = makePersona("payroll-single");
    const s0 = nilamReducer(initialState(), { type: "selectPersona", persona });
    const s1 = nilamReducer(s0, { type: "goBack" });

    expect(s1.stepIndex).toBe(0);
  });

  it("does NOT clear events/nasabah/pasangan when leaving a normal step", () => {
    const persona = makePersona("payroll-single");
    let state = nilamReducer(initialState(), { type: "selectPersona", persona });
    state = nilamReducer(state, { type: "next" }); // stepIndex = 1 (payroll_confirm)
    state = { ...state, events: [makeEvent()], nasabah: makeIncome("nasabah") };

    const after = nilamReducer(state, { type: "goBack" });

    expect(after.events).toHaveLength(1);
    expect(after.nasabah).toBeDefined();
  });

  it("clears events, nasabah, pasangan when leaving 'processing' (rollback)", () => {
    const persona = makePersona("nonpayroll-joint");
    // Manually place state at 'processing' step
    const allSteps = planFlow(persona);
    const processingIdx = allSteps.indexOf("processing");

    const stateAtProcessing: NilamState = {
      persona,
      steps: allSteps,
      stepIndex: processingIdx,
      uploads: { slip: true },
      events: [makeEvent(), makeEvent("income_extraction")],
      nasabah: makeIncome("nasabah"),
      pasangan: makeIncome("pasangan"),
    };

    const after = nilamReducer(stateAtProcessing, { type: "goBack" });

    expect(after.events).toEqual([]);
    expect(after.nasabah).toBeUndefined();
    expect(after.pasangan).toBeUndefined();
    // uploads should be preserved (not part of rollback spec)
    expect(after.uploads).toEqual({ slip: true });
    // moved back one step
    expect(after.stepIndex).toBe(processingIdx - 1);
  });

  it("clears events, nasabah, pasangan when leaving 'submitted' (rollback)", () => {
    const persona = makePersona("payroll-single");
    const allSteps = planFlow(persona);
    const submittedIdx = allSteps.indexOf("submitted");

    const stateAtSubmitted: NilamState = {
      persona,
      steps: allSteps,
      stepIndex: submittedIdx,
      uploads: {},
      events: [makeEvent()],
      nasabah: makeIncome("nasabah"),
      pasangan: undefined,
    };

    const after = nilamReducer(stateAtSubmitted, { type: "goBack" });

    expect(after.events).toEqual([]);
    expect(after.nasabah).toBeUndefined();
    expect(after.pasangan).toBeUndefined();
    expect(after.stepIndex).toBe(submittedIdx - 1);
  });
});

// ---------------------------------------------------------------------------
// setComponent
// ---------------------------------------------------------------------------

describe("nilamReducer — setComponent", () => {
  function stateWithNasabah(): NilamState {
    return {
      ...initialState(),
      persona: makePersona("nonpayroll-single"),
      nasabah: makeIncome("nasabah"),
    };
  }

  it("updates the targeted component's mode immutably", () => {
    const before = stateWithNasabah();
    const after = nilamReducer(before, {
      type: "setComponent",
      role: "nasabah",
      key: "Gaji",
      patch: { mode: "min" },
    });

    const gajiAfter = after.nasabah?.components.find((c) => c.key === "Gaji");
    expect(gajiAfter?.mode).toBe("min");
  });

  it("leaves other components unchanged", () => {
    const before = stateWithNasabah();
    const after = nilamReducer(before, {
      type: "setComponent",
      role: "nasabah",
      key: "Gaji",
      patch: { mode: "min" },
    });

    const thrAfter = after.nasabah?.components.find((c) => c.key === "THR");
    expect(thrAfter?.mode).toBe("avg"); // unchanged
  });

  it("does not mutate the original state's component array", () => {
    const before = stateWithNasabah();
    const beforeComponents = before.nasabah!.components;

    nilamReducer(before, {
      type: "setComponent",
      role: "nasabah",
      key: "Gaji",
      patch: { mode: "min" },
    });

    // Original state array is untouched
    expect(beforeComponents.find((c) => c.key === "Gaji")?.mode).toBe("avg");
  });

  it("updates weight on the targeted component", () => {
    const before = stateWithNasabah();
    const after = nilamReducer(before, {
      type: "setComponent",
      role: "nasabah",
      key: "Bonus",
      patch: { weight: 0.5 },
    });

    const bonusAfter = after.nasabah?.components.find((c) => c.key === "Bonus");
    expect(bonusAfter?.weight).toBe(0.5);
  });

  it("is a no-op when the role has no income (pasangan not set)", () => {
    const before = stateWithNasabah(); // pasangan is undefined
    const after = nilamReducer(before, {
      type: "setComponent",
      role: "pasangan",
      key: "Gaji",
      patch: { mode: "min" },
    });

    expect(after).toBe(before); // returns original reference unchanged
  });
});

// ---------------------------------------------------------------------------
// reset
// ---------------------------------------------------------------------------

describe("nilamReducer — reset", () => {
  it("returns to initial state: persona null, steps=['opening'], stepIndex 0", () => {
    const populated: NilamState = {
      persona: makePersona("payroll-joint"),
      steps: ["opening", "payroll_confirm", "joint_documents", "processing", "submitted"],
      stepIndex: 3,
      uploads: { slip: true, mutasi: true },
      events: [makeEvent(), makeEvent()],
      nasabah: makeIncome("nasabah"),
      pasangan: makeIncome("pasangan"),
    };

    const after = nilamReducer(populated, { type: "reset" });

    expect(after.persona).toBeNull();
    expect(after.steps).toEqual(["opening"]);
    expect(after.stepIndex).toBe(0);
    expect(after.uploads).toEqual({});
    expect(after.events).toEqual([]);
    expect(after.nasabah).toBeUndefined();
    expect(after.pasangan).toBeUndefined();
  });

  it("does not mutate the original state object", () => {
    const before = initialState();
    const beforeRef = before;
    nilamReducer(before, { type: "reset" });
    expect(before).toBe(beforeRef); // original object unchanged
  });
});

// ---------------------------------------------------------------------------
// goTo
// ---------------------------------------------------------------------------

describe("nilamReducer — goTo", () => {
  it("jumps to the correct step index", () => {
    const persona = makePersona("nonpayroll-joint");
    const s0 = nilamReducer(initialState(), { type: "selectPersona", persona });

    const after = nilamReducer(s0, { type: "goTo", step: "processing" });
    const expectedIdx = s0.steps.indexOf("processing");
    expect(after.stepIndex).toBe(expectedIdx);
  });

  it("is a no-op for an absent step", () => {
    const persona = makePersona("payroll-single"); // no 'document_upload' in this flow
    const s0 = nilamReducer(initialState(), { type: "selectPersona", persona });

    const after = nilamReducer(s0, { type: "goTo", step: "document_upload" });
    expect(after.stepIndex).toBe(s0.stepIndex);
  });
});

// ---------------------------------------------------------------------------
// appendEvent + setIncome (basic sanity)
// ---------------------------------------------------------------------------

describe("nilamReducer — appendEvent", () => {
  it("appends events in order", () => {
    const e1 = makeEvent("payroll_pull");
    const e2 = makeEvent("slik_retrieval");

    let state = initialState();
    state = nilamReducer(state, { type: "appendEvent", event: e1 });
    state = nilamReducer(state, { type: "appendEvent", event: e2 });

    expect(state.events).toHaveLength(2);
    expect(state.events[0].nodeId).toBe("payroll_pull");
    expect(state.events[1].nodeId).toBe("slik_retrieval");
  });
});

describe("nilamReducer — setIncome", () => {
  it("sets nasabah income correctly", () => {
    const income = makeIncome("nasabah");
    const state = nilamReducer(initialState(), {
      type: "setIncome",
      leg: "nasabah",
      income,
    });

    expect(state.nasabah).toBe(income);
    expect(state.pasangan).toBeUndefined();
  });

  it("sets pasangan income correctly", () => {
    const income = makeIncome("pasangan");
    const state = nilamReducer(initialState(), {
      type: "setIncome",
      leg: "pasangan",
      income,
    });

    expect(state.pasangan).toBe(income);
    expect(state.nasabah).toBeUndefined();
  });
});
