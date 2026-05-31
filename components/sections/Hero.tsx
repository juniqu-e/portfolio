import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ASCII_HERO } from "@/content/ascii-art";

const MOTTO_KEYWORD = "transition-colors duration-200 ease-out group-hover/motto:text-accent-blue";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col px-6 py-12 sm:py-16"
    >
      <div className="mx-auto grid w-full max-w-prose flex-1 items-center gap-10 lg:max-w-screen-2xl lg:grid-cols-[1fr_auto_1fr] lg:gap-8 xl:gap-12">
        {/* 좌: ASCII art — lg+ 데스크탑 전용 시각 장식 (177 chars wide / 119 lines).
            clamp font 으로 컬럼 폭에 fluid 적응. min-w-0 + overflow-hidden 으로
            그리드 트랙이 ASCII intrinsic width 에 끌려가는 것을 차단. */}
        <pre
          aria-hidden
          className="hidden min-w-0 overflow-hidden font-mono leading-[1.05] text-ink lg:block lg:text-[clamp(2.5px,0.3vw,5px)]"
        >
          {ASCII_HERO}
        </pre>

        {/* 가운데: CodeBlock — 시그니처 try/catch/finally */}
        <CodeBlock />

        {/* 우: 이름 + 역할 + 모토 */}
        <div className="flex flex-col gap-6 lg:items-end lg:text-right">
          <h1
            id="hero-name"
            className="font-display text-5xl font-semibold tracking-display text-ink sm:text-6xl"
          >
            이준익
            <span className="mt-2 block text-3xl font-medium text-ink/70 sm:text-4xl">
              Lee Junik
            </span>
          </h1>
          <p className="text-base text-muted sm:text-lg">DevOps / Platform Engineer</p>
          <p className="group/motto font-display text-base leading-relaxed text-ink sm:text-lg">
            <span className={MOTTO_KEYWORD}>Try</span> the code,{" "}
            <span className={MOTTO_KEYWORD}>Catch</span> the people,{" "}
            <span className={MOTTO_KEYWORD}>Finally</span> make it reliable.
          </p>
        </div>
      </div>

      {/* scroll arrow — 그리드 아래 중앙 */}
      <div className="mx-auto mt-12 flex w-full max-w-prose justify-center lg:max-w-screen-2xl">
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
