import { Icon } from "@/components/ui/Icon";
import { SKILL_CATEGORIES, SKILLS } from "@/content/skills";
import { Reveal, SectionHead } from "./Reveal";

// tech stack — 메인과 같은 content/skills.ts, 보기만 터미널 톤.
export function Stack() {
  return (
    <section id="stack" aria-label="기술 스택" className="relative px-4 py-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHead cmd="ls /usr/local/stack" title="stack" />
        <div className="mt-12 flex flex-col gap-10">
          {SKILL_CATEGORIES.map((cat, i) => {
            const skills = SKILLS.filter((s) => s.category === cat.id);
            return (
              <Reveal key={cat.id} delay={i * 0.05}>
                <p className="font-mono text-xs text-term-dim">
                  <span className="text-term-green">drwxr-xr-x</span> {cat.label.toLowerCase().replace(/\s*\/\s*/g, "-")}/
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-center gap-3 border border-term-line bg-term-panel/40 px-3 py-3 transition-colors duration-200 ease-out hover:border-term-green/60 hover:bg-term-panel"
                    >
                      <Icon slug={skill.iconSlug} size={22} weight="regular" className="h-[22px] w-[22px] shrink-0 text-term-muted" />
                      <span className="truncate font-mono text-sm text-term-ink">{skill.name}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
