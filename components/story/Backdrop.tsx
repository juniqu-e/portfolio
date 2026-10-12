"use client";

import { motion, useScroll, useTransform } from "motion/react";

// 참고 사이트의 OrbBackground 대응 — WebGL 대신 흐린 빛 덩어리 두 개 + 주사선.
// 스크롤이 내려갈수록 초록 → 호박색으로 옮겨 간다.
export function Backdrop() {
  const { scrollYProgress } = useScroll();
  const greenOpacity = useTransform(scrollYProgress, [0, 0.7], [0.55, 0.15]);
  const amberOpacity = useTransform(scrollYProgress, [0.2, 0.9], [0.05, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "-30vh"]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{ opacity: greenOpacity, y }}
        className="story-orb absolute left-[10%] top-[15%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,#1f7a43_0%,transparent_65%)] blur-3xl"
      />
      <motion.div
        style={{ opacity: amberOpacity }}
        className="story-orb-2 absolute bottom-[-20%] right-[-10%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,#8a5a14_0%,transparent_65%)] blur-3xl"
      />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.025)_0px,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_3px)]" />
    </div>
  );
}
