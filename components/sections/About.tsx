import { Fragment } from "react";
import type { Paragraph } from "@/types";
import { PROFILE } from "@/content/profile";

function renderParagraph(p: Paragraph, key: number) {
  return (
    <p key={key} className="text-base leading-relaxed text-ink sm:text-lg">
      {p.map((seg, idx) =>
        seg.emphasis ? (
          <strong key={idx} className="font-semibold text-ink">
            {seg.text}
          </strong>
        ) : (
          <Fragment key={idx}>{seg.text}</Fragment>
        ),
      )}
    </p>
  );
}

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto max-w-prose px-6 py-16 sm:py-24"
    >
      <h2
        id="about-heading"
        className="font-display text-3xl font-semibold tracking-display text-ink sm:text-4xl"
      >
        About
      </h2>

      <div className="mt-8 flex flex-col gap-5 text-muted">
        {PROFILE.aboutBody.map(renderParagraph)}
      </div>

      <dl
        aria-label="운영 기록 — 숫자로 보는 현재"
        className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3"
      >
        {PROFILE.numbers.map((n) => (
          <div
            key={n.label}
            className="flex flex-col gap-1 bg-page px-4 py-5 transition-colors duration-200 ease-out hover:bg-panel"
          >
            <dd className="order-1 font-display text-2xl font-semibold tracking-display text-ink sm:text-3xl">
              {n.value}
            </dd>
            <dt className="order-2 text-sm text-ink">{n.label}</dt>
            {n.sub && <dd className="order-3 text-xs text-subtle">{n.sub}</dd>}
          </div>
        ))}
      </dl>

      <dl className="mt-12 divide-y divide-line border-y border-line">
        {PROFILE.identitySummary.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 px-2 py-4 transition-colors duration-200 ease-out hover:bg-accent-blue/5 sm:grid-cols-[140px_1fr] sm:gap-6"
          >
            <dt className="font-mono text-xs uppercase tracking-widest text-subtle sm:pt-0.5">
              {row.label}
            </dt>
            <dd className="text-base text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
