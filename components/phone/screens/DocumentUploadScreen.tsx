import { motion } from "framer-motion";
import { PhoneStatusBar } from "@/components/phone/PhoneStatusBar";
import { UploadCard } from "@/components/phone/ui/UploadCard";
import { PrimaryButton } from "@/components/phone/ui/PrimaryButton";

interface DocumentUploadScreenProps {
  uploads: Record<string, boolean>;
  onUpload: (key: string) => void;
  onSubmit: () => void;
  submitLabel: string;
}

/**
 * Document upload screen for non-payroll applicants.
 * Requires Slip Gaji and Mutasi 12 Bulan before the CTA is enabled.
 */
export function DocumentUploadScreen({
  uploads,
  onUpload,
  onSubmit,
  submitLabel,
}: DocumentUploadScreenProps) {
  const allUploaded = !!uploads["slip_gaji"] && !!uploads["mutasi"];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PhoneStatusBar />

      <div className="flex flex-1 flex-col gap-5 px-5 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-bri-navy">Unggah Dokumen</h2>
          <p className="mt-1 text-sm text-bri-muted">
            Unggah dokumen berikut untuk verifikasi penghasilan Anda.
          </p>
        </motion.div>

        {/* Upload cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="space-y-3"
        >
          <UploadCard
            title="Slip Gaji"
            hint="Format PDF atau JPG, maks. 5 MB"
            uploaded={!!uploads["slip_gaji"]}
            fileName="slip_gaji.pdf"
            onPick={() => onUpload("slip_gaji")}
          />
          <UploadCard
            title="Mutasi Rekening 12 Bulan"
            hint="Rekening koran 12 bulan terakhir"
            uploaded={!!uploads["mutasi"]}
            fileName="mutasi_12bln.pdf"
            onPick={() => onUpload("mutasi")}
          />
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.14 }}
        >
          <PrimaryButton onClick={onSubmit} disabled={!allUploaded}>
            {submitLabel}
          </PrimaryButton>
          {!allUploaded && (
            <p className="mt-2 text-center text-xs text-bri-muted">
              Unggah semua dokumen untuk melanjutkan
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
