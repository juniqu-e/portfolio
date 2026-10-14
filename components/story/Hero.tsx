"use client";

import { motion } from "motion/react";
import { Terminal } from "./Terminal";

// 메인 화면 — INFRA 대형 글자 + 실제로 명령을 칠 수 있는 터미널.
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
          on: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.75 } },
        }}
        className="mt-8"
      >
        <Terminal />
      </motion.div>
    </section>
  );
}
