import { CERTIFICATIONS } from "@/content/certifications";

export function Certifications() {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="mx-auto max-w-prose px-6 py-16 sm:py-24"
    >
      <h2
        id="certifications-heading"
        className="font-display text-3xl font-semibold tracking-display text-ink sm:text-4xl"
      >
        Certifications
      </h2>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {CERTIFICATIONS.map((c) => (
          <li
            key={c.title}
            className="grid items-center gap-2 px-2 py-4 transition-colors duration-200 ease-out hover:bg-accent-blue/5 sm:grid-cols-[1fr_auto] sm:gap-6"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-base text-ink">{c.title}</span>
              <span className="text-xs text-subtle">{c.issuer}</span>
            </span>
            {c.status === "running" ? (
              <span className="inline-flex items-center gap-1.5 justify-self-start self-start rounded-full bg-accent-pink/15 px-2.5 py-1 font-mono text-xs font-medium text-accent-pink sm:self-auto">
                <span aria-hidden className="size-1.5 rounded-full bg-accent-pink" />
                Running · {c.date}
              </span>
            ) : (
              <span className="font-mono text-xs text-subtle">{c.date}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
