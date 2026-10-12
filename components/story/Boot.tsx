"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BOOT_LOG } from "./data";

// 첫 방문에만 1.4초 부팅 화면. 같은 탭에서 다시 오면(sessionStorage) 건너뛴다.
const KEY = "story-booted";
const DURATION = 1400;

export function Boot({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      skip = skip || sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (skip) {
      setDone(true);
      return;
    }

    const root = document.documentElement;
    root.style.overflow = "hidden";
    let raf = 0;
    let finish: ReturnType<typeof setTimeout>;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / DURATION);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else
        finish = setTimeout(() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          setDone(true);
        }, 380);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(finish);
      root.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    document.documentElement.style.overflow = "";
    onDone();
  }, [done, onDone]);

  const R = 46;
  const C = 2 * Math.PI * R;
  const shown = Math.min(BOOT_LOG.length, Math.floor((pct / 100) * (BOOT_LOG.length + 0.5)));

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          id="boot"
          key="boot"
          role="status"
          aria-label="페이지 불러오는 중"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-term-bg"
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative h-40 w-40">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r={R} fill="none" stroke="#1E2921" strokeWidth="1.5" />
              <circle
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke="#5CF08A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - pct / 100)}
              />
            </svg>
            <p className="absolute inset-0 flex items-center justify-center font-mono text-4xl font-bold tabular-nums text-term-ink">
              {pct}
              <span className="ml-0.5 mt-3 text-sm text-term-green">%</span>
            </p>
          </div>
          <ul className="mt-10 h-24 w-[min(22rem,85vw)] font-mono text-xs leading-6 text-term-muted">
            {BOOT_LOG.slice(0, shown).map((line) => (
              <li key={line} className="truncate">
                <span className="text-term-green">[ OK ]</span> {line}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
