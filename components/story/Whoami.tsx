import { SectionHead, Reveal } from "./Reveal";

// 참고 사이트의 About us(Profile) 대응. Personality 줄은 본인이 직접 줄 때까지 비워 둔다.
const ROWS: { k: string; v: string; accent?: "green" | "amber" }[] = [
  { k: "name", v: "이준익 (Lee Junik)" },
  { k: "role", v: "Infrastructure Engineer — 서버 · 클라우드", accent: "green" },
  { k: "now", v: "RAPA 클라우드 보안 전문가 양성과정 (2026.07 ~ 2026.12)" },
  { k: "work", v: "SSAFY 13 · 14기 실습코치 (2025.06 ~ 2026.06)" },
  { k: "edu", v: "SSAFY 12기 Python 트랙 수료 (1,600시간)" },
  { k: "certs", v: "정보처리기사 · CCNA 200-301" },
  { k: "next", v: "VMware VCP — running", accent: "amber" },
];

export function Whoami() {
  return (
    <section aria-label="프로필" className="relative px-4 py-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHead cmd="whoami --verbose" title="whoami" />
        <dl className="mt-12 border-t border-term-line font-mono text-sm sm:text-base">
          {ROWS.map((r, i) => (
            <Reveal key={r.k} delay={i * 0.05}>
              <div className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-term-line py-4 sm:grid-cols-[10rem_1fr]">
                <dt className="text-term-dim">{r.k}</dt>
                <dd
                  className={
                    r.accent === "green"
                      ? "text-term-green"
                      : r.accent === "amber"
                        ? "text-term-amber"
                        : "text-term-ink"
                  }
                >
                  {r.v}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
