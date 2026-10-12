"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { CHAPTERS } from "./data";

// 참고 사이트의 Our Story 대응 — 세로 스크롤을 가로 이동으로 바꾼 고정 타임라인.
const TAG_COLOR = {
  OK: "text-term-green",
  RUN: "text-term-amber",
  INFO: "text-term-cyan",
} as const;

export function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const measure = () => {
      const el = track.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(CHAPTERS.length - 1, Math.round(v * (CHAPTERS.length - 1)))),
  );

  const current = CHAPTERS[active]!;

  return (
    <section
      ref={ref}
      aria-label="커리어 타임라인"
      className="relative"
      style={{ height: `${CHAPTERS.length * 55 + 100}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="px-4 sm:px-8">
          <p className="font-mono text-xs text-term-muted sm:text-sm">
            <span className="text-term-green">$</span> journalctl -u junik --since 2024-07
          </p>
          <div className="mt-3 flex items-end justify-between gap-4 font-mono">
            <h2 className="text-4xl font-bold tracking-tight text-term-ink sm:text-6xl">story</h2>
            <p
              aria-hidden="true"
              className="flex text-5xl font-bold tabular-nums text-term-ink sm:text-8xl"
            >
              {current.date.split("").map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <motion.span
                    key={`${active}-${i}`}
                    className={`inline-block ${ch === "." ? "text-term-dim" : ""}`}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </p>
          </div>
          <div className="mt-6 h-px bg-term-line">
            <motion.div className="h-px origin-left bg-term-green" style={{ scaleX: fill }} />
          </div>
        </div>

        <motion.ol
          ref={track}
          style={{ x }}
          className="mt-10 flex w-max gap-4 px-4 sm:gap-6 sm:px-8"
        >
          {CHAPTERS.map((c, i) => (
            <li
              key={c.date}
              className={`w-[78vw] max-w-[24rem] shrink-0 border p-6 font-mono transition-colors duration-500 sm:p-8 ${
                i === active
                  ? "border-term-green/60 bg-term-panel/90"
                  : "border-term-line bg-term-panel/40"
              }`}
            >
              <p className="flex items-center justify-between text-xs">
                <span className="text-term-dim">{c.date}</span>
                <span className={TAG_COLOR[c.tag]}>[ {c.tag.padEnd(4, " ")} ]</span>
              </p>
              <h3 className="mt-6 font-sans text-xl font-semibold text-term-ink sm:text-2xl">
                {c.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-term-muted sm:text-base">
                {c.body}
              </p>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
