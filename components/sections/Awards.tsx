import { Trophy } from "@phosphor-icons/react/dist/ssr";
import { AWARDS } from "@/content/awards";

export function Awards() {
  return (
    <section
      id="awards"
      aria-labelledby="awards-heading"
      className="mx-auto max-w-prose px-6 py-16 sm:py-24"
    >
      <h2
        id="awards-heading"
        className="font-display text-3xl font-semibold tracking-display text-ink sm:text-4xl"
      >
        Awards
      </h2>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {AWARDS.map((a) => {
          const isFirst = a.rank === 1;
          return (
            <li
              key={`${a.year}-${a.category}`}
              className="grid items-center gap-2 px-2 py-4 transition-colors duration-200 ease-out hover:bg-accent-blue/5 sm:grid-cols-[60px_180px_1fr_auto] sm:gap-6"
            >
              <span className="font-mono text-xs text-subtle">{a.year}</span>
              <span className="text-sm text-muted">{a.category}</span>
              <span
                className={
                  isFirst
                    ? "text-base font-semibold text-ink"
                    : "text-sm text-ink"
                }
              >
                {a.project}
              </span>
              <span
                className={
                  isFirst
                    ? "inline-flex items-center gap-1.5 self-start rounded-full bg-accent-blue/10 px-2.5 py-1 text-xs font-semibold text-accent-blue sm:self-auto"
                    : "inline-flex items-center gap-1.5 self-start rounded-full bg-panel px-2.5 py-1 text-xs font-medium text-muted sm:self-auto"
                }
              >
                <Trophy
                  size={14}
                  weight="regular"
                  aria-hidden
                />
                {a.rank}등
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
