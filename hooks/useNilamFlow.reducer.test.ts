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

const UNIFORM_STEPS = ["opening", "income_type", "joint_income", "requirement", "processing", "analyst_decision"];

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
      { key: "Gaji",     avg: 10_000_000, min: 10_000_000, mode: "avg", weight: 1 },
      { key: "THR",      avg: 20_000_000, min: 20_000_000, mode: "avg", weight: 1 },
      { key: "Bonus",    avg: 30_000_000, min: 10_000_000, mode: "avg", weight: 1 },
      { key: "Insentif", avg: 1_000_000,  min: 1_000_000,  mode: "avg", weight: 1 },
    ],
    angsuran: 2_500_000,
  };
}

function makeEvent(nodeId: string = "slik"): OrchestrationEvent {
  return {
    nodeId: nodeId as OrchestrationEvent["nodeId"],
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
      steps: UNIFORM_STEPS,
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

  it("all personas produce the same 6-step uniform flow", () => {
    const personaIds = ["payroll-single", "payroll-joint", "nonpayroll-single", "nonpayroll-joint"];
    for (const id of personaIds) {
      const persona = makePersona(id);
      const state = nilamReducer(initialState(), { type: "selectPersona", persona });
      expect(state.steps).toEqual(UNIFORM_STEPS);
    }
  });

  it("nonpayroll-joint planFlow is the uniform 6-step flow", () => {
    const persona = makePersona("nonpayroll-joint");
    const state = nilamReducer(initialState(), { type: "selectPersona", persona });

    expect(state.steps).toEqual(UNIFORM_STEPS);
  });

  it("payroll-single planFlow is the uniform 6-step flow", () => {
    const persona = makePersona("payroll-single");
    const state = nilamReducer(initialState(), { type: "selectPersona", persona });

    expect(state.steps).toEqual(UNIFORM_STEPS);
    expect(state.steps).toContain("income_type");
    expect(state.steps).toContain("joint_income");
    expect(state.steps).toContain("requirement");
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

  it("clamps at the last step index (analyst_decision, idx=5) — does not go beyond", () => {
    const persona = makePersona("payroll-single");
    // uniform flow: 6 steps, last idx = 5
    let state = nilamReducer(initialState(), { type: "selectPersona", persona });

    // Advance past the last step many times
    for (let i = 0; i < 10; i++) {
      state = nilamReducer(state, { type: "next" });
    }

    expect(state.stepIndex).toBe(state.steps.length - 1);
    expect(state.steps[state.stepIndex]).toBe("analyst_decision");
  });
});

// ---------------------------------------------------------------------------
// goBack
// ---------------------------------------------------------------------------

describe("nilamReducer — goBack", () => {
  it("decrements stepIndex by 1 from a normal step", () => {
    const persona = makePersona("payroll-single");
    const s0 = nilamReducer(initialState(), { type: "selectPersona", persona });
    const s1 = nilamReducer(s0, { type: "next" }); // stepIndex = 1 (income_type)
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
    state = nilamReducer(state, { type: "next" }); // stepIndex = 1 (income_type)
    state = { ...state, events: [makeEvent()], nasabah: makeIncome("nasabah") };

    const after = nilamReducer(state, { type: "goBack" });

    expect(after.events).toHaveLength(1);
    expect(after.nasabah).toBeDefined();
  });

  it("clears events, nasabah, pasangan when leaving 'processing' (rollback)", () => {
    const persona = makePersona("nonpayroll-joint");
    const allSteps = planFlow(persona);
    const processingIdx = allSteps.indexOf("processing");

    const stateAtProcessing: NilamState = {
      persona,
      steps: allSteps,
      stepIndex: processingIdx,
      uploads: { slip: true },
      events: [makeEvent(), makeEvent("income")],
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

  it("clears events, nasabah, pasangan when leaving 'analyst_decision' (rollback)", () => {
    const persona = makePersona("payroll-single");
    const allSteps = planFlow(persona);
    const analystIdx = allSteps.indexOf("analyst_decision");

    const stateAtAnalyst: NilamState = {
      persona,
      steps: allSteps,
      stepIndex: analystIdx,
      uploads: {},
      events: [makeEvent()],
      nasabah: makeIncome("nasabah"),
      pasangan: undefined,
    };

    const after = nilamReducer(stateAtAnalyst, { type: "goBack" });

    expect(after.events).toEqual([]);
    expect(after.nasabah).toBeUndefined();
    expect(after.pasangan).toBeUndefined();
    expect(after.stepIndex).toBe(analystIdx - 1);
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
      steps: UNIFORM_STEPS,
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

  it("jumps to analyst_decision correctly", () => {
    const persona = makePersona("payroll-single");
    const s0 = nilamReducer(initialState(), { type: "selectPersona", persona });

    const after = nilamReducer(s0, { type: "goTo", step: "analyst_decision" });
    expect(after.stepIndex).toBe(5);
    expect(after.steps[after.stepIndex]).toBe("analyst_decision");
  });

  it("is a no-op for an absent step (submitted is no longer in flow)", () => {
    const persona = makePersona("payroll-single");
    const s0 = nilamReducer(initialState(), { type: "selectPersona", persona });

    // "submitted" no longer exists in the new flow
    const after = nilamReducer(s0, { type: "goTo", step: "submitted" as never });
    expect(after.stepIndex).toBe(s0.stepIndex);
  });
});

// ---------------------------------------------------------------------------
// appendEvent + setIncome (basic sanity)
// ---------------------------------------------------------------------------

describe("nilamReducer — appendEvent", () => {
  it("appends events in order", () => {
    const e1 = makeEvent("upload");
    const e2 = makeEvent("slik");

    let state = initialState();
    state = nilamReducer(state, { type: "appendEvent", event: e1 });
    state = nilamReducer(state, { type: "appendEvent", event: e2 });

    expect(state.events).toHaveLength(2);
    expect(state.events[0].nodeId).toBe("upload");
    expect(state.events[1].nodeId).toBe("slik");
  });
});

describe("nilamReducer — setIncome", () => {
  it("sets nasabah income correctly", () => {
    const income = makeIncome("nasabah");
    const state = nilamReducer(initialState(), {
      type: "setIncome",
      role: "nasabah",
      income,
    });

    expect(state.nasabah).toBe(income);
    expect(state.pasangan).toBeUndefined();
  });

  it("sets pasangan income correctly", () => {
    const income = makeIncome("pasangan");
    const state = nilamReducer(initialState(), {
      type: "setIncome",
      role: "pasangan",
      income,
    });

    expect(state.pasangan).toBe(income);
    expect(state.nasabah).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// setJointAnswer
// ---------------------------------------------------------------------------

describe("nilamReducer — setJointAnswer", () => {
  it("sets jointAnswer to 'ya'", () => {
    const state = nilamReducer(initialState(), { type: "setJointAnswer", answer: "ya" });
    expect(state.jointAnswer).toBe("ya");
  });

  it("sets jointAnswer to 'tidak'", () => {
    const state = nilamReducer(initialState(), { type: "setJointAnswer", answer: "tidak" });
    expect(state.jointAnswer).toBe("tidak");
  });

  it("can overwrite a previous jointAnswer", () => {
    let state = nilamReducer(initialState(), { type: "setJointAnswer", answer: "ya" });
    state = nilamReducer(state, { type: "setJointAnswer", answer: "tidak" });
    expect(state.jointAnswer).toBe("tidak");
  });
});
