"use client";

import { useState } from "react";
import { FileText, CheckCircle2, Info, Loader2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { monthFromKey } from "@/engines/ocr/coverage";
import {
  SLIP_MONTHS_FULL,
  MUTASI_MONTHS_FULL,
} from "@/data/ocrFixtures";

interface RequirementScreenProps {
  nasabahPayroll: boolean;
  isJoint: boolean;
  pasanganPayroll: boolean;
  uploads: Record<string, boolean>;
  onUpload: (key: string, value?: boolean) => void;
  onSubmit: () => void;
  validating: boolean;
  onGoBack?: () => void;
  canGoBack?: boolean;
}

interface MultiUploadCardProps {
  docKey: string;
  title: string;
  /** Short helper line, e.g. "3 bulan terakhir · PDF/JPG/PNG". */
  hint: string;
  /** Month keys ("YYYY-MM") added as one batch on upload (one file/month). */
  monthKeys: string[];
  uploaded: boolean;
  onUpload: (key: string, value?: boolean) => void;
}

/**
 * Multi-file upload card — one file per month, in the field a customer may
 * provide several (3 slip gaji, up to 12 mutasi). Tapping "Upload File"
 * simulates a multi-file picker that adds the whole batch at once; the result
 * shows a count + per-month chips and can be cleared to re-upload. Stays clean
 * even at 12 files (compact month chips that wrap).
 */
function MultiUploadCard({ docKey, title, hint, monthKeys, uploaded, onUpload }: MultiUploadCardProps) {
  const [files, setFiles] = useState<string[]>(() => (uploaded ? monthKeys : []));
  const hasFiles = files.length > 0;

  function uploadBatch() {
    setFiles(monthKeys);
    onUpload(docKey, true);
  }
  function clearAll() {
    setFiles([]);
    onUpload(docKey, false);
  }

  return (
    <div
      className={cn(
        "w-full rounded-xl border p-2.5 transition-all",
        hasFiles ? "border-emerald-200 bg-emerald-50/60" : "border-bri-line bg-white"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            hasFiles ? "bg-emerald-100 text-emerald-600" : "bg-bri-bg text-bri-blue"
          )}
        >
          <FileText size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[10px] font-semibold text-bri-ink">{title}</p>
            {hasFiles && (
              <span className="shrink-0 rounded-pill bg-emerald-100 px-1.5 py-px text-[8px] font-semibold text-emerald-700">
                {files.length} file
              </span>
            )}
          </div>
          <p className="text-[8px] text-bri-muted">{hint}</p>
        </div>
        {hasFiles && <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />}
      </div>

      {hasFiles ? (
        <>
          {/* Per-month chips */}
          <div className="mt-2 flex flex-wrap gap-1">
            {files.map((k) => (
              <span
                key={k}
                className="rounded bg-white px-1.5 py-0.5 text-[8px] font-medium leading-none text-bri-ink ring-1 ring-emerald-200"
              >
                {monthFromKey(k).label}
              </span>
            ))}
          </div>
          {/* Clear action */}
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 text-[8px] font-medium text-bri-muted transition-colors hover:text-red-500"
            >
              <X size={9} /> Hapus semua
            </button>
          </div>
        </>
      ) : (
        /* Empty → dropzone */
        <button
          type="button"
          onClick={uploadBatch}
          className="mt-2 flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-bri-blue/50 bg-bri-bg/40 py-2.5 text-bri-blue transition-colors hover:bg-bri-bg active:scale-[0.99]"
        >
          <UploadCloud size={16} />
          <span className="text-[9px] font-semibold">Upload File</span>
          <span className="text-[7px] text-bri-muted">Bisa pilih lebih dari 1 file</span>
        </button>
      )}
    </div>
  );
}

function PayrollConfirmCard({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
        <CheckCircle2 size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-[10px] font-semibold text-emerald-600">{label}</p>
        <p className="text-[8px] text-bri-muted">Data payroll digunakan (tanpa unggah dokumen)</p>
      </div>
    </div>
  );
}

/**
 * RequirementScreen — adaptive upload screen based on persona + joint status.
 *
 * Nasabah section: always shown.
 *   - If nasabahPayroll: confirm card (no upload needed).
 *   - Else: Slip Gaji + Mutasi Rekening upload cards.
 *
 * Pasangan section: only rendered if isJoint.
 *   - If pasanganPayroll: confirm card.
 *   - Else: Slip Gaji Pasangan + Mutasi Pasangan upload cards.
 *
 * Submit enabled when all required uploads (non-payroll parties in scope) are present.
 */
export function RequirementScreen({
  nasabahPayroll,
  isJoint,
  pasanganPayroll,
  uploads,
  onUpload,
  onSubmit,
  validating,
  onGoBack,
  canGoBack,
}: RequirementScreenProps) {
  // Determine required upload keys
  const requiredKeys: string[] = [];
  if (!nasabahPayroll) {
    requiredKeys.push("slip_gaji", "mutasi");
  }
  if (isJoint && !pasanganPayroll) {
    requiredKeys.push("spouse_slip", "spouse_mutasi");
  }

  const allUploaded = requiredKeys.every((k) => uploads[k]);
  const hasAnyUploadSection = !nasabahPayroll || (isJoint && !pasanganPayroll);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto scroll-thin px-3 py-2">
      {/* Title */}
      <div className="mb-2">
        <h2 className="text-[13px] font-bold text-bri-ink">Upload Dokumen</h2>
        <p className="text-[9px] text-bri-muted">Untuk verifikasi penghasilan Anda</p>
      </div>

      {/* Nasabah Utama Section */}
      <div className="mb-2">
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-bri-muted">
          Nasabah Utama
        </p>
        {nasabahPayroll ? (
          <PayrollConfirmCard label="✓ Nasabah Payroll BRI" />
        ) : (
          <div className="flex flex-col gap-1.5">
            <MultiUploadCard
              docKey="slip_gaji"
              title="Slip Gaji"
              hint="3 bulan terakhir · PDF/JPG/PNG"
              monthKeys={SLIP_MONTHS_FULL}
              uploaded={!!uploads["slip_gaji"]}
              onUpload={onUpload}
            />
            <MultiUploadCard
              docKey="mutasi"
              title="Mutasi Rekening"
              hint="Minimal 12 bulan terakhir · 1 file / bulan"
              monthKeys={MUTASI_MONTHS_FULL}
              uploaded={!!uploads["mutasi"]}
              onUpload={onUpload}
            />
          </div>
        )}
      </div>

      {/* Pasangan Section — only if isJoint */}
      {isJoint && (
        <div className="mb-2">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-bri-muted">
            Pasangan
          </p>
          {pasanganPayroll ? (
            <PayrollConfirmCard label="✓ Pasangan Payroll BRI" />
          ) : (
            <div className="flex flex-col gap-1.5">
              <MultiUploadCard
                docKey="spouse_slip"
                title="Slip Gaji Pasangan"
                hint="3 bulan terakhir · PDF/JPG/PNG"
                monthKeys={SLIP_MONTHS_FULL}
                uploaded={!!uploads["spouse_slip"]}
                onUpload={onUpload}
              />
              <MultiUploadCard
                docKey="spouse_mutasi"
                title="Mutasi Pasangan"
                hint="Minimal 12 bulan terakhir · 1 file / bulan"
                monthKeys={MUTASI_MONTHS_FULL}
                uploaded={!!uploads["spouse_mutasi"]}
                onUpload={onUpload}
              />
            </div>
          )}
        </div>
      )}

      {/* Info box — bri-bg tint, bri-blue icon */}
      {hasAnyUploadSection && (
        <div className="mb-2 flex items-start gap-1.5 rounded-bubble bg-bri-bg px-2.5 py-2">
          <Info size={11} className="mt-0.5 shrink-0 text-bri-blue" />
          <p className="text-[8px] leading-relaxed text-bri-blue">
            Pastikan dokumen jelas &amp; terbaca.
          </p>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Submit button — BRI navy gradient */}
      <button
        type="button"
        onClick={allUploaded && !validating ? onSubmit : undefined}
        disabled={!allUploaded || validating}
        className={cn(
          "mt-2 flex w-full items-center justify-center gap-2 rounded-bubble py-2.5 text-[12px] font-semibold text-white transition-all",
          allUploaded && !validating
            ? "hover:opacity-90 active:scale-[0.98]"
            : "cursor-not-allowed opacity-60"
        )}
        style={{
          background: allUploaded
            ? "linear-gradient(135deg, #00529C 0%, #1A6FC4 100%)"
            : "#94A3B8",
        }}
      >
        {validating ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Memvalidasi dokumen…
          </>
        ) : (
          "Submit"
        )}
      </button>

      {/* Back */}
      {canGoBack && (
        <button
          type="button"
          onClick={onGoBack}
          className="mt-2 text-center text-[10px] text-bri-muted transition-colors hover:text-bri-blue"
        >
          ← Kembali
        </button>
      )}
    </div>
  );
}
