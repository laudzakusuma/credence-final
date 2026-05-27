"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function AnimatedPhoneMockup() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { isDark } = useTheme();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateYRaw = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]);
  const rotateXRaw = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -4]);
  const rotateZRaw = useTransform(scrollYProgress, [0, 0.5, 1], [-2, 0, 2]);
  const yRaw = useTransform(scrollYProgress, [0, 0.5, 1], [45, 0, -45]);
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1.03, 0.98]);

  const rotateY = useSpring(rotateYRaw, { stiffness: 90, damping: 24 });
  const rotateX = useSpring(rotateXRaw, { stiffness: 90, damping: 24 });
  const rotateZ = useSpring(rotateZRaw, { stiffness: 90, damping: 24 });
  const y = useSpring(yRaw, { stiffness: 90, damping: 24 });
  const scale = useSpring(scaleRaw, { stiffness: 90, damping: 22 });

  const mockupSrc = isDark
    ? "/mockups/credence-phone-dark.png"
    : "/mockups/credence-phone-light.png";

  return (
    <div
      ref={ref}
      className="relative flex min-h-[600px] w-full items-center justify-center overflow-visible"
    >
      <div
        className="
          absolute left-1/2 top-1/2 h-[500px] w-[500px]
          -translate-x-1/2 -translate-y-1/2 rounded-full
          bg-teal-100/80 blur-3xl
          dark:bg-teal-500/10
        "
      />

      <div
        className="
          absolute bottom-16 left-1/2 h-20 w-[420px]
          -translate-x-1/2 rounded-full bg-slate-900/18 blur-3xl
          dark:bg-black/50
        "
      />

      <motion.div
        key={mockupSrc}
        style={{
          rotateY,
          rotateX,
          rotateZ,
          y,
          scale,
          transformPerspective: 1400,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{
          opacity: 1,
          filter: isDark
            ? "drop-shadow(0px 55px 90px rgba(0,0,0,0.58))"
            : "drop-shadow(0px 45px 70px rgba(15,23,42,0.25))",
        }}
        whileHover={{
          rotateZ: 0,
          scale: 1.04,
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.35 }}
        className="relative z-10"
      >
        <Image
          src={mockupSrc}
          alt={
            isDark
              ? "Credence dark mode mobile app mockup"
              : "Credence light mode mobile app mockup"
          }
          width={1200}
          height={1500}
          priority
          className="
            w-[390px] max-w-none object-contain
            md:w-[460px] lg:w-[520px] xl:w-[560px]
          "
        />
      </motion.div>
    </div>
  );
}