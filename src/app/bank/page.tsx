"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProofBadge from "@/components/ProofBadge";
import VerifierAuditLog from "@/components/VerifierAuditLog";
import { CreditPassport, formatIDR, simulateStellarPayout } from "@/lib/data";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  ExternalLink,
  Landmark,
  Lock,
  Send,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Payout = ReturnType<typeof simulateStellarPayout>;

function BankVerifierContent() {
  const searchParams = useSearchParams();

  const initialProof = useMemo(() => {
    const proof = searchParams.get("proof");
    return proof ? decodeURIComponent(proof) : "";
  }, [searchParams]);

  const [proofInput, setProofInput] = useState("");
  const [passport, setPassport] = useState<CreditPassport | null>(null);
  const [stellarAddress, setStellarAddress] = useState(
    "GCBQWJYTW7JX2CREDENCEDEMOXMSMEWALLETSTELLARUSDC"
  );
  const [loanAmount, setLoanAmount] = useState(5000);
  const [payout, setPayout] = useState<Payout | null>(null);

  useEffect(() => {
    if (initialProof) {
      setProofInput(initialProof);

      try {
        const parsed = JSON.parse(initialProof) as CreditPassport;
        setPassport(parsed);
      } catch {
        setPassport(null);
      }
    }
  }, [initialProof]);

  function handleVerify() {
    try {
      const parsed = JSON.parse(proofInput) as CreditPassport;

      if (!parsed.proofId || !parsed.commitment || !parsed.result) {
        throw new Error("Invalid proof payload");
      }

      setPassport(parsed);

      if (parsed.result.verified) {
        toast.success("Proof verified successfully");
      } else {
        toast.error("Proof is valid but criteria are not met");
      }
    } catch {
      toast.error("Invalid proof payload");
      setPassport(null);
    }
  }

  function handlePayout() {
    if (!passport?.result.verified) {
      toast.error("Cannot approve payout for unverified proof");
      return;
    }

    const result = simulateStellarPayout(stellarAddress, loanAmount);
    setPayout(result);
    toast.success("Stellar USDC payout simulated");
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
            Bank Verifier Portal
          </p>

          <h1 className="page-title mt-3 text-4xl font-semibold tracking-[-0.035em] md:text-5xl">
            Verify credit passport
          </h1>

          <p className="page-desc mt-4 max-w-2xl text-base leading-8">
            Lenders can verify eligibility criteria without seeing private
            transactions, customer identities, or business-sensitive sales
            details.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card rounded-[1.75rem] p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="icon-tile-cyan rounded-xl p-3">
                <Landmark size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  Submit proof
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Paste or receive a private credit passport.
                </p>
              </div>
            </div>

            {proofInput ? (
              <div className="mb-5 rounded-2xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-300/15 dark:bg-teal-400/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                      Proof detected
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                      Private credit passport payload
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      The lender can verify eligibility without receiving raw sales rows,
                      customer names, or exact revenue.
                    </p>
                  </div>

                  <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-300/15 dark:bg-emerald-400/10 dark:text-emerald-300">
                    Ready
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Network
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                      Midnight
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Payout rail
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                      Stellar USDC
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Raw records exposed
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      0 rows
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Customer data
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      Hidden
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Proof payload
                </label>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  JSON / QR decoded
                </span>
              </div>

              <textarea
                value={proofInput}
                onChange={(e) => setProofInput(e.target.value)}
                placeholder="Paste Credence proof payload here..."
                className="field-input h-36 w-full resize-none rounded-2xl p-4 font-mono text-xs leading-6 outline-none transition focus:border-teal-600"
              />
            </div>

            <button
              onClick={handleVerify}
              className="primary-action mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
            >
              Verify proof
              <ShieldCheck size={17} />
            </button>

            <div className="muted-surface mt-5 rounded-2xl p-4">
              <div className="flex gap-3">
                <Lock className="mt-1 text-teal-700 dark:text-teal-300" size={18} />
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  The lender receives a boolean verification result and selected criteria.
                  Raw sales values remain hidden.
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
                    <ShieldCheck size={34} />
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Waiting for proof
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
                    Paste a Credence proof payload to verify whether the MSME is
                    eligible for lending.
                  </p>

                  <Link
                    href="/generate-proof"
                    className="secondary-action mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
                  >
                    Generate demo proof
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <ProofBadge verified={passport.result.verified} />

                <div className="mt-6">
                  <VerifierAuditLog verified={passport.result.verified} />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="muted-surface rounded-2xl p-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Revenue criteria
                    </p>
                    <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
                      ≥ {formatIDR(passport.criteria.minRevenue)}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 size={16} />
                      Actual revenue hidden
                    </div>
                  </div>

                  <div className="muted-surface rounded-2xl p-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Growth criteria
                    </p>
                    <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
                      ≥ {passport.criteria.minGrowth}%
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 size={16} />
                      Actual growth hidden
                    </div>
                  </div>

                  <div className="muted-surface rounded-2xl p-4 md:col-span-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Commitment
                    </p>
                    <p className="mt-2 break-all font-mono text-sm text-teal-800 dark:text-teal-300">
                      {passport.commitment}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 dark:border-amber-300/15 dark:bg-amber-400/10">
                  <div className="flex items-center gap-3">
                    <Banknote className="text-amber-700 dark:text-amber-300" size={24} />
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        Approve Stellar USDC loan
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Simulate payout after successful verification.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Loan amount
                      </label>
                      <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="field-input mt-2 w-full rounded-xl px-4 py-3 outline-none focus:border-teal-600"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        MSME Stellar wallet
                      </label>
                      <input
                        value={stellarAddress}
                        onChange={(e) => setStellarAddress(e.target.value)}
                        className="field-input mt-2 w-full rounded-xl px-4 py-3 outline-none focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePayout}
                    disabled={!passport.result.verified}
                    className="primary-action mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send USDC via Stellar
                    <Send size={17} />
                  </button>
                </div>

                {payout && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-300/15 dark:bg-emerald-400/10"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="text-emerald-700 dark:text-emerald-300" size={24} />
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-100">
                          Payout successful
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {payout.amount} {payout.asset} sent on{" "}
                          {payout.network}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-emerald-100 dark:bg-white/5 dark:ring-white/10">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Transaction hash
                      </p>
                      <p className="mt-1 break-all font-mono text-sm text-emerald-800 dark:text-emerald-300">
                        {payout.txHash}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <ExternalLink size={16} />
                      Explorer link can be connected for real Stellar testnet
                      payout.
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default function BankVerifierPage() {
  return (
    <Suspense fallback={<div className="page-shell p-10">Loading...</div>}>
      <BankVerifierContent />
    </Suspense>
  );
}