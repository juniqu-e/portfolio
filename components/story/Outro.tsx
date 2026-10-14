import { CONTACT_LINKS } from "@/content/contact";
import { MARQUEE } from "./data";
import { Marquee } from "./Marquee";
import { Reveal, SectionHead } from "./Reveal";

// 참고 사이트의 RSVP · Credits 대응 — 연락처, 이 사이트가 도는 경로, 흐르는 감사 문구.
export function Contact() {
  return (
    <section id="contact" aria-label="연락처" className="relative px-4 py-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHead cmd="ping -c 1 junik" title="contact" />
        <ul className="mt-12 border-t border-term-line">
          {CONTACT_LINKS.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.06}>
              <li className="border-b border-term-line">
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group flex flex-wrap items-baseline justify-between gap-2 py-6 transition-colors hover:bg-term-panel/60 sm:px-4"
                >
                  <span className="font-mono text-xs text-term-dim">{l.label.toLowerCase()}</span>
                  <span className="break-all font-mono text-lg text-term-ink transition-colors group-hover:text-term-green sm:text-3xl">
                    {l.display}
                    <span className="ml-3 text-term-dim transition-colors group-hover:text-term-green">
                      →
                    </span>
                  </span>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Credits() {
  return (
    <footer className="relative pb-20 pt-16">
      <Marquee text={MARQUEE.repeat(3)} />
      <dl className="mx-auto mt-12 grid max-w-5xl gap-6 px-4 font-mono text-xs text-term-muted sm:grid-cols-3 sm:px-8">
        <div>
          <dt className="text-term-dim">served from</dt>
          <dd className="mt-1">GMKtec G3 · Intel N100 홈서버 · Cloudflare</dd>
        </div>
        <div>
          <dt className="text-term-dim">deployed by</dt>
          <dd className="mt-1">GitHub Actions → GHCR</dd>
        </div>
        <div>
          <dt className="text-term-dim">built with</dt>
          <dd className="mt-1">Next.js · Motion · Lenis</dd>
        </div>
      </dl>
      <p className="mx-auto mt-10 max-w-5xl px-4 font-mono text-xs text-term-dim sm:px-8">
        © 2026 Lee Junik
      </p>
    </footer>
  );
}
