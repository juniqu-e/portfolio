"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { PROJECTS } from "@/content/projects";
import { SectionHead, Reveal } from "./Reveal";

// 참고 사이트의 Date & Venue 대응 — "지금 어디서 무엇을" 을 systemctl status 로.
const LINES: { t: string; c?: string }[] = [
  { t: "● junik.service - Infrastructure Engineer (서버 · 클라우드)", c: "text-term-ink" },
  { t: "     Loaded: loaded (/etc/career/junik.service; enabled)" },
  { t: "     Active: active (running) since Mon 2024-07-01", c: "text-term-green" },
  { t: "   Main PID: RAPA 클라우드 보안 전문가 양성과정 (2026.07 ~ 2026.12)" },
  { t: "      Tasks: Linux 서버 서비스 구축 실습 · 홈서버 운영 · VCP 준비" },
  { t: "" },
  { t: "Sep 2026  정보처리기사 — acquired", c: "text-term-muted" },
  { t: "Oct 2026  CCNA 200-301 — acquired", c: "text-term-muted" },
  { t: "Nov 2026  VMware VCP — running", c: "text-term-amber" },
];

export function Status() {
  return (
    <section aria-label="현재 상태" className="relative px-4 py-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHead cmd="systemctl status junik" title="now" />
        <motion.pre
          className="mt-12 border border-term-line bg-term-panel/70 p-5 font-mono text-[12px] leading-7 text-term-muted sm:p-8 sm:text-sm"
          initial="off"
          whileInView="on"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={{ on: { transition: { staggerChildren: 0.12 } } }}
        >
          {LINES.map((l, i) => (
            <motion.span
              key={i}
              className={`block whitespace-pre-wrap break-keep ${l.c ?? ""}`}
              variants={{ off: { opacity: 0, x: -8 }, on: { opacity: 1, x: 0 } }}
            >
              {l.t || " "}
            </motion.span>
          ))}
        </motion.pre>
      </div>
    </section>
  );
}

// 운영 중인 서비스 — docker ps 표. 자세한 내용은 메인 페이지의 프로젝트 모달로 보낸다.
export function Services() {
  const live = PROJECTS.filter((p) => p.group === "in-operation");
  return (
    <section aria-label="운영 중인 서비스" className="relative px-4 py-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHead cmd="docker ps --filter status=running" title="running" />
        <div className="mt-12 border-t border-term-line">
          {live.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                href="/#projects"
                className="group grid gap-4 border-b border-term-line py-8 transition-colors hover:bg-term-panel/60 sm:grid-cols-[1fr_auto] sm:items-end sm:px-4"
              >
                <div>
                  <p className="font-mono text-xs text-term-dim">
                    <span className="text-term-green">Up</span> · {p.period}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-term-ink transition-colors group-hover:text-term-green sm:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-term-muted">
                    {p.tagline}
                  </p>
                </div>
                {p.metrics && (
                  <dl className="grid grid-cols-4 gap-4 font-mono sm:gap-6">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="min-w-0">
                        <dd className="text-lg font-bold tabular-nums text-term-ink sm:text-2xl">
                          {m.value}
                        </dd>
                        <dt className="mt-1 truncate text-[10px] text-term-dim sm:text-xs">
                          {m.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
