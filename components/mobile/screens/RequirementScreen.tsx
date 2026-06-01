"use client";

import { FileText, CheckCircle2, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface RequirementScreenProps {
  nasabahPayroll: boolean;
  isJoint: boolean;
  pasanganPayroll: boolean;
  uploads: Record<string, boolean>;
  onUpload: (key: string) => void;
  onSubmit: () => void;
  validating: boolean;
  onGoBack?: () => void;
  canGoBack?: boolean;
}

interface DocCardProps {
  docKey: string;
  title: string;
  format?: string;
  filename: string;
  filesize: string;
  uploaded: boolean;
  onUpload: (key: string) => void;
}

function UploadCard({ docKey, title, format, filename, filesize, uploaded, onUpload }: DocCardProps) {
  return (
    <button
      type="button"
      onClick={() => !uploaded && onUpload(docKey)}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all",
        uploaded
          ? "cursor-default border-green-200 bg-green-50"
          : "cursor-pointer border-nx-line bg-white hover:border-nx-blue hover:shadow-sm active:scale-[0.99]"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          uploaded ? "bg-green-100 text-nx-ok" : "bg-blue-50 text-nx-blue"
        )}
      >
        <FileText size={15} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-[10px] font-semibold text-nx-ink">{title}</p>
        {format && <p className="text-[8px] text-nx-muted">{format}</p>}
        {uploaded && (
          <p className="mt-0.5 truncate text-[8px] text-nx-muted">
            {filename}&nbsp;&nbsp;{filesize}
          </p>
        )}
      </div>

      {uploaded ? (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-nx-ok" />
      ) : (
        <span className="mt-0.5 shrink-0 rounded-full border border-nx-blue px-1.5 py-0.5 text-[7px] font-medium text-nx-blue">
          Upload
        </span>
      )}
    </button>
  );
}

function PayrollConfirmCard({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 p-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-nx-ok">
        <CheckCircle2 size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-[10px] font-semibold text-nx-ok">{label}</p>
        <p className="text-[8px] text-nx-muted">Data payroll digunakan (tanpa unggah dokumen)</p>
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
    <div className="flex flex-1 flex-col px-3 py-2 overflow-y-auto">
      {/* Title */}
      <div className="mb-2">
        <h2 className="text-[13px] font-bold text-nx-ink">Upload Dokumen</h2>
        <p className="text-[9px] text-nx-muted">Untuk verifikasi penghasilan Anda</p>
      </div>

      {/* Nasabah Utama Section */}
      <div className="mb-2">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-nx-muted">
          Nasabah Utama
        </p>
        {nasabahPayroll ? (
          <PayrollConfirmCard label="✓ Nasabah Payroll BRI" />
        ) : (
          <div className="flex flex-col gap-1.5">
            <UploadCard
              docKey="slip_gaji"
              title="Slip Gaji"
              format="Format: PDF, JPG, PNG"
              filename="slip_gaji_nasabah.pdf"
              filesize="1.2 MB"
              uploaded={!!uploads["slip_gaji"]}
              onUpload={onUpload}
            />
            <UploadCard
              docKey="mutasi"
              title="Mutasi Rekening (12 Bulan)"
              format="Format: PDF"
              filename="mutasi_12_bulan.pdf"
              filesize="2.4 MB"
              uploaded={!!uploads["mutasi"]}
              onUpload={onUpload}
            />
          </div>
        )}
      </div>

      {/* Pasangan Section — only if isJoint */}
      {isJoint && (
        <div className="mb-2">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-nx-muted">
            Pasangan
          </p>
          {pasanganPayroll ? (
            <PayrollConfirmCard label="✓ Pasangan Payroll BRI" />
          ) : (
            <div className="flex flex-col gap-1.5">
              <UploadCard
                docKey="spouse_slip"
                title="Slip Gaji Pasangan"
                format="Format: PDF, JPG, PNG"
                filename="slip_gaji_pasangan.pdf"
                filesize="1.1 MB"
                uploaded={!!uploads["spouse_slip"]}
                onUpload={onUpload}
              />
              <UploadCard
                docKey="spouse_mutasi"
                title="Mutasi Pasangan (12 Bulan)"
                format="Format: PDF"
                filename="mutasi_pasangan_12bln.pdf"
                filesize="2.2 MB"
                uploaded={!!uploads["spouse_mutasi"]}
                onUpload={onUpload}
              />
            </div>
          )}
        </div>
      )}

      {/* Info box — show when there is at least one upload section */}
      {hasAnyUploadSection && (
        <div className="mb-2 flex items-start gap-1.5 rounded-lg bg-blue-50 px-2.5 py-2">
          <Info size={11} className="mt-0.5 shrink-0 text-blue-400" />
          <p className="text-[8px] leading-relaxed text-blue-500">
            ℹ Pastikan dokumen jelas &amp; terbaca.
          </p>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Submit button */}
      <button
        type="button"
        onClick={allUploaded && !validating ? onSubmit : undefined}
        disabled={!allUploaded || validating}
        className={cn(
          "mt-2 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[12px] font-semibold text-white transition-all",
          allUploaded && !validating
            ? "hover:opacity-90 active:scale-[0.98]"
            : "cursor-not-allowed opacity-60"
        )}
        style={{
          background:
            allUploaded
              ? "linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)"
              : "linear-gradient(90deg, #94A3B8 0%, #94A3B8 100%)",
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
          className="mt-2 text-center text-[10px] text-nx-muted transition-colors hover:text-nx-blue"
        >
          ← Kembali
        </button>
      )}
    </div>
  );
}
