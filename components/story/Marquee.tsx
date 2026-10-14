"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";

// 전광판 — CSS 애니메이션이 아니라 프레임마다 일정 px/s 로 옮긴다.
// (CSS 방식은 OS의 "동작 줄이기" 설정에 전부 꺼지고, 길이에 따라 속도가 달라졌다.)
export function Marquee({ text, speed = 60 }: { text: string; speed?: number }) {
  const x = useMotionValue(0);
  const first = useRef<HTMLSpanElement>(null);

  useAnimationFrame((_, delta) => {
    const w = first.current?.offsetWidth ?? 0;
    if (!w || delta > 200) return; // 탭 복귀 직후 큰 delta 는 건너뛴다
    let next = x.get() - (speed * delta) / 1000;
    if (next <= -w) next += w;
    x.set(next);
  });

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-term-line bg-term-bg py-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
    >
      <motion.div
        style={{ x }}
        className="flex w-max whitespace-nowrap font-mono text-2xl font-bold uppercase tracking-[0.25em] text-term-green sm:text-4xl"
      >
        <span ref={first} className="pr-10">
          {text}
        </span>
        <span className="pr-10">{text}</span>
      </motion.div>
    </div>
  );
}
