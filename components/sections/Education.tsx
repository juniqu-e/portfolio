import { EDUCATION } from "@/content/education";

export function Education() {
  return (
    <section id="education" aria-labelledby="education-heading" className="bg-panel">
      <div className="mx-auto max-w-prose px-6 py-16 sm:py-24">
        <h2
          id="education-heading"
          className="font-display text-3xl font-semibold tracking-display text-ink sm:text-4xl"
        >
          Education
        </h2>

        <div className="mt-12 flex flex-col gap-16">
          {EDUCATION.map((e) => (
            <article key={e.organization} className="grid gap-6 sm:grid-cols-[200px_1fr] sm:gap-10">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-subtle">
                  {e.period}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                  {e.organization}
                </h3>
                <p className="mt-1 text-sm text-muted">{e.course}</p>
              </div>

              <div className="flex flex-col gap-6">
                <p className="text-base leading-relaxed text-muted">{e.description}</p>

                <dl className="divide-y divide-line border-y border-line">
                  {e.highlights.map((h) => (
                    <div
                      key={h.area}
                      className="grid gap-1 px-2 py-4 sm:grid-cols-[140px_1fr] sm:gap-6"
                    >
                      <dt className="text-sm font-medium text-ink">{h.area}</dt>
                      <dd className="text-sm text-muted">{h.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
