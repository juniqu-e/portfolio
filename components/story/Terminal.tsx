"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CAREER_START } from "./data";
import { scrollToSection } from "./lenis";
import { terminalBus } from "./terminal-bus";

// 떠 있는 창 안의 터미널 본체 — 몇 가지 명령을 받고, `cd <섹션>` 으로 페이지를 이동한다. 창(머리띠·드래그)은 TerminalWindow.
export const PROMPT = "junik@homeserver:~/whoami$";

type Line = { kind: "in" | "out" | "ok" | "err" | "dim"; text: string };

const DIRS = ["whoami", "philosophy", "story", "certifications", "stack", "guestbook", "contact"] as const;
type Dir = (typeof DIRS)[number];
const DIR_DESC: Record<Dir, string> = {
  whoami: "메인 화면 (지금 여기)",
  philosophy: "기술과 삶의 철학",
  story: "2024.07부터의 타임라인 (카드를 누르면 자세히)",
  certifications: "자격증",
  stack: "기술 스택",
  guestbook: "방명록",
  contact: "연락처",
};
const COMMANDS = ["help", "ls", "cd", "cat", "open", "pwd", "whoami", "uptime", "clear"] as const;
const FILES = ["README.md"] as const;
const GITHUB_README = "https://github.com/juniqu-e";

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
  { kind: "dim", text: "type `help` · `ls` 로 둘러보기 · `cd story` 로 시작 · Tab 자동완성 · 이 창은 끌어서 옮길 수 있습니다" },
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
          { kind: "out", text: "cd <dir>          이동 — whoami(메인) · philosophy · story · certifications · stack · guestbook · contact" },
          { kind: "out", text: "cat README.md     GitHub 프로필 README 를 새 탭으로" },
          { kind: "out", text: "pwd · whoami · uptime · clear" },
          { kind: "dim", text: "Tab 자동완성 (후보가 여럿이면 목록 표시) · ↑↓ 이전 명령 · Ctrl+L 지우기 · Esc 접기" },
        ],
      };
    case "ls":
      return {
        lines: [
          ...DIRS.map((d) => ({ kind: "ok" as const, text: `${d}/`.padEnd(16) + DIR_DESC[d] })),
          ...FILES.map((f) => ({ kind: "out" as const, text: f.padEnd(16) + "GitHub 프로필 README" })),
        ],
      };
    case "cd": {
      if (!arg || arg === "~" || arg === "/" || arg === "~/whoami") {
        scrollToSection("whoami");
        return { lines: [{ kind: "dim", text: "→ ~/whoami" }] };
      }
      const target = arg.replace(/^~\//, "").replace(/\/$/, "");
      if ((DIRS as readonly string[]).includes(target) && scrollToSection(target)) {
        return { lines: [{ kind: "dim", text: `→ ~/${target}` }] };
      }
      return { lines: [{ kind: "err", text: `bash: cd: ${arg}: No such file or directory` }] };
    }
    case "cat":
    case "open":
    case "xdg-open": {
      if (arg === "README.md" || arg === "readme") {
        window.open(GITHUB_README, "_blank", "noopener,noreferrer");
        return { lines: [{ kind: "dim", text: `→ ${GITHUB_README.replace("https://", "")} (새 탭)` }] };
      }
      return { lines: [{ kind: "err", text: `${cmd}: ${arg || "(없음)"}: No such file or directory` }] };
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

function commonPrefix(list: string[]): string {
  if (list.length === 0) return "";
  let p = list[0]!;
  for (const s of list) while (!s.startsWith(p)) p = p.slice(0, -1);
  return p;
}

function complete(value: string): { value: string; candidates: string[] } {
  const endsWithSpace = /\s$/.test(value);
  const parts = value.trimStart().split(/\s+/).filter(Boolean);
  if (parts.length === 0 || (parts.length === 1 && !endsWithSpace)) {
    const partial = parts[0] ?? "";
    const hit = COMMANDS.filter((c) => c.startsWith(partial));
    if (hit.length === 1) return { value: `${hit[0]} `, candidates: [] };
    if (hit.length > 1) return { value: commonPrefix(hit), candidates: hit };
    return { value, candidates: [] };
  }
  const cmd = parts[0]!;
  const partial = endsWithSpace ? "" : (parts[1] ?? "");
  const pool = cmd === "cd" ? [...DIRS] : cmd === "cat" || cmd === "open" ? [...FILES] : [];
  const hit = pool.filter((p) => p.startsWith(partial));
  if (hit.length === 1) return { value: `${cmd} ${hit[0]}`, candidates: [] };
  if (hit.length > 1) return { value: `${cmd} ${commonPrefix(hit)}`, candidates: hit };
  return { value, candidates: [] };
}

const LINE_COLOR: Record<Line["kind"], string> = {
  in: "text-term-ink",
  out: "text-term-ink/90",
  ok: "text-term-green",
  err: "text-term-red",
  dim: "text-term-dim",
};

const QUICK = ["help", "ls", "cd philosophy", "cd story", "cd whoami", "cd contact"];

export function Terminal({ active = true }: { active?: boolean }) {
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

  // 창이 펼쳐질 때 입력에 포커스 — 모바일은 키보드가 튀어 오르므로 제외
  useEffect(() => {
    if (active && window.innerWidth >= 768) inputRef.current?.focus({ preventScroll: true });
  }, [active]);

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
      const r = complete(value);
      setValue(r.value);
      if (r.candidates.length > 1)
        setLines((prev) => [
          ...prev,
          { kind: "in", text: value },
          { kind: "dim", text: r.candidates.join("   ") },
        ]);
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
    } else if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
      terminalBus.close?.();
    }
  };

  return (
    <div
      className="font-mono text-[13px] leading-6 sm:text-sm"
      onClick={() => inputRef.current?.focus()}
    >

      <div
        ref={bodyRef}
        data-lenis-prevent
        role="log"
        aria-live="polite"
        className="max-h-[32svh] min-h-[9rem] overflow-y-auto px-3 py-3 sm:max-h-[36svh] sm:px-4"
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
