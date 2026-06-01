import type { OrchestrationEvent } from "@/types/orchestration";
export type EventListener = (e: OrchestrationEvent) => void;
export class EventEmitter {
  private listeners = new Set<EventListener>();
  subscribe(l: EventListener) { this.listeners.add(l); return () => { this.listeners.delete(l); }; }
  emit(e: OrchestrationEvent) { this.listeners.forEach((l) => l(e)); }
}
