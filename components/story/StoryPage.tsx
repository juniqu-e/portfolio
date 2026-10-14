"use client";

import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";
import { Backdrop } from "./Backdrop";
import { Boot } from "./Boot";
import { Chrome } from "./Chrome";
import { Hero } from "./Hero";
import { Contact, Credits } from "./Outro";
import { Philosophy } from "./Philosophy";
import { Story } from "./Story";
import { Guestbook } from "./Guestbook";
import { Timeline } from "./Timeline";
import { Whoami } from "./Whoami";

// /story — wedding.tonami-komuro.com 의 구성을 커리어로 옮긴 실험 페이지.
// 부팅 → INFRA → 두 문장(철학) → story.md → whoami → 타임라인(카드 → 상세) → 방명록 → 연락처 → 크레딧.
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: true });
    return () => lenis.destroy();
  }, []);
}

export function StoryPage() {
  const [ready, setReady] = useState(false);
  const onBooted = useCallback(() => setReady(true), []);
  useSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <noscript>
        <style>{"#boot{display:none}"}</style>
      </noscript>
      <div className="relative min-h-svh bg-term-bg text-term-ink selection:bg-term-green selection:text-term-bg">
        <Boot onDone={onBooted} />
        <Backdrop />
        <Chrome />
        <main id="main" className="relative z-10">
          <Hero ready={ready} />
          <Philosophy />
          <Story />
          <Whoami />
          <Timeline />
          <Guestbook />
          <Contact />
        </main>
        <div className="relative z-10">
          <Credits />
        </div>
      </div>
    </MotionConfig>
  );
}
