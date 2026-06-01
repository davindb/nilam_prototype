# NILAM Prototype

**New Intelligent Loan Application Management** — an interactive demo prototype
showcasing a modular, event-driven loan onboarding and income-assessment engine
built for BRI.

> Design docs: [`docs/plans/`](docs/plans/)

---

## What NILAM Is

NILAM is not a prettier form. It is a **governed, auditable, modular decision
pipeline** for income assessment and loan onboarding. The framework is
designed to be embeddable into BRImo, RM Tools, underwriting platforms, or
conversational AI — wherever a loan decision needs to be made.

This prototype demonstrates the engine internals visually, following the same
split-screen pattern as the SOFIA prototype that precedes it.

**Scope:** Fix Income customers only. Non-Fix Income is shown in the UI but is
disabled ("coming soon").

---

## The Split Screen

| Left | Right |
|---|---|
| Mobile app simulation — the customer's view of the loan onboarding flow | **Behind The Scene Logic** — real-time AI orchestration panel |

The right panel renders a live event-driven pipeline as it executes:
OCR extraction, fraud screening, SLIK bureau retrieval, income extraction,
and THP (Take Home Pay) computation. Every node emits lifecycle events
(`running → success`) with confidence scores and reasoning text, making the
underwriting decision **explainable** to RM and risk stakeholders.

**Key design note:** Angsuran (monthly debt obligation) is an **output of the
SLIK Retrieval engine** — it comes from the bureau pull, not OCR. This matches
how it works in production underwriting.

---

## The 4 Personas

| ID | Label | Flow Steps | Pipeline Nodes |
|---|---|---|---|
| `payroll-single` | Fix Income · Payroll BRI · Non-Joint | opening → payroll_confirm → processing → submitted | 3 nasabah nodes (payroll_pull, slik, income) + thp = **4** |
| `payroll-joint` | Fix Income · Payroll BRI · Joint | opening → payroll_confirm → joint_documents → processing → submitted | 4 nasabah + 7 pasangan nodes = **11** |
| `nonpayroll-single` | Fix Income · Non-Payroll · Non-Joint | opening → income_type → document_upload → processing → submitted | 7 nasabah nodes (ocr×3, fraud, slik, income) + thp = **8** |
| `nonpayroll-joint` | Fix Income · Non-Payroll · Joint | opening → income_type → document_upload → joint_documents → processing → submitted | 7 nasabah + 7 pasangan + thp = **15** |

**Payroll BRI** skips all document upload screens — payroll data is pulled
directly from BRI's core banking system (`payroll_pull` node).

**Joint income** adds a full pasangan (spouse) leg: KTP identity OCR,
liveness selfie verification, mutasi OCR, fraud screening, SLIK retrieval,
and income extraction. Joint also requires a `joint_documents` input step
where the customer uploads spouse documents.

---

## Module Map

```
engines/
  orchestrator/
    workflowOrchestrator.ts   Event-emitting async pipeline runner (per-node delay + cancellable)
    pipelines.ts              Builds NodeSpec[] per persona (payroll vs. non-payroll, joint vs. single)
    events.ts                 EventListener type contract
  ocr/                        OCR engine — extracts slip gaji & mutasi components
  fraud/                      Fraud screening & liveness engine (confidence-scored)
  slik/                       SLIK retrieval engine — produces totalAngsuran
  income/                     Income extraction engine — structures avg/min per component
  thp/                        THP computation engine — aggregates weighted income minus angsuran
  persona/
    personaEngine.ts          planFlow() — pure function; maps PersonaConfig → FlowStep[]

hooks/
  useNilamFlow.ts             Central state machine (useReducer) + orchestration kick
  useOrchestrationFeed.ts     Derives O(1) latest-event Map from raw OrchestrationEvent[]
  useCountUp.ts               Animated integer count-up; respects prefers-reduced-motion

components/
  phone/                      Left panel — mobile app simulation screens per FlowStep
  orchestration/              Right panel — BehindTheScenePanel, PipelineNode, CustomerCard,
                               IncomeComponentRow, ThpEngineCard, ConfidenceMeter, ...
  common/                     Shared primitives (GlassCard, SectionHeading, LiveIndicator, …)

data/
  personas.ts                 PERSONAS constant array
  ocrFixtures.ts              Mock OCR outputs (MUTASI, SLIP_GAJI, spouse variants, KTP_PASANGAN)
  slikFixtures.ts             Mock SLIK outputs (SLIK_NASABAH, SLIK_PASANGAN with totalAngsuran)

lib/
  formatRupiah.ts             Rupiah/juta formatters (handles negatives with proper − sign)
  cn.ts                       Tailwind class merger

types/
  flow.ts                     FlowStep, PersonaConfig
  orchestration.ts            OrchestrationEvent, NodeSpec, NodeLeg, NodeStatus, nodeKey()
  income.ts                   CustomerIncome, IncomeComponent, ComponentKey, ComponentMode
  engines.ts                  OcrMutasiResult, FraudResult, SlikResult, IdentityResult
```

---

## Running the App

```bash
npm install
npm run dev          # Development server → http://localhost:3000
npm test             # Vitest unit tests (engines: thpEngine, personaEngine)
npm run build        # Production build verification
```

---

## Simulated-Backend Disclaimer

All engines (`engines/`) return mock fixture data with simulated async
latency. No real APIs are called. No PII is processed. The SLIK figures,
OCR outputs, fraud scores, and confidence values are illustrative only and
are designed to demonstrate the pipeline structure and UI pattern — not to
represent actual credit bureau or bank data.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15.1.6 (App Router) |
| UI | React 19, TypeScript 5.7 |
| Styling | Tailwind CSS 3.4 (BRI design tokens) |
| Animation | Framer Motion 11 |
| Icons | lucide-react |
| Tests | Vitest 2 |

---

*NILAM Prototype — BRI Data Science · 2026*
