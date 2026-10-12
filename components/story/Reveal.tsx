"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// 화면에 들어올 때 한 번 아래에서 떠오르는 공통 래퍼.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// 섹션 머리 — `## whoami` 처럼 명령어 + 큰 제목.
export function SectionHead({ cmd, title }: { cmd: string; title: string }) {
  return (
    <Reveal>
      <p className="font-mono text-xs text-term-muted sm:text-sm">
        <span className="text-term-green">$</span> {cmd}
      </p>
      <h2 className="mt-3 font-mono text-4xl font-bold tracking-tight text-term-ink sm:text-6xl">
        {title}
      </h2>
    </Reveal>
  );
}
