"use client";

import { useId, useState, type FormEvent } from "react";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "rate-limited" }
  | { kind: "error"; message: string };

const BODY_MAX = 100;
const NAME_MAX = 20;

export type GuestbookTone = "light" | "term";

type Props = {
  onSubmitted?: () => void;
  /** "term" = /story 터미널 테마. 기본은 메인 페이지의 라이트 톤 */
  tone?: GuestbookTone;
};

const FORM_STYLES = {
  light: {
    form: "flex flex-col gap-4 rounded-lg border border-line bg-page p-5 sm:p-6",
    label: "text-xs font-medium text-muted",
    hint: "font-mono text-subtle",
    required: "text-accent-pink",
    input:
      "rounded border border-line bg-page px-3 py-2 text-sm text-ink transition-colors duration-200 ease-out placeholder:text-subtle hover:border-line-strong focus-visible:border-accent-blue",
    textarea:
      "resize-none rounded border border-line bg-page px-3 py-2 text-sm leading-relaxed text-ink transition-colors duration-200 ease-out placeholder:text-subtle hover:border-line-strong focus-visible:border-accent-blue",
    counter: "self-end font-mono text-xs text-subtle",
    counterDanger: "self-end font-mono text-xs text-accent-pink",
    button:
      "inline-flex min-h-9 items-center justify-center rounded bg-ink px-4 py-2 text-sm font-medium text-page transition-colors duration-200 ease-out hover:bg-ink/85 focus-visible:bg-ink/85 disabled:cursor-not-allowed disabled:bg-subtle",
    ok: "text-xs text-accent-blue",
    bad: "text-xs text-accent-pink",
  },
  term: {
    form: "flex flex-col gap-4 border border-term-line bg-term-panel/60 p-5 font-mono sm:p-6",
    label: "text-xs text-term-muted",
    hint: "text-term-dim",
    required: "text-term-amber",
    input:
      "border border-term-line bg-term-bg px-3 py-2 text-sm text-term-ink transition-colors duration-200 ease-out placeholder:text-term-dim hover:border-term-muted focus-visible:border-term-green focus-visible:outline-none",
    textarea:
      "resize-none border border-term-line bg-term-bg px-3 py-2 text-sm leading-relaxed text-term-ink transition-colors duration-200 ease-out placeholder:text-term-dim hover:border-term-muted focus-visible:border-term-green focus-visible:outline-none",
    counter: "self-end text-xs text-term-dim",
    counterDanger: "self-end text-xs text-term-amber",
    button:
      "inline-flex min-h-9 items-center justify-center border border-term-green px-4 py-2 text-sm text-term-green transition-colors duration-200 ease-out hover:bg-term-green hover:text-term-bg focus-visible:bg-term-green focus-visible:text-term-bg disabled:cursor-not-allowed disabled:border-term-line disabled:text-term-dim disabled:hover:bg-transparent",
    ok: "text-xs text-term-green",
    bad: "text-xs text-term-amber",
  },
} as const;

export function GuestbookForm({ onSubmitted, tone = "light" }: Props) {
  const st = FORM_STYLES[tone];
  const nameId = useId();
  const bodyId = useId();
  const counterId = useId();
  const honeypotId = useId();

  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const counterDanger = body.length >= BODY_MAX;
  const disabled = state.kind === "submitting" || body.trim().length === 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    setState({ kind: "submitting" });

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          body: body.trim(),
          honeypot,
        }),
      });

      if (res.status === 429) {
        setState({ kind: "rate-limited" });
        return;
      }

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        const msg = payload?.error?.message ?? "전송 실패. 잠시 후 다시 시도해주세요.";
        setState({ kind: "error", message: msg });
        return;
      }

      const ok = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      setState({
        kind: "success",
        message: ok?.message ?? "후기가 등록되었습니다. 검토 후 노출됩니다.",
      });
      setName("");
      setBody("");
      setHoneypot("");
      onSubmitted?.();
    } catch {
      setState({
        kind: "error",
        message: "전송 실패. 잠시 후 다시 시도해주세요.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={st.form}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={nameId} className={st.label}>
          이름 <span className={st.hint}>(선택)</span>
        </label>
        <input
          id={nameId}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
          maxLength={NAME_MAX}
          placeholder="익명도 OK"
          autoComplete="off"
          className={st.input}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={bodyId} className={st.label}>
          한 줄 메시지 <span className={st.required}>*</span>
        </label>
        <textarea
          id={bodyId}
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, BODY_MAX))}
          maxLength={BODY_MAX}
          required
          rows={3}
          placeholder="응원의 한 줄을 남겨주세요"
          aria-describedby={counterId}
          className={st.textarea}
        />
        <p
          id={counterId}
          aria-live="polite"
          className={counterDanger ? st.counterDanger : st.counter}
        >
          {body.length}/{BODY_MAX}
        </p>
      </div>

      {/* honeypot — 봇 함정. 사람에게 안 보이게 + 키보드/스크린리더 차단 */}
      <div
        aria-hidden
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label htmlFor={honeypotId}>Leave this empty</label>
        <input
          id={honeypotId}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <FeedbackMessage state={state} ok={st.ok} bad={st.bad} />
        <button
          type="submit"
          disabled={disabled}
          className={st.button}
        >
          {state.kind === "submitting" ? "전송 중…" : "남기기"}
        </button>
      </div>
    </form>
  );
}

function FeedbackMessage({ state, ok, bad }: { state: SubmitState; ok: string; bad: string }) {
  if (state.kind === "idle" || state.kind === "submitting") {
    return <span className="sr-only">대기 중</span>;
  }
  if (state.kind === "success") {
    return (
      <p role="status" className={ok}>
        {state.message}
      </p>
    );
  }
  if (state.kind === "rate-limited") {
    return (
      <p role="status" className={bad}>
        잠시 후 다시 시도해주세요.
      </p>
    );
  }
  return (
    <p role="alert" className={bad}>
      {state.message}
    </p>
  );
}
