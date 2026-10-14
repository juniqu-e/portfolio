"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { CHAPTERS, type Chapter } from "./data";
import { ChapterModal, type ChapterModalHandle } from "./ChapterModal";

// 참고 사이트의 Our Story 대응 — 세로 스크롤을 가로 이동으로 바꾼 고정 타임라인. 카드를 누르면 상세.
const TAG_COLOR = {
  OK: "text-term-green",
  RUN: "text-term-amber",
  INFO: "text-term-cyan",
} as const;

function Card({ chapter, active }: { chapter: Chapter; active: boolean }) {
  const modalRef = useRef<ChapterModalHandle>(null);
  return (
    <li className="w-[78vw] max-w-[24rem] shrink-0">
      <button
        type="button"
        onClick={() => modalRef.current?.open()}
        aria-label={`${chapter.title} 상세 보기`}
        className={`group flex h-full w-full flex-col border p-6 text-left font-mono transition-colors duration-300 ease-out hover:border-term-green/70 hover:bg-term-panel focus-visible:border-term-green sm:p-8 ${
          active ? "border-term-green/60 bg-term-panel/90" : "border-term-line bg-term-panel/40"
        }`}
      >
        <p className="flex items-center justify-between text-xs">
          <span className="text-term-dim">{chapter.date}</span>
          <span className={TAG_COLOR[chapter.tag]}>[ {chapter.tag.padEnd(4, " ")} ]</span>
        </p>
        <h3 className="mt-6 break-keep font-sans text-xl font-semibold text-term-ink sm:text-2xl">
          {chapter.title}
        </h3>
        {chapter.url && (
          <span className="mt-1 block text-xs text-term-cyan">{chapter.url}</span>
        )}
        <p className="mt-3 break-keep font-sans text-sm leading-relaxed text-term-muted sm:text-base">
          {chapter.body}
        </p>
        <span className="mt-auto pt-6 text-xs text-term-dim transition-colors group-hover:text-term-green">
          <span className="text-term-green">$</span> cat --more <span aria-hidden>→</span>
        </span>
      </button>
      <ChapterModal ref={modalRef} chapter={chapter} />
    </li>
  );
}

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
      id="story"
      aria-label="커리어 타임라인"
      className="relative"
      style={{ height: `${CHAPTERS.length * 45 + 100}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="px-4 sm:px-8">
          <p className="font-mono text-xs text-term-muted sm:text-sm">
            <span className="text-term-green">$</span> journalctl -u junik --since 2024-07{" "}
            <span className="text-term-dim">· 카드를 누르면 자세히</span>
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
          className="mt-10 flex w-max items-stretch gap-4 px-4 sm:gap-6 sm:px-8"
        >
          {CHAPTERS.map((c, i) => (
            <Card key={c.id} chapter={c} active={i === active} />
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
