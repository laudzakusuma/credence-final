"use client";

import { CheckCircle2, Lock, ShieldCheck, XCircle } from "lucide-react";

type Props = {
  verified: boolean;
};

export default function ProofBadge({ verified }: Props) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] ${
        verified
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-300/15 dark:bg-emerald-400/10"
          : "border-red-200 bg-red-50 dark:border-red-300/15 dark:bg-red-400/10"
      }`}
    >
      <div className="flex items-center gap-3">
        {verified ? (
          <CheckCircle2 className="text-emerald-700 dark:text-emerald-300" size={28} />
        ) : (
          <XCircle className="text-red-700 dark:text-red-300" size={28} />
        )}

        <div>
          <p
            className={`text-lg font-semibold ${
              verified
                ? "text-emerald-900 dark:text-emerald-100"
                : "text-red-900 dark:text-red-100"
            }`}
          >
            {verified ? "Verified credit passport" : "Proof not eligible"}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {verified
              ? "Criteria passed without exposing raw business data."
              : "The submitted proof does not meet the requested criteria."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 p-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          <Lock size={16} className="text-teal-700 dark:text-teal-300" />
          Raw transactions hidden
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 p-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          <ShieldCheck size={16} className="text-emerald-700 dark:text-emerald-300" />
          Verified with privacy proof
        </div>
      </div>
    </div>
  );
}