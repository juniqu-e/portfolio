import { Fragment } from "react";
import type { Paragraph } from "@/types";
import { PROFILE } from "@/content/profile";

function renderParagraph(p: Paragraph, key: number) {
  return (
    <p key={key} className="text-base leading-relaxed text-muted sm:text-lg">
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

      <div className="mt-8 flex flex-col gap-6">{PROFILE.aboutBody.map(renderParagraph)}</div>
    </section>
  );
}
