"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function AnimatedBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="
        relative mb-6 inline-flex items-center gap-2 rounded-full border
        border-teal-700/15 bg-white/85 px-4 py-2 text-sm font-semibold
        text-teal-800 shadow-sm backdrop-blur-xl
        dark:border-teal-300/20 dark:bg-white/5 dark:text-teal-200
      "
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="grid h-6 w-6 place-items-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
      >
        <ShieldCheck size={14} />
      </motion.span>

      Dirancang untuk penilaian kredit yang mengutamakan privasi

      <motion.span
        animate={{ x: ["-20%", "120%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-y-0 left-0 w-16 rounded-full bg-white/40 blur-xl dark:bg-white/10"
      />
    </motion.div>
  );
}