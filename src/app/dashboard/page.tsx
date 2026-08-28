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
              Dashboard UMKM
            </p>
            <h1 className="page-title mt-3 text-4xl font-semibold tracking-[-0.035em] md:text-5xl">
              Kesiapan kredit Nusantara Craft Co.
            </h1>
            <p className="page-desc mt-4 max-w-2xl text-base leading-8">
              Data penjualan dianalisis secara rahasia.
              Pemberi pinjaman hanya menerima hasil verifikasi, bukan data bisnis mentah.
            </p>
          </div>

          <Link
            href="/generate-proof"
            className="primary-action inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition"
          >
            Buat Paspor Kredit
            <ArrowRight size={17} />
          </Link>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-4">
          <StatCard
            label="Pendapatan privat"
            value={formatCompactIDR(totalRevenue)}
            helper="Nilai penjualan aktual tetap privat"
            icon={Banknote}
            tone="blue"
          />

          <StatCard
            label="Pertumbuhan pendapatan"
            value={`${growth.toFixed(1)}%`}
            helper="Dibandingkan antarperiode"
            icon={TrendingUp}
            tone="green"
          />

          <StatCard
            label="Data yang terbuka"
            value="0 rows"
            helper="Hanya selective disclosure"
            icon={EyeOff}
            tone="gold"
          />

          <StatCard
            label="Kesiapan proof"
            value="Memenuhi syarat"
            helper="Siap ditinjau lender"
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
                  Perkembangan pendapatan
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Pendapatan marketplace dari sumber data privat.
                </p>
              </div>

              <div className="rounded-xl bg-cyan-50 p-3 text-cyan-700 ring-1 ring-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-300 dark:ring-cyan-300/15">
                <BarChart3 size={22} />
              </div>
            </div>

            <div className="h-90">
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
              Informasi yang dapat dibuktikan
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Pernyataan ini dapat dibuktikan 
              tanpa perlu mengungkapkan catatan transaksi mentah.
            </p>

            <div className="mt-6 space-y-3">
              {[
                `Revenue above ${formatIDR(10000000)}`,
                "Pertumbuhan di atas 20%",
                "Identitas pelanggan tersembunyi",
                "Data transaksi tersembunyi",
                "Lender dapat memverifikasi secara instan",
              ].map((item) => (
                <div
                  key={item}
                  className="muted-surface flex items-center gap-3 rounded-xl p-4"
                >
                  <CheckCircle2 className="text-emerald-600 dark:text-emerald-300" size={18} />
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
              Buat proof privat
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}