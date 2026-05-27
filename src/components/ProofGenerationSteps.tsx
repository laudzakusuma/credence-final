"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  DatabaseZap,
  Fingerprint,
  LockKeyhole,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  active: boolean;
};

const steps = [
  {
    icon: DatabaseZap,
    title: "Reading private sales signals",
    desc: "Marketplace and bank records stay private.",
  },
  {
    icon: LockKeyhole,
    title: "Creating data commitment",
    desc: "Raw rows, customers, and exact revenue are hidden.",
  },
  {
    icon: Fingerprint,
    title: "Generating proof commitment",
    desc: "Credence prepares a verifiable privacy proof.",
  },
  {
    icon: QrCode,
    title: "Preparing lender QR package",
    desc: "Only proof status and selected criteria are shared.",
  },
];

export default function ProofGenerationSteps({ active }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) return prev;
        return prev + 1;
      });
    }, 430);

    return () => clearInterval(interval);
  }, [active]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="muted-surface relative grid min-h-[520px] place-items-center overflow-hidden rounded-[1.5rem] border-dashed p-6">
      <motion.div
        animate={{
          scale: [1, 1.14, 1],
          opacity: [0.22, 0.34, 0.22],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/40 blur-3xl dark:bg-teal-400/12"
      />

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center">
          <div className="relative mx-auto h-24 w-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-[2rem] border border-teal-400/30 border-t-teal-600 dark:border-teal-300/15 dark:border-t-teal-300"
            />

            <motion.div
              animate={{
                scale: [0.92, 1, 0.92],
                boxShadow: [
                  "0 0 0 rgba(20,184,166,0)",
                  "0 0 38px rgba(20,184,166,0.28)",
                  "0 0 0 rgba(20,184,166,0)",
                ],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-3 grid place-items-center rounded-[1.6rem] bg-slate-950 text-white dark:bg-white dark:text-slate-950"
            >
              <ShieldCheck size={30} />
            </motion.div>
          </div>

          <motion.h2
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-7 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
          >
            {steps[currentStep].title}
          </motion.h2>

          <motion.p
            key={`${currentStep}-desc`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400"
          >
            {steps[currentStep].desc}
          </motion.p>
        </div>

        <div className="mt-8">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400"
            />
          </div>

          <div className="mt-5 grid gap-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isDone = index < currentStep;
              const isActive = index === currentStep;

              return (
                <motion.div
                  key={step.title}
                  animate={{
                    opacity: isActive || isDone ? 1 : 0.45,
                    scale: isActive ? 1.015 : 1,
                  }}
                  transition={{ duration: 0.25 }}
                  className={`
                    flex items-center gap-3 rounded-2xl border p-3 transition
                    ${
                      isActive
                        ? "border-teal-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)] dark:border-teal-300/20 dark:bg-white/[0.07]"
                        : "border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/[0.035]"
                    }
                  `}
                >
                  <div
                    className={`
                      grid h-9 w-9 shrink-0 place-items-center rounded-xl
                      ${
                        isDone
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                          : isActive
                            ? "bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
                            : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-500"
                      }
                    `}
                  >
                    {isDone ? <CheckCircle2 size={17} /> : <Icon size={17} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                      {step.title}
                    </p>
                  </div>

                  {isActive ? (
                    <motion.div
                      animate={{ opacity: [0.45, 1, 0.45] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="h-2 w-2 rounded-full bg-teal-500 dark:bg-teal-300"
                    />
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}