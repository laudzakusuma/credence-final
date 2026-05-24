"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone?: "blue" | "gold" | "green";
};

export default function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "blue",
}: Props) {
  const toneMap = {
    blue: "text-cyan-700 bg-cyan-50 border-cyan-100 dark:text-cyan-300 dark:bg-cyan-400/10 dark:border-cyan-300/15",
    gold: "text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-300 dark:bg-amber-400/10 dark:border-amber-300/15",
    green: "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-300 dark:bg-emerald-400/10 dark:border-emerald-300/15",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="surface-card rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {value}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {helper}
          </p>
        </div>

        <div className={`rounded-xl border p-3 ${toneMap[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
    </motion.div>
  );
}