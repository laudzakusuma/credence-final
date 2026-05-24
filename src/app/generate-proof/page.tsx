"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProofBadge from "@/components/ProofBadge";
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

  function handleGenerateProof() {
    const generated = createCreditPassport(sampleSales, {
      minRevenue,
      minGrowth,
      periodDays,
      currency: "IDR",
    });

    setPassport(generated);

    if (generated.result.verified) {
      toast.success("Private credit passport generated");
    } else {
      toast.error("Proof generated, but criteria were not met");
    }
  }

  async function handleCopyProof() {
    if (!qrPayload) return;
    await navigator.clipboard.writeText(qrPayload);
    toast.success("Proof payload copied");
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
            Generate Proof
          </p>

          <h1 className="page-title mt-3 text-4xl font-semibold tracking-[-0.035em] md:text-5xl">
            Create a private credit passport
          </h1>

          <p className="page-desc mt-4 max-w-2xl text-base leading-8">
            Select the criteria to prove. Credence reveals whether the business
            meets the requirement without exposing the underlying sales data.
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
                  Proof criteria
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Selective disclosure configuration.
                </p>
              </div>
            </div>

            <div className="space-y-7">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Minimum revenue
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
                  onChange={(e) => setMinRevenue(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Minimum growth
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
                  onChange={(e) => setMinGrowth(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Period
                  </label>
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                    {periodDays} days
                  </span>
                </div>

                <input
                  type="range"
                  min={30}
                  max={180}
                  step={30}
                  value={periodDays}
                  onChange={(e) => setPeriodDays(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={handleGenerateProof}
                className="primary-action inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition"
              >
                Generate proof package
                <ShieldCheck size={17} />
              </button>
            </div>

            <div className="muted-surface mt-6 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Lock className="mt-1 text-teal-700 dark:text-teal-300" size={18} />
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Private records are transformed into a proof commitment. The
                  lender only receives the selected criteria, commitment hash,
                  and verification status.
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
            {!passport ? (
              <div className="muted-surface grid min-h-[520px] place-items-center rounded-[1.5rem] border-dashed p-8 text-center">
                <div>
                  <div className="icon-tile-cyan mx-auto grid h-20 w-20 place-items-center rounded-2xl">
                    <QrCode size={34} />
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Your credit passport will appear here
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
                    Generate a proof package to create a QR code that lenders
                    can verify without accessing raw marketplace data.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <ProofBadge verified={passport.result.verified} />

                <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="surface-card rounded-[1.5rem] p-5">
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
                        Private commitment
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
                          Period
                        </p>
                        <p className="font-semibold text-slate-950 dark:text-white">
                          {passport.criteria.periodDays} days
                        </p>
                      </div>

                      <div className="muted-surface rounded-2xl p-4">
                        <TrendingUp
                          size={18}
                          className="text-emerald-700 dark:text-emerald-300"
                        />
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Growth proof
                        </p>
                        <p className="font-semibold text-slate-950 dark:text-white">
                          ≥ {passport.criteria.minGrowth}%
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
                    Verify in bank portal
                    <Landmark size={17} />
                  </Link>

                  <button
                    onClick={handleCopyProof}
                    className="secondary-action inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
                  >
                    Copy proof payload
                    <Copy size={17} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}