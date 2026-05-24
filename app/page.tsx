import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-prose px-6 py-24">
        <section aria-label="Hero placeholder" className="flex flex-col gap-6">
          <p className="font-mono text-sm text-subtle">{"// Phase 4 — layout shell"}</p>
          <h1 className="font-display text-5xl font-semibold tracking-display text-ink sm:text-6xl">
            이준익
            <span className="block text-ink/70">Lee Junik</span>
          </h1>
          <p className="text-base text-muted">DevOps / Platform Engineer</p>
          <p className="font-display text-xl text-ink">
            Try the code, Catch the people, Finally make it reliable.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
