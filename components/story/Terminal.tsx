"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MOTTOS } from "@/content/story";
import { CAREER_START } from "./data";
import { scrollToSection } from "./lenis";

// 히어로의 진짜(흉내) 터미널 — 몇 가지 명령을 받고, `cd <섹션>` 으로 페이지를 이동한다.
export const PROMPT = "junik@homeserver:~/whoami$";

type Line = { kind: "in" | "out" | "ok" | "err" | "dim"; text: string };

const DIRS = ["philosophy", "story", "whoami", "guestbook", "contact"] as const;
type Dir = (typeof DIRS)[number];
const DIR_DESC: Record<Dir, string> = {
  philosophy: "두 문장 — 기술의 철학과 삶의 철학",
  story: "2024.07부터의 타임라인 (카드를 누르면 자세히)",
  whoami: "자격",
  guestbook: "방명록",
  contact: "연락처",
};
const COMMANDS = ["help", "ls", "cd", "cat", "pwd", "whoami", "uptime", "clear"] as const;
const FILES = ["README.md", "philosophy.md"] as const;

function uptimeText(): string {
  const s = Math.floor((Date.now() - new Date(CAREER_START).getTime()) / 1000);
  const d = Math.floor(s / 86400);
  const hh = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${d}d ${hh}:${mm}:${ss}`;
}

const BANNER: Line[] = [
  { kind: "dim", text: "Welcome to homeserver (Ubuntu 24.04 · N100 · 16GB)" },
  { kind: "out", text: "name    이준익 (Lee Junik)" },
  { kind: "out", text: "role    Infrastructure Engineer — 서버 · 클라우드" },
  { kind: "out", text: `motto   ${MOTTOS.tech}` },
  { kind: "dim", text: "type `help` · `ls` 로 둘러보기 · `cd story` 로 시작" },
];

function run(raw: string): { lines: Line[]; clear?: boolean } {
  const input = raw.trim();
  if (!input) return { lines: [] };
  const [cmd = "", ...rest] = input.split(/\s+/);
  const arg = rest.join(" ");

  switch (cmd) {
    case "help":
      return {
        lines: [
          { kind: "out", text: "help              이 목록" },
          { kind: "out", text: "ls                둘러볼 곳" },
          { kind: "out", text: "cd <dir>          이동 — philosophy · story · whoami · guestbook · contact" },
          { kind: "out", text: "cat <file>        README.md · philosophy.md" },
          { kind: "out", text: "pwd · whoami · uptime · clear" },
          { kind: "dim", text: "Tab 으로 자동완성, ↑↓ 로 이전 명령" },
        ],
      };
    case "ls":
      return {
        lines: [
          ...DIRS.map((d) => ({ kind: "ok" as const, text: `${d}/`.padEnd(14) + DIR_DESC[d] })),
          ...FILES.map((f) => ({ kind: "out" as const, text: f })),
        ],
      };
    case "cd": {
      if (!arg || arg === "~" || arg === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return { lines: [] };
      }
      const target = arg.replace(/^~\//, "").replace(/\/$/, "");
      if ((DIRS as readonly string[]).includes(target) && scrollToSection(target)) {
        return { lines: [{ kind: "dim", text: `→ ~/${target}` }] };
      }
      return { lines: [{ kind: "err", text: `bash: cd: ${arg}: No such file or directory` }] };
    }
    case "cat": {
      if (arg === "philosophy.md")
        return {
          lines: [
            { kind: "out", text: `01  ${MOTTOS.tech}` },
            { kind: "out", text: `02  ${MOTTOS.life}` },
            { kind: "dim", text: "자세히: cd philosophy" },
          ],
        };
      if (arg === "README.md")
        return {
          lines: [
            { kind: "out", text: "# 이준익 — Infrastructure Engineer" },
            { kind: "out", text: "서버 · 클라우드에서 시작해 플랫폼까지 넓혀 가려 합니다." },
            { kind: "out", text: "집에 리눅스 서버 한 대를 두고 20여 개 서비스를 운영합니다. 이 페이지도 거기서 뜹니다." },
            { kind: "dim", text: "자세히: cd story" },
          ],
        };
      return { lines: [{ kind: "err", text: `cat: ${arg || "(없음)"}: No such file or directory` }] };
    }
    case "pwd":
      return { lines: [{ kind: "out", text: "/home/junik/whoami" }] };
    case "whoami":
      return { lines: [{ kind: "out", text: "junik — 이준익, Infrastructure Engineer (서버 · 클라우드)" }] };
    case "uptime":
      return { lines: [{ kind: "out", text: `up ${uptimeText()} · since 2024.07 (SSAFY 입과)` }] };
    case "clear":
      return { lines: [], clear: true };
    case "sudo":
      return { lines: [{ kind: "err", text: "junik is not in the sudoers file. This incident will be reported." }] };
    case "exit":
      return { lines: [{ kind: "dim", text: "logout — 그래도 페이지는 계속 보실 수 있습니다" }] };
    default:
      return {
        lines: [
          { kind: "err", text: `bash: ${cmd}: command not found` },
          { kind: "dim", text: "`help` 를 입력해 보세요" },
        ],
      };
  }
}

function complete(value: string): string {
  const parts = value.split(/\s+/);
  if (parts.length <= 1) {
    const hit = COMMANDS.filter((c) => c.startsWith(value));
    return hit.length === 1 ? `${hit[0]} ` : value;
  }
  const [cmd, partial = ""] = parts;
  const pool = cmd === "cd" ? [...DIRS] : cmd === "cat" ? [...FILES] : [];
  const hit = pool.filter((p) => p.startsWith(partial));
  return hit.length === 1 ? `${cmd} ${hit[0]}` : value;
}

const LINE_COLOR: Record<Line["kind"], string> = {
  in: "text-term-ink",
  out: "text-term-ink/90",
  ok: "text-term-green",
  err: "text-term-red",
  dim: "text-term-dim",
};

const QUICK = ["help", "ls", "cd philosophy", "cd story", "cd whoami", "cd contact"];

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = (raw: string) => {
    const { lines: out, clear } = run(raw);
    setLines((prev) => (clear ? [] : [...prev, { kind: "in", text: raw }, ...out]));
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 30));
    setCursor(-1);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
    } else if (e.key === "Tab") {
      e.preventDefault();
      setValue(complete(value));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(history.length - 1, cursor + 1);
      setCursor(next);
      setValue(history[next] ?? value);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(-1, cursor - 1);
      setCursor(next);
      setValue(next === -1 ? "" : (history[next] ?? ""));
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      className="border border-term-line bg-term-panel/80 font-mono text-[13px] leading-6 sm:text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-term-line px-3 py-2 text-xs text-term-dim">
        <span className="h-2.5 w-2.5 rounded-full bg-term-red/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-term-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-term-green/70" />
        <span className="ml-2 truncate">{PROMPT.replace("$", "")} — bash</span>
      </div>

      <div
        ref={bodyRef}
        data-lenis-prevent
        role="log"
        aria-live="polite"
        className="max-h-[38svh] min-h-[11rem] overflow-y-auto px-3 py-3 sm:px-4"
      >
        {lines.map((l, i) => (
          <p key={i} className={`whitespace-pre-wrap break-words ${LINE_COLOR[l.kind]}`}>
            {l.kind === "in" ? (
              <>
                <span className="text-term-green">{PROMPT}</span> {l.text}
              </>
            ) : (
              l.text
            )}
          </p>
        ))}
        <label className="flex items-center gap-2">
          <span className="shrink-0 text-term-green">{PROMPT}</span>
          <span className="sr-only">명령 입력</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            enterKeyHint="go"
            aria-label="터미널 명령 입력"
            className="min-w-0 flex-1 bg-transparent text-term-ink caret-term-green outline-none placeholder:text-term-dim"
            placeholder="help"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-term-line px-3 py-2 sm:px-4">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              submit(q);
            }}
            className="border border-term-line px-2 py-0.5 text-xs text-term-muted transition-colors duration-200 ease-out hover:border-term-green hover:text-term-green"
          >
            $ {q}
          </button>
        ))}
      </div>
    </div>
  );
}
