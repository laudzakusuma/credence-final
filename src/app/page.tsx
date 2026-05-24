"use client";

import Link from "next/link";
import AnimatedPhoneMockup from "@/components/AnimatedPhoneMockup";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  Building2,
  EyeOff,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="audit-grid border-b border-slate-200/80 transition-colors duration-500 dark:border-white/10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div
              variants={fadeUp}
              className="
                mb-6 inline-flex items-center gap-2 rounded-full border
                border-teal-700/15 bg-white px-4 py-2 text-sm font-semibold
                text-teal-800 shadow-sm transition-colors duration-500
                dark:border-teal-300/20 dark:bg-white/5 dark:text-teal-200
              "
            >
              <ShieldCheck size={16} />
              Built for privacy-first credit underwriting
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="page-title max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl"
            >
              Credit access for MSMEs without exposing business data.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="page-desc mt-6 max-w-2xl text-lg leading-8"
            >
              Credence lets small businesses prove revenue, growth, and
              repayment readiness to lenders while keeping transactions,
              customer names, and marketplace records private.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/dashboard"
                className="primary-action inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
              >
                View MSME dashboard
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/bank"
                className="secondary-action inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
              >
                Open lender portal
                <Landmark size={17} />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {[
                ["Private proofs", "No raw sales shared"],
                ["Bank-ready", "Instant verification"],
                ["Stellar rail", "USDC disbursement"],
              ].map(([title, desc]) => (
                <div key={title} className="surface-card rounded-2xl p-4">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    {title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative flex justify-center lg:justify-center"
          >
            <AnimatedPhoneMockup />
          </motion.div>
        </div>
      </section>

      <section className="page-section">
        <div className="mb-8 max-w-2xl">
          <p className="page-eyebrow text-sm font-semibold uppercase tracking-[0.2em]">
            How it works
          </p>

          <h2 className="page-title mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            A lender sees proof, not private records.
          </h2>

          <p className="page-desc mt-4 text-base leading-7">
            Credence turns business data into verifiable private claims for
            underwriting, while sensitive records stay protected.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {[
            {
              icon: Building2,
              title: "MSME connects data",
              desc: "Sales data from marketplace exports, bank statements, or APIs is processed privately.",
            },
            {
              icon: LockKeyhole,
              title: "Private facts are computed",
              desc: "Revenue and growth checks are converted into a proof-ready commitment.",
            },
            {
              icon: EyeOff,
              title: "Selective proof is shared",
              desc: "The business chooses what to prove without revealing transaction details.",
            },
            {
              icon: Wallet,
              title: "Loan can be settled",
              desc: "After verification, approved credit can be disbursed through Stellar USDC.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className="surface-card rounded-2xl p-5"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-teal-200">
                <item.icon size={21} />
              </div>

              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)] transition-colors duration-500 dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_24px_90px_rgba(0,0,0,0.32)] md:p-8">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
                Built for APAC credit flows
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                Designed for banks, fintechs, and MSME platforms.
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Credence creates a privacy layer between business data sources
                and lenders, reducing manual document sharing while improving
                trust in underwriting.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Banknote,
                  title: "Credit threshold proof",
                  desc: "Prove revenue requirements without revealing exact revenue.",
                },
                {
                  icon: ShieldCheck,
                  title: "Confidential verification",
                  desc: "Use Midnight-style proof commitments and selective disclosure.",
                },
                {
                  icon: Landmark,
                  title: "Lender portal",
                  desc: "Verify proof packages from MSME borrowers in seconds.",
                },
                {
                  icon: Wallet,
                  title: "USDC payout path",
                  desc: "Connect approval to Stellar-based settlement flows.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]"
                >
                  <item.icon className="text-teal-300" size={20} />

                  <p className="mt-3 font-semibold text-white">{item.title}</p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}