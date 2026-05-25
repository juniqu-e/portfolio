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

type Props = {
  onSubmitted?: () => void;
};

export function GuestbookForm({ onSubmitted }: Props) {
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
      className="flex flex-col gap-4 rounded-lg border border-line bg-page p-5 sm:p-6"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={nameId} className="text-xs font-medium text-muted">
          이름 <span className="font-mono text-subtle">(선택)</span>
        </label>
        <input
          id={nameId}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
          maxLength={NAME_MAX}
          placeholder="익명도 OK"
          autoComplete="off"
          className="rounded border border-line bg-page px-3 py-2 text-sm text-ink transition-colors duration-200 ease-out placeholder:text-subtle hover:border-line-strong focus-visible:border-accent-blue"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={bodyId} className="text-xs font-medium text-muted">
          한 줄 메시지 <span className="text-accent-pink">*</span>
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
          className="resize-none rounded border border-line bg-page px-3 py-2 text-sm leading-relaxed text-ink transition-colors duration-200 ease-out placeholder:text-subtle hover:border-line-strong focus-visible:border-accent-blue"
        />
        <p
          id={counterId}
          aria-live="polite"
          className={
            counterDanger
              ? "self-end font-mono text-xs text-accent-pink"
              : "self-end font-mono text-xs text-subtle"
          }
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
        <FeedbackMessage state={state} />
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex min-h-9 items-center justify-center rounded bg-ink px-4 py-2 text-sm font-medium text-page transition-colors duration-200 ease-out hover:bg-ink/85 focus-visible:bg-ink/85 disabled:cursor-not-allowed disabled:bg-subtle"
        >
          {state.kind === "submitting" ? "전송 중…" : "남기기"}
        </button>
      </div>
    </form>
  );
}

function FeedbackMessage({ state }: { state: SubmitState }) {
  if (state.kind === "idle" || state.kind === "submitting") {
    return <span className="sr-only">대기 중</span>;
  }
  if (state.kind === "success") {
    return (
      <p role="status" className="text-xs text-accent-blue">
        {state.message}
      </p>
    );
  }
  if (state.kind === "rate-limited") {
    return (
      <p role="status" className="text-xs text-accent-pink">
        잠시 후 다시 시도해주세요.
      </p>
    );
  }
  return (
    <p role="alert" className="text-xs text-accent-pink">
      {state.message}
    </p>
  );
}
