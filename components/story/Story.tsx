import { STORY_SECTIONS } from "@/content/story";
import { Reveal, SectionHead } from "./Reveal";

// 두 문장이 어디서 왔는지 — 성장 이야기를 `less ~/story.md` 처럼 읽어 내려간다.
// 본문은 content/story.ts (CONTENT.md §"/story — 두 철학")가 정본.
export function Story() {
  return (
    <section id="story" aria-label="성장 이야기" className="relative px-4 py-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHead cmd="less ~/story.md" title="story.md" />
        <div className="mt-12 border-t border-term-line">
          {STORY_SECTIONS.map((sec, i) => (
            <Reveal key={sec.title} delay={0.05}>
              <article className="grid gap-6 border-b border-term-line py-12 lg:grid-cols-[14rem_1fr] lg:gap-12">
                <h3 className="font-mono text-sm leading-relaxed text-term-ink">
                  <span className="text-term-green">##</span> {sec.title}
                  <span className="mt-2 block text-xs text-term-dim">
                    {String(i + 1).padStart(2, "0")} / {String(STORY_SECTIONS.length).padStart(2, "0")}
                  </span>
                </h3>
                <div className="flex max-w-2xl flex-col gap-5">
                  {sec.paragraphs.map((p) => (
                    <p
                      key={p.slice(0, 24)}
                      className="break-keep text-base leading-relaxed text-term-muted sm:text-lg"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs text-term-dim">(END)</p>
      </div>
    </section>
  );
}
