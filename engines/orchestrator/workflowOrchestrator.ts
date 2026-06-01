import type { PersonaConfig } from "@/types/flow";
import type { NodeId } from "@/types/orchestration";
import { nodeKey } from "@/types/orchestration";
import { buildPipeline } from "./pipelines";
import type { EventListener } from "./events";
import { FRAUD_CONFIDENCE, LIVENESS_CONFIDENCE } from "@/engines/fraud/fraudEngine";

const REASONING: Partial<Record<NodeId, string>> = {
  payroll_pull: "Mengambil data payroll & profil internal nasabah dari core banking BRI…",
  ocr_slip: "Mendeteksi layout slip gaji, mengekstrak nominal Gaji pokok…",
  ocr_mutasi: "Mengelompokkan transaksi kredit: Gaji, THR, Bonus, Insentif (12 bulan)…",
  doc_validation: "Memverifikasi kelengkapan mutasi ≥ 12 bulan & konsistensi periode…",
  fraud_screening: "Memeriksa anomali, tampering metadata, dan konsistensi nominal…",
  doc_classification: "Mengklasifikasikan jenis dokumen & menilai kualitas citra…",
  identity_ocr: "Mengekstrak NIK, Nama, Gender, Tanggal Lahir dari KTP…",
  liveness_selfie: "Mencocokkan wajah selfie dengan foto KTP (liveness + face match)…",
  slik_retrieval: "Menarik data biro kredit (SLIK OJK) & menghitung total angsuran berjalan…",
  income_extraction: "Menstrukturkan komponen pendapatan menjadi nilai avg & min…",
  thp_computation: "Menghitung THP = Gaji + THR + Bonus + Insentif − Angsuran…",
};

export class WorkflowOrchestrator {
  private cancelled = false;

  cancel() {
    this.cancelled = true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Runs the persona's pipeline node-by-node, emitting lifecycle events.
   * `outputs` is keyed by nodeKey(leg, nodeId) and attached to each success event.
   * Cancellable: after cancel(), no further events are emitted.
   */
  async run(
    persona: PersonaConfig,
    outputs: Record<string, unknown>,
    emit: EventListener,
  ): Promise<void> {
    // Reset so each run() starts fresh; without this a cancelled instance is permanently dead.
    this.cancelled = false;
    const nodes = buildPipeline(persona);
    for (const node of nodes) {
      if (this.cancelled) return;
      const base = { nodeId: node.nodeId, leg: node.leg, label: node.label };

      emit({ ...base, status: "running", progress: 0.15, reasoning: REASONING[node.nodeId], ts: Date.now() });
      await this.delay(440);
      if (this.cancelled) return;

      emit({ ...base, status: "running", progress: 0.7, ts: Date.now() });
      await this.delay(360);
      if (this.cancelled) return;

      const confidence =
        node.group === "fraud" ? FRAUD_CONFIDENCE : node.group === "identity" ? LIVENESS_CONFIDENCE : undefined;
      emit({
        ...base,
        status: "success",
        progress: 1,
        confidence,
        output: outputs[nodeKey(node.leg, node.nodeId)],
        ts: Date.now(),
      });
      await this.delay(160);
    }
  }
}
