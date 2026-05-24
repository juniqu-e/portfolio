import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Projects />
        <section
          id="contact"
          aria-label="Contact"
          className="mx-auto max-w-prose px-6 py-24"
        >
          <p className="font-mono text-sm text-subtle">
            {`// Contact — Phase 8+`}
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
