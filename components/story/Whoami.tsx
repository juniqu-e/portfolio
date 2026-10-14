import { CERTIFICATIONS } from "@/content/certifications";
import { SectionHead, Reveal } from "./Reveal";

// whoami — 자격만. 나머지는 스토리 카드가 채운다 (2026-10-14).
export function Whoami() {
  return (
    <section id="whoami" aria-label="자격" className="relative px-4 py-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHead cmd="whoami --certs" title="whoami" />
        <ol className="mt-12 border-t border-term-line font-mono text-sm sm:text-base">
          {CERTIFICATIONS.map((c, i) => {
            const running = c.status === "running";
            return (
              <Reveal key={c.title} delay={i * 0.05}>
                <li className="grid grid-cols-[5.5rem_1fr_auto] items-baseline gap-4 border-b border-term-line py-4 sm:grid-cols-[8rem_1fr_12rem_auto]">
                  <span className="text-term-dim">{c.date}</span>
                  <span className={running ? "text-term-amber" : "text-term-ink"}>{c.title}</span>
                  <span className="hidden text-term-muted sm:block">{c.issuer}</span>
                  <span className={`text-xs ${running ? "text-term-amber" : "text-term-green"}`}>
                    [ {running ? "RUN" : "OK"} ]
                  </span>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
