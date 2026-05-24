import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";

const MOTTO_KEYWORD = "transition-colors duration-200 ease-out group-hover/motto:text-accent-blue";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col px-6 py-12 sm:py-16"
    >
      <div className="mx-auto grid w-full max-w-prose flex-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-3">
          <h1
            id="hero-name"
            className="font-display text-5xl font-semibold tracking-display text-ink sm:text-6xl"
          >
            이준익
            <span className="mt-2 block text-3xl font-medium text-ink/70 sm:text-4xl">
              Lee Junik
            </span>
          </h1>
          <p className="mt-1 text-base text-muted sm:text-lg">DevOps / Platform Engineer</p>
        </div>
        <CodeBlock />
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-prose flex-col items-start gap-8">
        <p className="group/motto font-display text-lg leading-relaxed text-ink sm:text-xl">
          <span className={MOTTO_KEYWORD}>Try</span> the code,{" "}
          <span className={MOTTO_KEYWORD}>Catch</span> the people,{" "}
          <span className={MOTTO_KEYWORD}>Finally</span> make it reliable.
        </p>

        <Link
          href="#about"
          aria-label="About 섹션으로 스크롤"
          className="group/arrow inline-flex min-h-9 items-center gap-2 px-1 py-2 text-sm text-subtle transition-colors duration-200 ease-out hover:text-ink"
        >
          <span className="font-mono uppercase tracking-widest">scroll</span>
          <ArrowDown
            weight="regular"
            aria-hidden
            className="size-4 transition-transform duration-300 ease-out group-hover/arrow:translate-y-1"
          />
        </Link>
      </div>
    </section>
  );
}
