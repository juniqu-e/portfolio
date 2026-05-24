"use client";

import { forwardRef, useImperativeHandle, useRef, type MouseEvent } from "react";
import { Trophy, X } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/types";

export type ProjectModalHandle = {
  open: () => void;
  close: () => void;
};

type Props = { project: Project };

export const ProjectModal = forwardRef<ProjectModalHandle, Props>(
  function ProjectModal({ project }, externalRef) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(externalRef, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));

    // Native <dialog> + ::backdrop. backdrop 클릭 시 닫기 — target 가 dialog 자체일 때만.
    const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) dialogRef.current?.close();
    };

    const titleId = `project-${project.slug}-title`;
    const paragraphs = project.description.split("\n\n");

    return (
      <dialog
        ref={dialogRef}
        onClick={onDialogClick}
        aria-labelledby={titleId}
        className="m-auto w-[calc(100%-1.5rem)] max-w-3xl rounded-lg border border-line bg-page p-0 backdrop:bg-ink/40"
      >
        <div className="flex max-h-[85dvh] flex-col gap-6 overflow-y-auto p-6 sm:p-8">
          <header className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              {project.award && (
                <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-accent-blue/10 px-2.5 py-1 text-xs font-medium text-accent-blue">
                  <Trophy size={14} weight="regular" aria-hidden />
                  {project.award.competition} · {project.award.rank}등
                </span>
              )}
              <h2
                id={titleId}
                className="font-display text-2xl font-semibold tracking-display text-ink sm:text-3xl"
              >
                {project.title}
              </h2>
              {project.role && (
                <p className="text-sm text-muted">{project.role}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="모달 닫기"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded text-subtle transition-colors duration-200 ease-out hover:bg-panel hover:text-ink"
            >
              <X size={20} weight="regular" />
            </button>
          </header>

          <section aria-labelledby={`${titleId}-problem`}>
            <h3
              id={`${titleId}-problem`}
              className="font-mono text-xs uppercase tracking-widest text-subtle"
            >
              Problem
            </h3>
            <blockquote className="mt-3 border-l-2 border-accent-blue/40 pl-4 text-sm italic text-muted">
              {project.tagline}
            </blockquote>
            <div className="mt-4 flex flex-col gap-3 text-base leading-relaxed text-ink">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </section>

          {project.responsibilities && project.responsibilities.length > 0 && (
            <section aria-labelledby={`${titleId}-solution`}>
              <h3
                id={`${titleId}-solution`}
                className="font-mono text-xs uppercase tracking-widest text-subtle"
              >
                Solution
              </h3>
              <dl className="mt-3 divide-y divide-line border-y border-line">
                {project.responsibilities.map((r) => (
                  <div
                    key={r.area}
                    className="grid gap-1 px-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-6"
                  >
                    <dt className="text-sm font-medium text-ink">{r.area}</dt>
                    <dd className="text-sm text-muted">{r.detail}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section aria-labelledby={`${titleId}-tech`}>
            <h3
              id={`${titleId}-tech`}
              className="font-mono text-xs uppercase tracking-widest text-subtle"
            >
              Tech
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li
                  key={s}
                  className="rounded border border-line bg-panel px-2.5 py-1 font-mono text-xs text-muted"
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {project.repoUrl && (
            <a
              href={`https://${project.repoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start font-mono text-xs text-accent-blue transition-colors duration-200 ease-out hover:text-ink"
            >
              {project.repoUrl} ↗
            </a>
          )}
        </div>
      </dialog>
    );
  },
);
