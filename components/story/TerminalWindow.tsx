"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useDragControls } from "motion/react";
import { Minus } from "@phosphor-icons/react/dist/ssr";
import { PROMPT, Terminal } from "./Terminal";
import { terminalBus } from "./terminal-bus";

// 페이지 어디서든 떠 있는 터미널 — 콘텐츠 위(z-50, 모달 top-layer 아래), 머리띠를 잡아 끌어 옮기고, 접으면 프롬프트 알약만 남는다.
const KEY = "story-term-open";

export function TerminalWindow() {
  const [open, setOpen] = useState<boolean | null>(null);
  const [fresh, setFresh] = useState(false);
  const boundsRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();

  // 첫 상태: 접힘 (2026-10-14 결정 — 콘텐츠를 가리지 않게). 같은 탭에서는 마지막 상태 유지.
  useEffect(() => {
    let initial = false;
    let seen = false;
    try {
      const v = sessionStorage.getItem(KEY);
      if (v !== null) {
        initial = v === "1";
        seen = true;
      }
    } catch {}
    setOpen(initial);
    setFresh(!seen);
  }, []);
  useEffect(() => {
    if (open === null) return;
    try {
      sessionStorage.setItem(KEY, open ? "1" : "0");
    } catch {}
  }, [open]);

  useEffect(() => {
    terminalBus.open = () => setOpen(true);
    terminalBus.close = () => setOpen(false);
    return () => {
      terminalBus.open = null;
      terminalBus.close = null;
    };
  }, []);

  // ` (백틱) 으로 열고 접기 — 입력 중일 때는 제외
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;
      if (e.key === "`") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (open === null) return null;

  return (
    <>
      {/* 드래그 범위 — 상단 프롬프트 바와 하단 진행 바 사이 */}
      <div ref={boundsRef} aria-hidden="true" className="pointer-events-none fixed inset-x-2 bottom-12 top-12 z-50 sm:inset-x-4" />

      <motion.div
        drag
        dragControls={controls}
        dragListener={false}
        dragConstraints={boundsRef}
        dragElastic={0}
        dragMomentum={false}
        role="region"
        aria-label="터미널"
        aria-hidden={!open}
        className={`fixed bottom-14 right-2 z-50 w-[calc(100vw-1rem)] max-w-[30rem] border border-term-line bg-term-panel shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] sm:right-4 ${
          open ? "" : "pointer-events-none invisible"
        }`}
      >
        <div
          onPointerDown={(e) => controls.start(e)}
          className="flex cursor-grab select-none touch-none items-center gap-2 border-b border-term-line px-3 py-2 font-mono text-xs text-term-dim active:cursor-grabbing"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-term-red/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-term-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-term-green/70" />
          <span className="ml-2 truncate">{PROMPT.replace("$", "")} — bash</span>
          <span className="ml-auto hidden text-term-dim sm:inline">drag · ` toggle</span>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setOpen(false)}
            aria-label="터미널 접기"
            className="ml-2 inline-flex h-6 w-6 items-center justify-center text-term-muted transition-colors duration-200 ease-out hover:bg-term-line hover:text-term-ink"
          >
            <Minus size={14} weight="regular" />
          </button>
        </div>
        <Terminal active={open} />
      </motion.div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="터미널 열기"
        className={`fixed bottom-14 right-2 z-50 flex items-center gap-2 border border-term-line bg-term-panel px-3 py-2 font-mono text-xs text-term-muted transition-colors duration-200 ease-out hover:border-term-green hover:text-term-green sm:right-4 ${
          open ? "pointer-events-none invisible" : ""
        } ${fresh && !open ? "story-attn border-term-green/60" : ""}`}
      >
        <span className="text-term-green">{PROMPT}</span>
        <span className="story-cursor inline-block h-3.5 w-2 bg-term-green" />
        <span className="ml-1 hidden text-term-dim sm:inline">terminal</span>
      </button>
    </>
  );
}
