import { Icon } from "@/components/ui/Icon";
import { SKILL_CATEGORIES, SKILLS } from "@/content/skills";
import type { Skill, SkillCategory } from "@/types";

function bucket(category: SkillCategory): Skill[] {
  return SKILLS.filter((s) => s.category === category);
}

export function TechStack() {
  return (
    <section id="tech-stack" aria-labelledby="tech-heading" className="bg-panel">
      <div className="mx-auto max-w-prose px-6 py-16 sm:py-24">
        <h2
          id="tech-heading"
          className="font-display text-3xl font-semibold tracking-display text-ink sm:text-4xl"
        >
          Tech Stack
        </h2>

        <div className="mt-12 flex flex-col gap-14">
          {SKILL_CATEGORIES.map((cat) => {
            const skills = bucket(cat.id);
            return (
              <div key={cat.id}>
                <h3 className="font-mono text-xs uppercase tracking-widest text-subtle">
                  {cat.label}
                </h3>

                <ul className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {skills.map((skill) => (
                    <li key={skill.name}>
                      <div className="group flex flex-col items-center gap-2 rounded-lg border border-transparent px-2 py-4 transition-[transform,border-color,background-color] duration-200 ease-out hover:scale-[1.03] hover:border-line-strong hover:bg-page">
                        <Icon
                          slug={skill.iconSlug}
                          size={32}
                          weight="regular"
                          className="h-8 w-8"
                        />
                        <span className="text-center text-sm text-muted transition-colors duration-200 ease-out group-hover:text-accent-blue">
                          {skill.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
