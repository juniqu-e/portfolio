"use client";

import { forwardRef, useImperativeHandle, useRef, type MouseEvent } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { resolveDetail, type Chapter } from "./data";

export type ChapterModalHandle = { open: () => void; close: () => void };

const TAG_COLOR = { OK: "text-term-green", RUN: "text-term-amber", INFO: "text-term-cyan" } as const;

// 타임라인 카드를 누르면 열리는 상세 — 터미널 테마의 native <dialog>.
// 내용은 data.ts 의 resolveDetail(프로젝트 + 덮어쓰기)이 전부 결정한다.
export const ChapterModal = forwardRef<ChapterModalHandle, { chapter: Chapter }>(
  function ChapterModal({ chapter }, externalRef) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(externalRef, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));
    const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) dialogRef.current?.close();
    };

    const d = resolveDetail(chapter);
    const titleId = `story-${chapter.id}-title`;
    const file = `~/story/${chapter.date.replace(".", "-")}-${chapter.id}.md`;

    return (
      <dialog
        ref={dialogRef}
        onClick={onDialogClick}
        aria-labelledby={titleId}
        className="m-auto w-[calc(100%-1.5rem)] max-w-3xl border border-term-line bg-term-panel p-0 text-term-ink backdrop:bg-term-bg/80"
      >
        <div
          data-lenis-prevent
          className="flex max-h-[85dvh] flex-col gap-8 overflow-y-auto p-6 sm:p-8"
        >
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-xs text-term-muted">
                <span className="text-term-green">$</span> cat {file}
              </p>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
                <span className="text-term-dim">{chapter.date}</span>
                <span className={TAG_COLOR[chapter.tag]}>[ {chapter.tag} ]</span>
                {d.award && <span className="text-term-amber">★ {d.award}</span>}
              </p>
              <h2 id={titleId} className="mt-2 break-keep text-2xl font-semibold sm:text-3xl">
                {chapter.title}
              </h2>
              {(d.period || d.role) && (
                <p className="mt-2 break-keep text-sm text-term-muted">
                  {d.period}
                  {d.period && d.role && " · "}
                  {d.role}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="닫기"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-term-muted transition-colors duration-200 ease-out hover:bg-term-line hover:text-term-ink"
            >
              <X size={20} weight="regular" />
            </button>
          </header>

          {d.metrics && d.metrics.length > 0 && (
            <dl className="grid grid-cols-2 gap-px border border-term-line bg-term-line font-mono sm:grid-cols-4">
              {d.metrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5 bg-term-panel px-4 py-3">
                  <dd className="order-1 text-xl font-bold tabular-nums text-term-ink">{m.value}</dd>
                  <dt className="order-2 text-xs text-term-dim">{m.label}</dt>
                </div>
              ))}
            </dl>
          )}

          {d.summary && d.summary.length > 0 && (
            <section aria-label="요약" className="flex flex-col gap-4">
              <h3 className="font-mono text-xs text-term-muted">
                <span className="text-term-green">##</span> summary
              </h3>
              <div className="flex flex-col gap-3 break-keep text-base leading-relaxed text-term-ink/90">
                {d.summary.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          )}

          {d.services && (
            <section aria-label="실행 중 서비스" className="flex flex-col gap-4">
              <h3 className="font-mono text-xs text-term-muted">
                <span className="text-term-green">$</span> docker ps --format table{" "}
                <span className="text-term-dim">
                  · {d.services.running} running · as of {d.services.asOf}
                </span>
              </h3>
              <div className="flex flex-col gap-5">
                {d.services.groups.map((g) => (
                  <div key={g.title}>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-term-dim">
                      {g.title}
                    </p>
                    <ul className="mt-2 divide-y divide-term-line border-y border-term-line">
                      {g.items.map((s) => (
                        <li
                          key={s.name}
                          className="grid gap-x-4 gap-y-0.5 py-2 text-sm sm:grid-cols-[11rem_1fr_auto]"
                        >
                          <span className="font-mono text-term-ink">
                            <span className="text-term-green">Up</span> {s.name}
                          </span>
                          <span className="break-keep text-term-muted">{s.role}</span>
                          {s.host ? (
                            <a
                              href={`https://${s.host}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-term-cyan transition-colors hover:text-term-green sm:text-right"
                            >
                              {s.host} ↗
                            </a>
                          ) : (
                            <span className="font-mono text-xs text-term-dim sm:text-right">internal</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {d.items && d.items.length > 0 && (
            <section aria-label={d.itemsTitle ?? "what i did"} className="flex flex-col gap-3">
              <h3 className="font-mono text-xs text-term-muted">
                <span className="text-term-green">##</span> {d.itemsTitle ?? "what i did"}
              </h3>
              <dl className="divide-y divide-term-line border-y border-term-line">
                {d.items.map((r) => (
                  <div key={r.area} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-6">
                    <dt className="text-sm font-medium text-term-ink">{r.area}</dt>
                    <dd className="break-keep text-sm leading-relaxed text-term-muted">{r.detail}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {d.stack && d.stack.length > 0 && (
            <section aria-label="기술" className="flex flex-col gap-3">
              <h3 className="font-mono text-xs text-term-muted">
                <span className="text-term-green">##</span> stack
              </h3>
              <ul className="flex flex-wrap gap-2">
                {d.stack.map((s) => (
                  <li key={s} className="border border-term-line px-2.5 py-1 font-mono text-xs text-term-muted">
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {d.links && d.links.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {d.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="font-mono text-xs text-term-cyan transition-colors duration-200 ease-out hover:text-term-green"
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    );
  },
);
