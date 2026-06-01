"use client";

import { FileText, CheckCircle2, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface DocCard {
  key: string;
  title: string;
  format: string;
  filename: string;
  filesize: string;
}

const DOCS: DocCard[] = [
  {
    key: "slip_gaji",
    title: "Slip Gaji",
    format: "Format: PDF, JPG, PNG",
    filename: "slip_gaji_nasabah.pdf",
    filesize: "1.2 MB",
  },
  {
    key: "mutasi",
    title: "Mutasi Rekening (12 Bulan)",
    format: "Format: PDF",
    filename: "mutasi_12_bulan.pdf",
    filesize: "2.4 MB",
  },
];

interface RequirementScreenProps {
  uploads: Record<string, boolean>;
  onUpload: (key: string) => void;
  onSubmit: () => void;
  validating: boolean;
  onGoBack?: () => void;
  canGoBack?: boolean;
}

/**
 * Upload Dokumen screen — matching the reference exactly:
 *   - Title + subtitle
 *   - Two document cards (Slip Gaji, Mutasi Rekening)
 *   - Info box
 *   - Gradient Submit button (disabled until both uploaded / spinner when validating)
 *   - "← Kembali" link
 */
export function RequirementScreen({
  uploads,
  onUpload,
  onSubmit,
  validating,
  onGoBack,
  canGoBack,
}: RequirementScreenProps) {
  const bothUploaded = DOCS.every((d) => uploads[d.key]);

  return (
    <div className="flex flex-1 flex-col px-3 py-2">
      {/* Title */}
      <div className="mb-2">
        <h2 className="text-[13px] font-bold text-nx-ink">Upload Dokumen</h2>
        <p className="text-[9px] text-nx-muted">Untuk verifikasi penghasilan Anda</p>
      </div>

      {/* Document cards */}
      <div className="flex flex-col gap-1.5">
        {DOCS.map((doc) => {
          const uploaded = !!uploads[doc.key];
          return (
            <button
              key={doc.key}
              type="button"
              onClick={() => !uploaded && onUpload(doc.key)}
              className={cn(
                "flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all",
                uploaded
                  ? "cursor-default border-green-200 bg-green-50"
                  : "cursor-pointer border-nx-line bg-white hover:border-nx-blue hover:shadow-sm active:scale-[0.99]"
              )}
            >
              {/* File icon */}
              <div
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  uploaded ? "bg-green-100 text-nx-ok" : "bg-blue-50 text-nx-blue"
                )}
              >
                <FileText size={15} />
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-[10px] font-semibold text-nx-ink">{doc.title}</p>
                <p className="text-[8px] text-nx-muted">{doc.format}</p>
                {uploaded && (
                  <p className="mt-0.5 truncate text-[8px] text-nx-muted">
                    {doc.filename}&nbsp;&nbsp;{doc.filesize}
                  </p>
                )}
              </div>

              {/* Check / tap-to-upload indicator */}
              {uploaded ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-nx-ok" />
              ) : (
                <span className="mt-0.5 shrink-0 rounded-full border border-nx-blue px-1.5 py-0.5 text-[7px] font-medium text-nx-blue">
                  Upload
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Info box */}
      <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-blue-50 px-2.5 py-2">
        <Info size={11} className="mt-0.5 shrink-0 text-blue-400" />
        <p className="text-[8px] leading-relaxed text-blue-500">
          Pastikan dokumen yang Anda upload jelas dan terbaca dengan baik
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Submit button */}
      <button
        type="button"
        onClick={bothUploaded && !validating ? onSubmit : undefined}
        disabled={!bothUploaded || validating}
        className={cn(
          "mt-2 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[12px] font-semibold text-white transition-all",
          bothUploaded && !validating
            ? "hover:opacity-90 active:scale-[0.98]"
            : "cursor-not-allowed opacity-60"
        )}
        style={{
          background:
            bothUploaded
              ? "linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)"
              : "linear-gradient(90deg, #94A3B8 0%, #94A3B8 100%)",
        }}
      >
        {validating ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Memvalidasi…
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
