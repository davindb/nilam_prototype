"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";

interface PersonaSelectorProps {
  persona: { nasabahPayroll: boolean; pasanganPayroll: boolean };
  onSetNasabahPayroll: (v: boolean) => void;
  onSetPasanganPayroll: (v: boolean) => void;
  onReset: () => void;
}

/**
 * PersonaSelector — narrow left strip of the "Behind The Scene" dashboard.
 *
 * Two segmented toggle groups:
 *   - Nasabah Utama: Payroll | Non-Payroll
 *   - Pasangan:      Payroll | Non-Payroll
 * + Reset Flow button at the bottom.
 */
export function PersonaSelector({
  persona,
  onSetNasabahPayroll,
  onSetPasanganPayroll,
  onReset,
}: PersonaSelectorProps) {
  return (
    <div className="flex w-[180px] shrink-0 flex-col rounded-xl border border-nx-line bg-white shadow-sm">
      {/* Section label */}
      <div className="px-2.5 pb-1 pt-2">
        <span className="text-[9px] font-bold uppercase tracking-widest text-nx-muted">
          Custom Persona
        </span>
        <p className="mt-0.5 text-[8px] leading-relaxed text-nx-muted/70">
          Atur tipe penghasilan nasabah &amp; pasangan
        </p>
      </div>

      {/* Toggle groups */}
      <div className="flex flex-1 flex-col gap-2.5 px-2.5 pb-2.5">
        {/* Nasabah Utama */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-semibold text-nx-ink">
            Nasabah Utama
          </span>
          <div className="flex overflow-hidden rounded-lg border border-nx-line bg-gray-50 p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => onSetNasabahPayroll(true)}
              className={cn(
                "flex-1 rounded-md py-1 text-[9px] font-semibold transition-all",
                persona.nasabahPayroll
                  ? "bg-nx-blue text-white shadow-sm"
                  : "text-nx-muted hover:text-nx-ink"
              )}
            >
              Payroll
            </button>
            <button
              type="button"
              onClick={() => onSetNasabahPayroll(false)}
              className={cn(
                "flex-1 rounded-md py-1 text-[9px] font-semibold transition-all",
                !persona.nasabahPayroll
                  ? "bg-nx-blue text-white shadow-sm"
                  : "text-nx-muted hover:text-nx-ink"
              )}
            >
              Non-Payroll
            </button>
          </div>
        </div>

        {/* Pasangan */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-semibold text-nx-ink">
            Pasangan
          </span>
          <div className="flex overflow-hidden rounded-lg border border-nx-line bg-gray-50 p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => onSetPasanganPayroll(true)}
              className={cn(
                "flex-1 rounded-md py-1 text-[9px] font-semibold transition-all",
                persona.pasanganPayroll
                  ? "bg-nx-blue text-white shadow-sm"
                  : "text-nx-muted hover:text-nx-ink"
              )}
            >
              Payroll
            </button>
            <button
              type="button"
              onClick={() => onSetPasanganPayroll(false)}
              className={cn(
                "flex-1 rounded-md py-1 text-[9px] font-semibold transition-all",
                !persona.pasanganPayroll
                  ? "bg-nx-blue text-white shadow-sm"
                  : "text-nx-muted hover:text-nx-ink"
              )}
            >
              Non-Payroll
            </button>
          </div>
        </div>
      </div>

      {/* Reset Flow button */}
      <div className="border-t border-nx-line px-2 py-1.5">
        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-medium text-nx-muted transition-colors hover:bg-gray-50 hover:text-nx-blue"
        >
          <RefreshCw size={10} />
          ↻ Reset Flow
        </button>
      </div>
    </div>
  );
}
