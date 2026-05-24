import { ProjectCard } from "@/components/ui/ProjectCard";
import { PROJECT_GROUPS } from "@/content/project-groups";
import { PROJECTS } from "@/content/projects";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="bg-panel"
    >
      <div className="mx-auto max-w-prose px-6 py-16 sm:py-24">
        <h2
          id="projects-heading"
          className="font-display text-3xl font-semibold tracking-display text-ink sm:text-4xl"
        >
          Featured Projects
        </h2>

        <div className="mt-12 flex flex-col gap-14">
          {PROJECT_GROUPS.map((group) => {
            const items = PROJECTS.filter((p) => p.group === group.id);
            if (items.length === 0) return null;
            return (
              <div key={group.id}>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-accent-blue"
                  />
                  <h3 className="font-mono text-xs uppercase tracking-widest text-subtle">
                    {group.label}
                  </h3>
                  <span aria-hidden className="h-px flex-1 bg-line" />
                </div>

                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  {items.map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
