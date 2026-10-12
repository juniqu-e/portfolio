"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { PROFILE } from "@/content/profile";

// 참고 사이트의 Message 대응 — 화면 고정 후 철학 4장면. 강조 구절을 큰 제목으로 꺼내 쓴다.
const SCENES = PROFILE.aboutBody.map((p) => ({
  head: p.find((s) => s.emphasis)?.text ?? "",
  body: p.map((s) => s.text).join(""),
}));
const COUNT = SCENES.length;
const EASE = [0.16, 1, 0.3, 1] as const;

export function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT)))),
  );

  return (
    <section
      ref={ref}
      id="philosophy"
      aria-label="인프라 철학"
      className="relative"
      style={{ height: `${COUNT * 90 + 10}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center px-4 sm:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-xs text-term-muted sm:text-sm">
            <span className="text-term-green">$</span> cat ~/philosophy.md{" "}
            <span className="text-term-dim">
              [{active + 1}/{COUNT}]
            </span>
          </p>

          <div className="mt-8 grid">
            {SCENES.map((s, i) => {
              const on = i === active;
              return (
                <div key={i} className="[grid-area:1/1]" aria-hidden={!on}>
                  <p className="overflow-hidden font-mono text-sm text-term-amber">
                    <motion.span
                      className="block"
                      initial={false}
                      animate={{ y: on ? "0%" : "110%" }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      0{i + 1}
                    </motion.span>
                  </p>
                  <h2 className="mt-3 overflow-hidden pb-1 text-3xl font-bold leading-tight text-term-ink sm:text-6xl">
                    <motion.span
                      className="block"
                      initial={false}
                      animate={{ y: on ? "0%" : i < active ? "-110%" : "110%" }}
                      transition={{ duration: 0.8, ease: EASE }}
                    >
                      {s.head}
                    </motion.span>
                  </h2>
                  <motion.p
                    initial={false}
                    animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }}
                    transition={{ duration: 0.6, ease: EASE, delay: on ? 0.15 : 0 }}
                    className="mt-8 max-w-2xl text-base leading-relaxed text-term-muted sm:text-lg"
                  >
                    {s.body}
                  </motion.p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
