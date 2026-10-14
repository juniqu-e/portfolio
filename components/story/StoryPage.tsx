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
import { Guestbook } from "./Guestbook";
import { TerminalWindow } from "./TerminalWindow";
import { Timeline } from "./Timeline";
import { Certifications } from "./Certifications";
import { Stack } from "./Stack";
import { lenisRef } from "./lenis";

// /story — wedding.tonami-komuro.com 의 구성을 커리어로 옮긴 실험 페이지.
// 부팅 → INFRA → 15초 영상 → 두 문장(철학) → 타임라인(카드 → 상세) → certifications → stack → 방명록 → 연락처 → 크레딧. 터미널은 떠 있는 창(TerminalWindow)으로 어디서든.
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: true });
    lenisRef.current = lenis;
    return () => {
      lenisRef.current = null;
      lenis.destroy();
    };
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
      <div id="top" className="relative min-h-svh bg-term-bg text-term-ink selection:bg-term-green selection:text-term-bg">
        <Boot onDone={onBooted} />
        <Backdrop />
        <Chrome />
        <TerminalWindow />
        <main id="main" className="relative z-10">
          <Hero ready={ready} />
          <Philosophy />
          <Timeline />
          <Certifications />
          <Stack />
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
