"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.12, 0.96, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[8%] top-[18%] h-[360px] w-[360px] rounded-full bg-teal-300/24 blur-3xl dark:bg-teal-400/12"
      />

      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.95, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[8%] bottom-[10%] h-[320px] w-[320px] rounded-full bg-cyan-200/28 blur-3xl dark:bg-cyan-400/10"
      />

      <motion.div
        animate={{
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(20,184,166,0.16),transparent_36%)] dark:bg-[radial-gradient(circle_at_50%_20%,rgba(20,184,166,0.10),transparent_38%)]"
      />
    </div>
  );
}