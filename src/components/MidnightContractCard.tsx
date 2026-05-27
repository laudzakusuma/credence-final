"use client";

import { MIDNIGHT_CONTRACT } from "@/lib/midnight";
import {
  CheckCircle2,
  CircuitBoard,
  Copy,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

function shorten(value: string) {
  return `${value.slice(0, 12)}...${value.slice(-10)}`;
}

export default function MidnightContractCard() {
  async function copyAddress() {
    await navigator.clipboard.writeText(MIDNIGHT_CONTRACT.address);
    toast.success("Midnight contract address copied");
  }

  return (
    <div className="surface-card rounded-[1.75rem] p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:border-teal-300/15 dark:bg-teal-400/10 dark:text-teal-300">
            <CheckCircle2 size={14} />
            {MIDNIGHT_CONTRACT.status}
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Midnight confidential contract
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Credence registers private credit passport commitments on a
            Midnight Compact contract. The contract was compiled and deployed
            through the official Midnight toolchain in GitHub Codespaces, while
            raw sales records, customers, and exact revenue are never stored
            on-chain.
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ExternalLink size={14} />
          Deployment notes: docs/midnight-deployment.md
        </div>

        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <ShieldCheck size={22} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="muted-surface rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Contract address
          </p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="break-all font-mono text-sm text-slate-950 dark:text-white">
              {MIDNIGHT_CONTRACT.address}
            </p>

            <button
              onClick={copyAddress}
              className="secondary-action inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition"
            >
              Copy
              <Copy size={14} />
            </button>
          </div>
        </div>

        <div className="muted-surface rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Network
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">
            {MIDNIGHT_CONTRACT.network}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Deployed at {new Date(MIDNIGHT_CONTRACT.deployedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {MIDNIGHT_CONTRACT.circuits.map((circuit) => (
          <div
            key={circuit}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
              <CircuitBoard size={17} />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Circuit
              </p>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                {circuit}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <ExternalLink size={14} />
        Contract source: midnight-contract/contracts/credence.compact
      </div>
    </div>
  );
}