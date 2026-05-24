import { EXPERIENCE } from "@/content/experience";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="mx-auto max-w-prose px-6 py-16 sm:py-24"
    >
      <h2
        id="experience-heading"
        className="font-display text-3xl font-semibold tracking-display text-ink sm:text-4xl"
      >
        Experience
      </h2>

      <div className="mt-12 flex flex-col gap-16">
        {EXPERIENCE.map((entry) => (
          <article
            key={`${entry.organization}-${entry.period}`}
            className="grid gap-6 sm:grid-cols-[200px_1fr] sm:gap-10"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-subtle">
                {entry.period}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                {entry.organization}
              </h3>
              <p className="mt-1 text-sm text-muted">{entry.role}</p>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-base leading-relaxed text-muted">
                {entry.description}
              </p>

              <dl className="divide-y divide-line border-y border-line">
                {entry.duties.map((d) => (
                  <div
                    key={d.area}
                    className="grid gap-1 px-2 py-4 sm:grid-cols-[140px_1fr] sm:gap-6"
                  >
                    <dt className="text-sm font-medium text-ink">{d.area}</dt>
                    <dd className="text-sm text-muted">{d.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
