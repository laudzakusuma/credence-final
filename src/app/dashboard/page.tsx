"use client";

import Link from "next/link";
import MidnightContractCard from "@/components/MidnightContractCard";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import {
  buildMonthlyChart,
  calculateGrowth,
  calculateTotalRevenue,
  formatCompactIDR,
  formatIDR,
  sampleSales,
} from "@/lib/data";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  CheckCircle2,
  EyeOff,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const totalRevenue = calculateTotalRevenue(sampleSales);
  const growth = calculateGrowth(sampleSales);
  const chartData = buildMonthlyChart(sampleSales);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="page-section">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"
        >
          <div>
            <p className="page-eyebrow text-sm font-semibold uppercase tracking-[0.18em]">
              MSME Dashboard
            </p>
            <h1 className="page-title mt-3 text-4xl font-semibold tracking-[-0.035em] md:text-5xl">
              Nusantara Craft Co. credit readiness
            </h1>
            <p className="page-desc mt-4 max-w-2xl text-base leading-8">
              Sales data is analyzed privately. Lenders only receive a
              verification result, not raw business records.
            </p>
          </div>

          <Link
            href="/generate-proof"
            className="primary-action inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
          >
            Generate Credit passport
            <ArrowRight size={17} />
          </Link>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-4">
          <StatCard
            label="Private revenue"
            value={formatCompactIDR(totalRevenue)}
            helper="Exact sales stay private"
            icon={Banknote}
            tone="blue"
          />

          <StatCard
            label="Revenue growth"
            value={`${growth.toFixed(1)}%`}
            helper="Compared across periods"
            icon={TrendingUp}
            tone="green"
          />

          <StatCard
            label="Data exposure"
            value="0 rows"
            helper="Selective disclosure only"
            icon={EyeOff}
            tone="gold"
          />

          <StatCard
            label="Credit readiness"
            value="Eligible"
            helper="Ready for lender evaluation"
            icon={CheckCircle2}
            tone="green"
          />
        </div>
        
        <div className="mt-6">
          <MidnightContractCard />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="surface-card rounded-[1.75rem] p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  Revenue momentum
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Marketplace revenue from private data sources.
                </p>
              </div>

              <div className="rounded-xl bg-cyan-50 p-3 text-cyan-700 ring-1 ring-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-300 dark:ring-cyan-300/15">
                <BarChart3 size={22} />
              </div>
            </div>

            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#33415533" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    tickFormatter={(value: unknown) =>
                      `${Number(value) / 1000000}M`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      color: "#0f172a",
                      boxShadow: "0 18px 40px rgba(15,23,42,0.10)",
                    }}
                    formatter={(value: unknown) => formatIDR(Number(value))}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0f766e"
                    strokeWidth={3}
                    fill="url(#revenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="surface-card rounded-[1.75rem] p-6"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              What lenders can verify
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Lenders can verify these conditions without accessing private business records.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Revenue requirement satisfied",
                "Growth requirement satisfied",
                "Customer identities remain private",
                "Raw marketplace records never shared",
                "Credit eligibility ready for verification",
              ].map((item) => (
                <div
                  key={item}
                  className="muted-surface flex items-center gap-3 rounded-xl p-4"
                >
                  <CheckCircle2
                    className="text-emerald-600 dark:text-emerald-300"
                    size={18}
                  />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/generate-proof"
              className="primary-action mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
            >
              Generate Credit Passport
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}