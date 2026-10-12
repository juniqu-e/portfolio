import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

// 모토 자리는 비워 둔다 — 새 모토가 정해지면 이름 아래에 들어간다.
export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col px-6 py-12 sm:py-16"
    >
      <div className="mx-auto flex w-full max-w-prose flex-1 flex-col justify-center gap-3">
        <h1
          id="hero-name"
          className="font-display text-6xl font-semibold tracking-display text-ink sm:text-8xl"
        >
          이준익
          <span className="mt-3 block text-3xl font-medium text-ink/70 sm:text-5xl">Lee Junik</span>
        </h1>
        <p className="mt-4 text-lg text-muted sm:text-xl">
          Infrastructure Engineer
          <span className="text-subtle"> · 서버 · 클라우드</span>
        </p>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-prose">
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
