export type NodeId =
  | 'payroll_pull' | 'ocr_slip' | 'ocr_mutasi' | 'doc_validation'
  | 'fraud_screening' | 'doc_classification' | 'identity_ocr'
  | 'liveness_selfie' | 'slik_retrieval' | 'income_extraction' | 'thp_computation';

export type NodeStatus = 'idle' | 'running' | 'success' | 'failed';
export type NodeLeg = 'nasabah' | 'pasangan';
export type NodeGroup = 'payroll' | 'ocr' | 'fraud' | 'identity' | 'slik' | 'income' | 'thp';

export interface NodeSpec { nodeId: NodeId; leg: NodeLeg; label: string; group: NodeGroup; }

export interface OrchestrationEvent {
  nodeId: NodeId; leg: NodeLeg; status: NodeStatus; label: string;
  progress?: number; confidence?: number; reasoning?: string; output?: unknown; ts: number;
}

/** Unique key for a node instance (a node id can appear on both legs). */
export const nodeKey = (leg: NodeLeg, id: NodeId) => `${leg}:${id}`;
