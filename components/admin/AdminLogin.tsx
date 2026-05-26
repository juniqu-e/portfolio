"use client";

import { useId, useState, type FormEvent } from "react";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "rate-limited" };

type Props = {
  onSuccess: () => void;
};

export function AdminLogin({ onSuccess }: Props) {
  const usernameId = useId();
  const passwordId = useId();
  const errorId = useId();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const submitting = state.kind === "submitting";
  const disabled = submitting || username.trim().length === 0 || password.length === 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (res.ok) {
        setPassword("");
        onSuccess();
        return;
      }

      if (res.status === 429) {
        setState({ kind: "rate-limited" });
        return;
      }

      if (res.status === 404) {
        setState({
          kind: "error",
          message: "로그인 API가 아직 배포되지 않았습니다.",
        });
        return;
      }

      // 401 / 400 / 기타: 서버가 일반화된 메시지 반환 — info leak 방지 위해 그대로 사용.
      const payload = (await res.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      const msg = payload?.error?.message ?? "아이디 또는 비밀번호가 올바르지 않습니다.";
      setState({ kind: "error", message: msg });
    } catch {
      setState({ kind: "error", message: "네트워크 오류가 발생했습니다." });
    }
  }

  const errorMessage =
    state.kind === "error"
      ? state.message
      : state.kind === "rate-limited"
        ? "잠시 후 다시 시도해주세요."
        : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex max-w-sm flex-col gap-4 rounded-lg border border-line bg-page p-6"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={usernameId} className="text-xs font-medium text-muted">
          아이디
        </label>
        <input
          id={usernameId}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoFocus
          aria-describedby={errorMessage ? errorId : undefined}
          className="rounded border border-line bg-page px-3 py-2 text-sm text-ink transition-colors duration-200 ease-out hover:border-line-strong focus-visible:border-accent-blue focus-visible:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={passwordId} className="text-xs font-medium text-muted">
          비밀번호
        </label>
        <input
          id={passwordId}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          aria-describedby={errorMessage ? errorId : undefined}
          className="rounded border border-line bg-page px-3 py-2 text-sm text-ink transition-colors duration-200 ease-out hover:border-line-strong focus-visible:border-accent-blue focus-visible:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="inline-flex min-h-9 items-center justify-center rounded bg-ink px-4 py-2 text-sm font-medium text-page transition-colors duration-200 ease-out hover:bg-ink/85 focus-visible:bg-ink/85 disabled:cursor-not-allowed disabled:bg-subtle"
      >
        {submitting ? "로그인 중…" : "로그인"}
      </button>
      {errorMessage && (
        <p id={errorId} role="alert" className="text-xs text-accent-pink">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
