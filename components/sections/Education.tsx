import { EDUCATION } from "@/content/education";

const KIND_LABEL: Record<string, string> = {
  certification: "Certification",
  education: "Education",
};

export function Education() {
  return (
    <section id="education" aria-labelledby="education-heading" className="bg-panel">
      <div className="mx-auto max-w-prose px-6 py-16 sm:py-24">
        <h2
          id="education-heading"
          className="font-display text-3xl font-semibold tracking-display text-ink sm:text-4xl"
        >
          Education &amp; Certification
        </h2>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {EDUCATION.map((e) => (
            <li
              key={e.title}
              className="grid items-center gap-2 px-2 py-4 transition-colors duration-200 ease-out hover:bg-accent-blue/5 sm:grid-cols-[140px_1fr_auto] sm:gap-6"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-subtle">
                {KIND_LABEL[e.kind]}
              </span>
              <span className="text-base text-ink">{e.title}</span>
              <span
                className={
                  e.status === "in-progress"
                    ? "inline-flex self-start rounded-full bg-accent-pink/15 px-2.5 py-1 text-xs font-medium text-accent-pink sm:self-auto"
                    : "inline-flex self-start rounded-full bg-panel px-2.5 py-1 text-xs text-subtle sm:self-auto"
                }
              >
                {e.status === "in-progress" ? "진행중" : e.kind === "education" ? "학사" : "수료"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
