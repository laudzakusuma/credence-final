"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  EyeOff,
  FileCheck2,
  Fingerprint,
  Landmark,
  Lock,
  ShieldCheck,
  Wallet,
} from "lucide-react";

type Props = {
  verified: boolean;
};

const verifiedSteps = [
  {
    icon: FileCheck2,
    title: "Data proof berhasil dibaca",
    desc: "Portal lender berhasil membaca data paspor kredit yang dikirim.",
  },
  {
    icon: Fingerprint,
    title: "Commitment Midnight terdeteksi",
    desc: "Proof commitment dan private data commitment tersedia untuk diverifikasi.",
  },
  {
    icon: ShieldCheck,
    title: "Batas pendapatan terverifikasi",
    desc: "Usaha memenuhi batas pendapatan yang dipilih tanpa membuka nilai penjualan aktual.",
  },
  {
    icon: CheckCircle2,
    title: "Kriteria pertumbuhan terverifikasi",
    desc: "Kriteria pertumbuhan terpenuhi melalui selective disclosure.",
  },
  {
    icon: EyeOff,
    title: "Identitas pelanggan yang terbuka: 0",
    desc: "Tidak ada nama pelanggan, ID pesanan, atau data marketplace yang dibagikan kepada lender.",
  },
  {
    icon: Lock,
    title: "Data transaksi mentah yang terbuka: 0",
    desc: "Bank hanya melihat kelayakan, bukan riwayat transaksi privat yang mendasarinya.",
  },
  {
    icon: Wallet,
    title: "Memenuhi syarat untuk payout Stellar USDC",
    desc: "Hasil verifikasi dapat melanjutkan proses pencairan yang disetujui.",
  },
];

const failedSteps = [
  {
    icon: FileCheck2,
    title: "Data proof berhasil dibaca",
    desc: "The lender portal decoded the submitted credit passport.",
  },
  {
    icon: Landmark,
    title: "Pemeriksaan kelayakan gagal",
    desc: "Proof valid, tetapi kriteria kredit yang dipilih tidak terpenuhi.",
  },
  {
    icon: EyeOff,
    title: "Data privat tetap terlindungi",
    desc: "Proof yang gagal sekalipun tidak membuka data pelanggan, pendapatan aktual, atau transaksi mentah.",
  },
];

export default function VerifierAuditLog({ verified }: Props) {
  const steps = verified ? verifiedSteps : failedSteps;

  return (
    <div className="surface-card rounded-[1.75rem] p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="page-eyebrow text-sm font-semibold uppercase tracking-[0.18em]">
            Riwayat Audit Verifikasi
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {verified ? "Privacy proof terverifikasi" : "Proof telah ditinjau"}
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            The lender can audit what was verified while seeing exactly what
            remained hidden. This is the core privacy layer of Credence.
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
            verified
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/15 dark:bg-emerald-400/10 dark:text-emerald-300"
              : "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/15 dark:bg-amber-400/10 dark:text-amber-300"
          }`}
        >
          <CheckCircle2 size={16} />
          {verified ? "Terverifikasi" : "Ditinjau"}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.38 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.045] dark:hover:bg-white/[0.07]"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-teal-500/70 dark:bg-teal-300/70" />

            <div className="flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-slate-200 dark:bg-white/10 dark:text-teal-300 dark:ring-white/10">
                <step.icon size={18} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    {step.title}
                  </p>

                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: index * 0.08 + 0.15,
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                    className="text-emerald-600 dark:text-emerald-300"
                  >
                    <CheckCircle2 size={15} />
                  </motion.span>
                </div>

                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {step.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}