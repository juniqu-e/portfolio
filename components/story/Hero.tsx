"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CAREER_START } from "./data";
import { MOTTOS } from "@/content/story";

// 참고 사이트의 WEDDING 대형 글자 대응 — INFRA 다섯 글자가 아래에서 차례로 올라온다.
const WORD = "INFRA".split("");
const EASE = [0.16, 1, 0.3, 1] as const;

function useUptime() {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    const start = new Date(CAREER_START).getTime();
    const tick = () => {
      const s = Math.floor((Date.now() - start) / 1000);
      const d = Math.floor(s / 86400);
      const hh = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      setText(`${d}d ${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return text;
}

export function Hero({ ready }: { ready: boolean }) {
  const uptime = useUptime();
  const state = ready ? "on" : "off";

  return (
    <section
      aria-labelledby="story-hero"
      className="relative flex min-h-svh flex-col justify-center px-4 pb-16 pt-24 sm:px-8"
    >
      <motion.p
        initial="off"
        animate={state}
        variants={{ off: { opacity: 0 }, on: { opacity: 1, transition: { delay: 0.1 } } }}
        className="font-mono text-xs text-term-muted sm:text-sm"
      >
        (infrastructure engineer)
      </motion.p>

      <h1 id="story-hero" className="sr-only">
        이준익 — Infrastructure Engineer
      </h1>
      <div
        aria-hidden="true"
        className="mt-2 flex justify-between font-mono text-[25vw] font-bold leading-[0.85] tracking-tighter text-term-ink sm:text-[22vw]"
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
          on: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.7 } },
        }}
        className="mt-6 grid gap-6 border-t border-term-line pt-5 font-mono sm:grid-cols-3 sm:items-end"
      >
        <p className="text-2xl font-bold text-term-ink sm:text-3xl">
          lee <span className="text-term-green">junik</span>
        </p>
        <p className="text-sm text-term-muted sm:text-center">
          <span className="text-term-ink">2024</span> → <span className="text-term-ink">2026</span>
          <span className="block text-xs text-term-dim">서버 · 클라우드</span>
        </p>
        <p className="text-sm text-term-muted sm:text-right">
          uptime <span className="tabular-nums text-term-green">{uptime ?? "--d --:--:--"}</span>
          <span className="block text-xs text-term-dim">since 2024.07 · SSAFY 입과</span>
        </p>
      </motion.div>

      <motion.p
        initial="off"
        animate={state}
        variants={{
          off: { opacity: 0, y: 12 },
          on: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.95 } },
        }}
        className="mt-10 max-w-2xl break-keep text-lg leading-snug text-term-ink sm:text-2xl"
      >
        <span className="mr-3 font-mono text-sm text-term-green sm:text-base">&gt;</span>
        {MOTTOS.tech}
      </motion.p>

      <motion.a
        href="#philosophy"
        initial="off"
        animate={state}
        variants={{ off: { opacity: 0 }, on: { opacity: 1, transition: { delay: 1.2 } } }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 font-mono text-xs text-term-muted transition-colors hover:text-term-green"
      >
        <span className="block text-center">scroll</span>
        <motion.span
          className="block text-center"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.a>
    </section>
  );
}
