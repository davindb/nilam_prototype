import { motion } from "framer-motion";
import { PhoneStatusBar } from "@/components/phone/PhoneStatusBar";
import { UploadCard } from "@/components/phone/ui/UploadCard";
import { SelfieCapture } from "@/components/phone/ui/SelfieCapture";
import { PrimaryButton } from "@/components/phone/ui/PrimaryButton";

interface JointDocumentScreenProps {
  uploads: Record<string, boolean>;
  onUpload: (key: string) => void;
  onCapture: () => void;
  onSubmit: () => void;
}

/**
 * Joint income document collection screen.
 * Requires KTP, selfie, slip gaji pasangan, and mutasi pasangan.
 */
export function JointDocumentScreen({
  uploads,
  onUpload,
  onCapture,
  onSubmit,
}: JointDocumentScreenProps) {
  const allReady =
    !!uploads["ktp"] &&
    !!uploads["selfie"] &&
    !!uploads["spouse_slip"] &&
    !!uploads["spouse_mutasi"];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto scroll-thin">
      <PhoneStatusBar />

      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-bri-navy">
            Dokumen Pasangan
          </h2>
          <p className="mt-1 text-sm text-bri-muted">
            Dokumen joint income — penghasilan pasangan akan turut diasesmen.
          </p>
        </motion.div>

        {/* KTP */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.06 }}
        >
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-bri-muted">
            KTP Pasangan
          </p>
          <UploadCard
            title="KTP Pasangan"
            hint="Foto KTP yang jelas dan tidak buram"
            uploaded={!!uploads["ktp"]}
            fileName="ktp_pasangan.jpg"
            onPick={() => onUpload("ktp")}
          />
        </motion.div>

        {/* Selfie */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-bri-muted">
            Liveness Selfie
          </p>
          <SelfieCapture captured={!!uploads["selfie"]} onCapture={onCapture} />
        </motion.div>

        {/* Slip gaji pasangan */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.14 }}
        >
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-bri-muted">
            Slip Gaji Pasangan
          </p>
          <UploadCard
            title="Slip Gaji Pasangan"
            hint="Slip gaji bulan terakhir pasangan"
            uploaded={!!uploads["spouse_slip"]}
            fileName="slip_gaji_pasangan.pdf"
            onPick={() => onUpload("spouse_slip")}
          />
        </motion.div>

        {/* Mutasi pasangan */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18 }}
        >
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-bri-muted">
            Mutasi Rekening Pasangan
          </p>
          <UploadCard
            title="Mutasi Rekening Pasangan 12 Bulan"
            hint="Rekening koran 12 bulan terakhir"
            uploaded={!!uploads["spouse_mutasi"]}
            fileName="mutasi_pasangan_12bln.pdf"
            onPick={() => onUpload("spouse_mutasi")}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22 }}
          className="pt-2 pb-4"
        >
          <PrimaryButton onClick={onSubmit} disabled={!allReady}>
            Ajukan Aplikasi
          </PrimaryButton>
          {!allReady && (
            <p className="mt-2 text-center text-xs text-bri-muted">
              Lengkapi semua dokumen pasangan untuk mengajukan
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
