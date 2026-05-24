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
