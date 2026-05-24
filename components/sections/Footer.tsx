import { Fragment } from "react";

const K = "text-accent-blue";
const F = "text-ink";
const P = "text-subtle";

// 3-line mini code 시그니처 (Hero CodeBlock의 압축 버전).
type Token = { t: string; c: string };
const MINI: Token[][] = [
  [
    { t: "try", c: K },
    { t: " { ", c: P },
    { t: "code", c: F },
    { t: "(); } ", c: P },
    { t: "catch", c: K },
    { t: " (people) { ", c: P },
    { t: "communicate", c: F },
    { t: "(); }", c: P },
  ],
  [
    { t: "finally", c: K },
    { t: " { ", c: P },
    { t: "shipReliableService", c: F },
    { t: "(); }", c: P },
  ],
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-page">
      <div className="mx-auto flex max-w-prose flex-col gap-8 px-6 py-12">
        <p className="font-display text-lg text-ink sm:text-xl">
          Try the code, Catch the people, Finally make it reliable.
        </p>

        <pre
          aria-label="시그니처 코드 (미니)"
          className="overflow-x-auto rounded border border-line bg-panel px-3 py-2"
        >
          <code className="block whitespace-pre font-mono text-[11px] leading-relaxed sm:text-xs">
            {MINI.map((line, idx) => (
              <Fragment key={idx}>
                {line.map((tok, j) => (
                  <span key={j} className={tok.c}>
                    {tok.t}
                  </span>
                ))}
                {idx < MINI.length - 1 && "\n"}
              </Fragment>
            ))}
          </code>
        </pre>

        <p className="text-sm text-muted">
          Building reliable workflows for developers, teams, and services.
        </p>

        <p className="text-xs text-subtle">© {year} 이준익 (Lee Junik)</p>
      </div>
    </footer>
  );
}
