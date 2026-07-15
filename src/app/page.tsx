"use client";

import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import AnimatedBadge from "@/components/AnimatedBadge";
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

      <section className="audit-grid relative overflow-hidden border-b border-slate-200/80 transition-colors duration-500 dark:border-white/10">
        <AnimatedBackground />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <AnimatedBadge />

            <motion.h1
              variants={fadeUp}
              className="page-title max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl"
            >
              Credit access for{" "}
              <span className="relative inline-block">
                MSMEs
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
                  className="absolute -bottom-1 left-0 h-2 w-full origin-left rounded-full bg-teal-300/55 dark:bg-teal-400/35"
                />
              </span>{" "}
              without exposing business data.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="page-desc mt-6 max-w-2xl text-lg leading-8"
            >
              Credence evaluates private business data and issues a privacy-preserving Credit Passport that lenders can verify without accessing raw transactions.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/dashboard"
                  className="primary-action group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
                >
                  View MSME dashboard
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/bank"
                  className="secondary-action group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
                >
                  Open lender portal
                  <Landmark
                    size={17}
                    className="transition-transform group-hover:scale-110"
                  />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {[
                ["Private proofs", "No raw sales shared"],
                ["Bank-ready", "Instant verification"],
                ["Stellar rail", "Stellar Testnet Settlement"],
              ].map(([title, desc], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 + index * 0.1, duration: 0.45 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="surface-card group rounded-2xl p-4"
                >
                  <div className="mb-3 h-1.5 w-10 rounded-full bg-teal-500/70 transition-all group-hover:w-16 dark:bg-teal-300/70" />

                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    {title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {desc}
                  </p>
                </motion.div>
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
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true, amount: 0.35 }}
          className="mb-8 max-w-2xl"
        >
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
        </motion.div>

        <div className="grid gap-5 md:grid-cols-4">
          {[
            {
              icon: Building2,
              title: "MSME connects data",
              desc: "Sales data from marketplace exports, bank statements, or APIs is processed privately.",
            },
            {
              icon: LockKeyhole,
              title: "Eligibility is evaluated",
              desc: "Business data is evaluated against the lender's underwriting policy and transformed into a privacy-preserving commitment.",
            },
            {
              icon: EyeOff,
              title: "Credit Passport is issued",
              desc: "The lender receives only the Credit Passport containing verification results and privacy-preserving commitments.",
            },
            {
              icon: Wallet,
              title: "Loan can be settled",
              desc: "After verification, approved credit can be disbursed through Stellar USDC.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              viewport={{ once: true, amount: 0.35 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="surface-card group rounded-2xl p-5"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.08 }}
                className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-900 transition-colors duration-500 dark:bg-white/10 dark:text-teal-200"
              >
                <item.icon size={21} />
              </motion.div>

              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.desc}
              </p>

              <div className="mt-5 h-1 w-10 rounded-full bg-teal-500/50 transition-all group-hover:w-20 dark:bg-teal-300/50" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.25 }}
          className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)] transition-colors duration-500 dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_24px_90px_rgba(0,0,0,0.32)] md:p-8"
        >
          <motion.div
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -20, 30, 0],
              opacity: [0.18, 0.28, 0.18],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-teal-300/25 blur-3xl"
          />

          <div className="relative z-10 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
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
                  title: "Credit eligibility",
                  desc: "Evaluate revenue eligibility without revealing exact revenue.",
                },
                {
                  icon: ShieldCheck,
                  title: "Privacy-preserving commitments",
                  desc: "Midnight stores commitments instead of sensitive business records.",
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
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  viewport={{ once: true, amount: 0.35 }}
                  whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.08)" }}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition"
                >
                  <item.icon className="text-teal-300" size={20} />

                  <p className="mt-3 font-semibold text-white">{item.title}</p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}