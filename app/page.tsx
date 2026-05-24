import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { TechStack } from "@/components/sections/TechStack";

const REMAINING_PLACEHOLDERS = [
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <TechStack />
        {REMAINING_PLACEHOLDERS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            aria-label={s.label}
            className="mx-auto max-w-prose px-6 py-24"
          >
            <p className="font-mono text-sm text-subtle">{`// ${s.label} — Phase 7+`}</p>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
