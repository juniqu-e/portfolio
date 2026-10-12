"use client";

import { Fragment, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import type { Paragraph } from "@/types";
import { PROFILE } from "@/content/profile";

// 화면 고정 후 장면 전환 — 섹션이 문단 수만큼 길어지고, 안쪽 프레임은 sticky로 멈춘 채
// 스크롤 진행도에 따라 문단이 한 장면씩 교체된다. reduced-motion이면 정적 목록으로 렌더.

const SCENES = PROFILE.aboutBody;
const COUNT = SCENES.length;

function renderSegments(p: Paragraph) {
  return p.map((seg, idx) =>
    seg.emphasis ? (
      <strong key={idx} className="font-semibold text-ink">
        {seg.text}
      </strong>
    ) : (
      <Fragment key={idx}>{seg.text}</Fragment>
    ),
  );
}

function Heading() {
  return (
    <h2
      id="about-heading"
      className="font-display text-3xl font-semibold tracking-display text-ink sm:text-4xl"
    >
      About
    </h2>
  );
}

function StaticAbout() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto max-w-prose px-6 py-16 sm:py-24"
    >
      <Heading />
      <div className="mt-8 flex flex-col gap-6">
        {SCENES.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-muted sm:text-lg">
            {renderSegments(p)}
          </p>
        ))}
      </div>
    </section>
  );
}

function ProgressSegment({
  index,
  progress,
  onSelect,
}: {
  index: number;
  progress: MotionValue<number>;
  onSelect: (i: number) => void;
}) {
  const fill = useTransform(progress, [index / COUNT, (index + 1) / COUNT], [0, 1]);
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`${index + 1}번째 문단으로 이동`}
      className="group flex h-6 flex-1 items-center"
    >
      <span className="relative h-0.5 w-full overflow-hidden bg-line transition-[height] group-hover:h-1">
        <motion.span
          className="absolute inset-0 origin-left bg-accent-blue"
          style={{ scaleX: fill }}
        />
      </span>
    </button>
  );
}

function ScrollAbout() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT))));
  });

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + scrollable * ((i + 0.5) / COUNT), behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-heading"
      className="relative"
      style={{ height: `${COUNT * 85 + 15}svh` }}
    >
      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] items-center">
        <div className="mx-auto w-full max-w-prose px-6">
          <div className="flex items-baseline justify-between gap-4">
            <Heading />
            <p className="font-mono text-sm tabular-nums text-subtle" aria-hidden="true">
              <span className="text-ink">{String(active + 1).padStart(2, "0")}</span>
              {" / "}
              {String(COUNT).padStart(2, "0")}
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            {SCENES.map((_, i) => (
              <ProgressSegment key={i} index={i} progress={scrollYProgress} onSelect={jumpTo} />
            ))}
          </div>

          <div className="mt-10 grid sm:mt-14">
            {SCENES.map((p, i) => {
              const state = i === active ? "on" : i < active ? "past" : "next";
              return (
                <motion.p
                  key={i}
                  initial={false}
                  animate={state}
                  variants={{
                    on: { opacity: 1, y: 0, filter: "blur(0px)" },
                    past: { opacity: 0, y: -28, filter: "blur(4px)" },
                    next: { opacity: 0, y: 28, filter: "blur(4px)" },
                  }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="text-xl leading-relaxed text-muted [grid-area:1/1] sm:text-2xl sm:leading-relaxed"
                  style={{ pointerEvents: i === active ? "auto" : "none" }}
                >
                  {renderSegments(p)}
                </motion.p>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  const reduce = useReducedMotion();
  return reduce ? <StaticAbout /> : <ScrollAbout />;
}
