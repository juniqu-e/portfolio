"use client";

import { motion } from "motion/react";
import { terminalBus } from "./terminal-bus";

// 메인 화면 — INFRA 대형 글자. 터미널은 페이지 어디서든 떠 있는 창(TerminalWindow)이다.
const WORD = "INFRA".split("");
const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ ready }: { ready: boolean }) {
  const state = ready ? "on" : "off";

  return (
    <section
      aria-labelledby="story-hero"
      className="relative flex min-h-svh flex-col justify-center px-4 pb-16 pt-20 sm:px-8"
    >
      <motion.p
        initial="off"
        animate={state}
        variants={{ off: { opacity: 0 }, on: { opacity: 1, transition: { delay: 0.1 } } }}
        className="font-mono text-xs text-term-muted sm:text-sm"
      >
        (infrastructure engineer) <span className="text-term-dim">— lee junik</span>
      </motion.p>

      <h1 id="story-hero" className="sr-only">
        이준익 — Infrastructure Engineer
      </h1>
      <div
        aria-hidden="true"
        className="mt-2 flex justify-between font-mono text-[18vw] font-bold leading-[0.85] tracking-tighter text-term-ink sm:text-[12vw]"
      >
        {WORD.map((ch, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial="off"
              animate={state}
              variants={{
                off: { y: "105%" },
                on: { y: "0%", transition: { duration: 1.1, ease: EASE, delay: 0.15 + i * 0.08 } },
              }}
            >
              {ch}
            </motion.span>
          </span>
        ))}
      </div>

      <motion.div
        initial="off"
        animate={state}
        variants={{
          off: { opacity: 0, y: 16 },
          on: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.85 } },
        }}
        className="mt-6 grid gap-6 border-t border-term-line pt-5 font-mono sm:grid-cols-3 sm:items-end"
      >
        <p className="text-2xl font-bold text-term-ink sm:text-3xl">
          lee <span className="text-term-green">junik</span>
        </p>
        <p className="text-sm text-term-muted sm:text-center">
          <span className="text-term-ink">2024</span> → <span className="text-term-ink">2026</span>
          <span className="block text-xs text-term-dim">서버 · 클라우드 — 인프라 엔지니어</span>
        </p>
        <div className="text-sm text-term-muted sm:text-right">
          <p className="text-xs text-term-ink">이 페이지는 터미널로 돌아다닐 수 있습니다.</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => terminalBus.open?.()}
              className="border border-term-green/60 px-3 py-1.5 text-xs text-term-green transition-colors duration-200 ease-out hover:bg-term-green hover:text-term-bg"
            >
              <span>$</span> open terminal
            </button>
            <span className="text-xs text-term-dim">
              ls · cd story · cd philosophy · 키보드{" "}
              <kbd className="border border-term-line px-1 text-term-muted">`</kbd>
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
