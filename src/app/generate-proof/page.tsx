"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProofBadge from "@/components/ProofBadge";
import ProofGenerationSteps from "@/components/ProofGenerationSteps";
import {
  createCreditPassport,
  CreditPassport,
  formatIDR,
  sampleSales,
} from "@/lib/data";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Copy,
  Landmark,
  Lock,
  QrCode,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function GenerateProofPage() {
  const [minRevenue, setMinRevenue] = useState(10000000);
  const [minGrowth, setMinGrowth] = useState(20);
  const [periodDays, setPeriodDays] = useState(120);
  const [passport, setPassport] = useState<CreditPassport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const qrPayload = useMemo(() => {
    if (!passport) return "";

    return JSON.stringify({
      proofId: passport.proofId,
      merchantHash: passport.merchantHash,
      commitment: passport.commitment,
      network: passport.network,
      payoutRail: passport.payoutRail,
      criteria: passport.criteria,
      result: passport.result,
      issuedAt: passport.issuedAt,
    });
  }, [passport]);

  async function handleGenerateProof() {
    setIsGenerating(true);
    setPassport(null);

    await new Promise((resolve) => setTimeout(resolve, 2300));

    const generated = createCreditPassport(sampleSales, {
      minRevenue,
      minGrowth,
      periodDays,
      currency: "IDR",
    });

    setPassport(generated);
    setIsGenerating(false);

    if (generated.result.verified) {
      toast.success("Paspor kredit privat berhasil dibuat");
    } else {
      toast.error("Proof berhasil dibuat, tetapi kriteria tidak terpenuhi");
    }
  }

  async function handleSalinProof() {
    if (!qrPayload) return;
    await navigator.clipboard.writeText(qrPayload);
    toast.success("Data proof berhasil disalin");
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="page-section">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="page-eyebrow text-sm font-semibold uppercase tracking-[0.18em]">
            Buat Proof
          </p>

          <h1 className="page-title mt-3 text-4xl font-semibold tracking-[-0.035em] md:text-5xl">
            Buat paspor kredit privat
          </h1>

          <p className="page-desc mt-4 max-w-2xl text-base leading-8">
            Pilih kriteria yang akan dibuktikan. 
            Credence akan menunjukkan apakah bisnis tersebut 
            memenuhi persyaratan tanpa mengungkapkan data penjualan yang mendasarinya.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card rounded-[1.75rem] p-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="icon-tile-cyan rounded-xl p-3">
                <SlidersHorizontal size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  Kriteria proof
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Konfigurasi selective disclosure.
                </p>
              </div>
            </div>

            <div className="space-y-7">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Pendapatan minimum
                  </label>
                  <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                    {formatIDR(minRevenue)}
                  </span>
                </div>

                <input
                  type="range"
                  min={5000000}
                  max={50000000}
                  step={1000000}
                  value={minRevenue}
                  disabled={isGenerating}
                  onChange={(e) => setMinRevenue(Number(e.target.value))}
                  className="w-full disabled:opacity-50"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Pertumbuhan minimum
                  </label>
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {minGrowth}%
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={minGrowth}
                  disabled={isGenerating}
                  onChange={(e) => setMinGrowth(Number(e.target.value))}
                  className="w-full disabled:opacity-50"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Periodee
                  </label>
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                    {periodDays} hari
                  </span>
                </div>

                <input
                  type="range"
                  min={30}
                  max={180}
                  step={30}
                  value={periodDays}
                  disabled={isGenerating}
                  onChange={(e) => setPeriodDays(Number(e.target.value))}
                  className="w-full disabled:opacity-50"
                />
              </div>

              <button
                onClick={handleGenerateProof}
                disabled={isGenerating}
                className="primary-action inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating
                  ? "Sedang membuat proof privat..."
                  : "Buat Proof package"}
                <ShieldCheck size={17} />
              </button>
            </div>

            <div className="muted-surface mt-6 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Lock
                  className="mt-1 text-teal-700 dark:text-teal-300"
                  size={18}
                />
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Data privat diubah menjadi proof commitment. 
                  Pemberi pinjaman hanya menerima kriteria yang dipilih, hash komitmen, dan status verifikasi.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="surface-card rounded-[1.75rem] p-6"
          >
            {isGenerating ? (
              <ProofGenerationSteps active={isGenerating} />
            ) : !passport ? (
              <div className="muted-surface grid min-h-130 place-items-center rounded-3xl border-dashed p-8 text-center">
                <div>
                  <div className="icon-tile-cyan mx-auto grid h-20 w-20 place-items-center rounded-2xl">
                    <QrCode size={34} />
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Paspor kredit Anda akan muncul di sini
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
                   Buktikan ke pemberi pinjaman secara privat tanpa membuka data marketplace.
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <ProofBadge verified={passport.result.verified} />

                <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="surface-card rounded-3xl p-5">
                    <div className="rounded-xl bg-white p-3">
                      <QRCodeCanvas
                        value={qrPayload}
                        size={240}
                        bgColor="#ffffff"
                        fgColor="#0f172a"
                        level="H"
                        includeMargin
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="muted-surface rounded-2xl p-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Proof ID
                      </p>
                      <p className="mt-1 break-all font-mono text-sm text-slate-950 dark:text-white">
                        {passport.proofId}
                      </p>
                    </div>

                    <div className="muted-surface rounded-2xl p-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Commitment privat
                      </p>
                      <p className="mt-1 break-all font-mono text-sm text-teal-800 dark:text-teal-300">
                        {passport.commitment}
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="muted-surface rounded-2xl p-4">
                        <CalendarDays
                          size={18}
                          className="text-amber-700 dark:text-amber-300"
                        />
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Periodee
                        </p>
                        <p className="font-semibold text-slate-950 dark:text-white">
                          {passport.criteria.periodDays} hari
                        </p>
                      </div>

                      <div className="muted-surface rounded-2xl p-4">
                        <TrendingUp
                          size={18}
                          className="text-emerald-700 dark:text-emerald-300"
                        />
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Proof pertumbuhan
                        </p>
                        <p className="font-semibold text-slate-950 dark:text-white">
                          ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¥ {passport.criteria.minGrowth}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href={`/bank?proof=${encodeURIComponent(qrPayload)}`}
                    className="primary-action inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
                  >
                    Verifikasi di portal bank
                    <Landmark size={17} />
                  </Link>

                  <button
                    onClick={handleSalinProof}
                    className="secondary-action inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
                  >
                    Copy proof payload
                    <Copy size={17} />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
