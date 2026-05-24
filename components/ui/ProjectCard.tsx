"use client";

import { useRef } from "react";
import { Trophy } from "@phosphor-icons/react/dist/ssr";
import { ProjectModal, type ProjectModalHandle } from "./ProjectModal";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  const modalRef = useRef<ProjectModalHandle>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => modalRef.current?.open()}
        aria-label={`${project.title} 상세 보기`}
        className="group flex h-full w-full flex-col gap-3 rounded-lg border border-line bg-page p-6 text-left transition-[transform,border-color,box-shadow] duration-200 ease-out hover:scale-[1.02] hover:border-line-strong hover:shadow-sm focus-visible:scale-[1.02] focus-visible:border-line-strong focus-visible:shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-display text-lg font-semibold text-ink">
            {project.title}
          </h4>
          {project.award && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-blue/10 px-2 py-0.5 text-xs font-medium text-accent-blue">
              <Trophy size={12} weight="regular" aria-hidden />
              {project.award.rank}등
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-muted">{project.tagline}</p>

        {project.role && (
          <p className="text-xs text-subtle">{project.role}</p>
        )}

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.stack.slice(0, 5).map((s) => (
            <li
              key={s}
              className="rounded border border-line bg-panel px-2 py-0.5 font-mono text-[11px] text-muted"
            >
              {s}
            </li>
          ))}
          {project.stack.length > 5 && (
            <li className="rounded border border-line bg-panel px-2 py-0.5 font-mono text-[11px] text-subtle">
              +{project.stack.length - 5}
            </li>
          )}
        </ul>
      </button>

      <ProjectModal ref={modalRef} project={project} />
    </>
  );
}
