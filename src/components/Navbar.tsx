"use client";

import Image from "next/image";
import Link from "next/link";
import { Wallet } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { credenceWordmark } from "@/lib/fonts";

export default function Navbar() {
  return (
    <nav
      className="
        sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl
        dark:border-white/10 dark:bg-slate-950/88
      "
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logos/credence-logo-light.svg"
            alt="Credence logo"
            width={44}
            height={44}
            priority
            className="
              h-11 w-11 rounded-2xl shadow-sm
              dark:hidden
            "
          />

          <Image
            src="/logos/credence-logo-dark.svg"
            alt="Credence logo"
            width={44}
            height={44}
            priority
            className="
              hidden h-11 w-11 rounded-2xl shadow-sm
              dark:block
            "
          />

          <div>
            <p
              className={`${credenceWordmark.className} text-[1.75rem] font-bold leading-none tracking-[-0.055em] text-slate-950 dark:text-white`}
            >
              Credence
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Private credit infrastructure
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <Link className="transition hover:text-slate-950 dark:hover:text-white" href="/dashboard">
            Dashboard
          </Link>
          <Link
            className="transition hover:text-slate-950 dark:hover:text-white"
            href="/generate-proof"
          >
            Generate proof
          </Link>
          <Link className="transition hover:text-slate-950 dark:hover:text-white" href="/bank">
            Bank portal
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/dashboard"
            className="
              flex items-center gap-2 rounded-xl border border-slate-200
              bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition
              hover:bg-slate-800
              dark:border-white/10 dark:bg-white dark:text-slate-950
              dark:hover:bg-slate-200
            "
          >
            <Wallet size={16} />
            Open app
          </Link>
        </div>
      </div>
    </nav>
  );
}