import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { PhoneStatusBar } from "@/components/phone/PhoneStatusBar";
import { DisabledOption } from "@/components/phone/ui/DisabledOption";

interface IncomeTypeScreenProps {
  onPickFix: () => void;
}

/**
 * Income type selection screen.
 * "Fix Income" is active and selectable; "Non Fix Income" is a DisabledOption.
 */
export function IncomeTypeScreen({ onPickFix }: IncomeTypeScreenProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto scroll-thin">
      <PhoneStatusBar />

      <div className="flex flex-col gap-5 px-5 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-bri-navy">Pilih Tipe Penghasilan</h2>
          <p className="mt-1 text-sm text-bri-muted">
            Pilih jenis penghasilan utama Anda untuk melanjutkan proses aplikasi.
          </p>
        </motion.div>

        {/* Fix Income — active */}
        <motion.button
          type="button"
          onClick={onPickFix}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="flex items-center gap-4 rounded-card bg-white p-4 text-left ring-2 ring-bri-navy shadow-soft transition hover:shadow-panel active:scale-[0.99]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bri-navy">
            <TrendingUp size={18} strokeWidth={2} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-bri-navy">Fix Income</p>
            <p className="text-xs text-bri-muted">Gaji tetap dari pemberi kerja</p>
          </div>
          <span className="shrink-0 rounded-pill bg-bri-navy px-2.5 py-1 text-xs font-medium text-white">
            Tersedia
          </span>
        </motion.button>

        {/* Non Fix Income — disabled */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.14 }}
        >
          <DisabledOption
            label="Non Fix Income"
            sublabel="Penghasilan tidak tetap / wirausaha"
          />
        </motion.div>
      </div>
    </div>
  );
}
