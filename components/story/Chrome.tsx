"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";

// 화면 테두리 고정 UI — 상단 프롬프트·상태, 하단 스크롤 진행도. 참고 사이트의 Chrome/Nav 대응.
function useClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Chrome() {
  const clock = useClock();
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const [pct, setPct] = useState(0);
  useEffect(
    () => scrollYProgress.on("change", (v) => setPct(Math.round(v * 100))),
    [scrollYProgress],
  );

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-gradient-to-b from-term-bg via-term-bg/80 to-transparent px-4 pb-6 pt-3 font-mono text-[11px] text-term-muted sm:px-6 sm:text-xs">
        <Link href="/" className="pointer-events-auto transition-colors hover:text-term-green">
          <span className="text-term-green">junik@homeserver</span>:
          <span className="text-term-cyan">~/story</span>$
        </Link>
        <p className="flex items-center gap-3">
          <span className="hidden tabular-nums sm:inline">{clock ?? "--:--:--"} KST</span>
          <span className="flex items-center gap-1.5 text-term-ink">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-term-green opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-term-green" />
            </span>
            ONLINE
          </span>
        </p>
      </header>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 bg-gradient-to-t from-term-bg via-term-bg/80 to-transparent px-4 pb-3 pt-6 font-mono text-[11px] text-term-dim sm:px-6 sm:text-xs">
        <span className="tabular-nums">{String(pct).padStart(3, " ")}%</span>
        <div className="h-px flex-1 bg-term-line">
          <motion.div className="h-px origin-left bg-term-green" style={{ scaleX: bar }} />
        </div>
        <Link href="/" className="pointer-events-auto transition-colors hover:text-term-green">
          cd ~
        </Link>
      </div>
    </>
  );
}
