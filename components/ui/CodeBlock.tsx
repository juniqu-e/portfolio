import { Fragment } from "react";

// DESIGN.md §시그니처 1: try/catch/finally. Hardcoded; not a reusable highlighter.
// Token mapping (DESIGN.md L168-170):
//   keyword (try/catch/finally) → accent-blue
//   function name              → ink
//   variable param             → muted (subtle distinguish; spec doesn't mandate a color)
//   punctuation                → subtle
const K = "text-accent-blue";
const F = "text-ink";
const V = "text-muted";
const P = "text-subtle";

type Token = { t: string; c: string };

const LINES: Token[][] = [
  [
    { t: "try", c: K },
    { t: " {", c: P },
  ],
  [
    { t: "  ", c: P },
    { t: "code", c: F },
    { t: "();", c: P },
  ],
  [
    { t: "} ", c: P },
    { t: "catch", c: K },
    { t: " (", c: P },
    { t: "people", c: V },
    { t: ") {", c: P },
  ],
  [
    { t: "  ", c: P },
    { t: "communicate", c: F },
    { t: "();", c: P },
  ],
  [
    { t: "  ", c: P },
    { t: "growTogether", c: F },
    { t: "();", c: P },
  ],
  [
    { t: "} ", c: P },
    { t: "finally", c: K },
    { t: " {", c: P },
  ],
  [
    { t: "  ", c: P },
    { t: "shipReliableService", c: F },
    { t: "();", c: P },
  ],
  [{ t: "}", c: P }],
];

export function CodeBlock() {
  return (
    <pre
      aria-label="시그니처 코드 블록: try the code, catch the people, finally make it reliable"
      className="rounded-lg border border-line bg-panel p-6 transition-[border-color,box-shadow] duration-200 ease-out hover:border-line-strong hover:shadow-sm sm:p-8"
    >
      <code className="block whitespace-pre font-mono text-sm leading-relaxed sm:text-base">
        {LINES.map((line, idx) => (
          <Fragment key={idx}>
            {line.map((tok, j) => (
              <span key={j} className={tok.c}>
                {tok.t}
              </span>
            ))}
            {idx < LINES.length - 1 && "\n"}
          </Fragment>
        ))}
      </code>
    </pre>
  );
}
