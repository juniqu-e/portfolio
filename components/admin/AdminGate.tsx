"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";

const STORAGE_KEY = "portfolio-admin-token";

type VerifyState =
  | { kind: "checking" }
  | { kind: "needs-token"; error?: string }
  | { kind: "verifying" }
  | { kind: "authed"; token: string };

type GateRenderProps = {
  token: string;
  signOut: () => void;
};

type Props = {
  children: (props: GateRenderProps) => ReactNode;
};

type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "unauthorized" | "api-missing" | "network" | "other"; status?: number };

async function verifyToken(token: string): Promise<VerifyResult> {
  try {
    const res = await fetch("/api/admin/guestbook?status=pending&limit=1", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.ok) return { ok: true };
    if (res.status === 401) return { ok: false, reason: "unauthorized" };
    if (res.status === 404) return { ok: false, reason: "api-missing", status: 404 };
    return { ok: false, reason: "other", status: res.status };
  } catch {
    return { ok: false, reason: "network" };
  }
}

function formatError(result: Exclude<VerifyResult, { ok: true }>): string {
  if (result.reason === "unauthorized") return "토큰이 올바르지 않습니다.";
  if (result.reason === "api-missing")
    return "관리자 API (/api/admin/guestbook) 가 아직 배포되지 않았습니다.";
  if (result.reason === "network") return "네트워크 오류가 발생했습니다.";
  return `검증 실패 (HTTP ${result.status ?? "?"})`;
}

export function AdminGate({ children }: Props) {
  const tokenInputId = useId();
  const [state, setState] = useState<VerifyState>({ kind: "checking" });
  const [input, setInput] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setState({ kind: "needs-token" });
      return;
    }
    let cancelled = false;
    verifyToken(stored).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setState({ kind: "authed", token: stored });
        return;
      }
      // unauthorized → 저장 토큰 폐기. 그 외(API 미배포/네트워크)는 토큰 유지 — 사용자가 재시도 가능.
      if (result.reason === "unauthorized") {
        window.localStorage.removeItem(STORAGE_KEY);
        setState({
          kind: "needs-token",
          error: "저장된 토큰이 더 이상 유효하지 않습니다.",
        });
      } else {
        setState({ kind: "needs-token", error: formatError(result) });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "verifying") return;
    const token = input.trim();
    if (token.length === 0) return;
    setState({ kind: "verifying" });
    const result = await verifyToken(token);
    if (result.ok) {
      window.localStorage.setItem(STORAGE_KEY, token);
      setInput("");
      setState({ kind: "authed", token });
    } else {
      setState({ kind: "needs-token", error: formatError(result) });
    }
  }

  function signOut() {
    window.localStorage.removeItem(STORAGE_KEY);
    setInput("");
    setState({ kind: "needs-token" });
  }

  if (state.kind === "checking") {
    return (
      <p className="font-mono text-sm text-subtle" aria-live="polite">
        검증 중…
      </p>
    );
  }

  if (state.kind === "authed") {
    return <>{children({ token: state.token, signOut })}</>;
  }

  const verifying = state.kind === "verifying";
  const errorMessage = state.kind === "needs-token" ? state.error : undefined;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex max-w-sm flex-col gap-4 rounded-lg border border-line bg-page p-6"
      aria-labelledby={`${tokenInputId}-label`}
    >
      <div className="flex flex-col gap-1.5">
        <label
          id={`${tokenInputId}-label`}
          htmlFor={tokenInputId}
          className="text-xs font-medium text-muted"
        >
          ADMIN_TOKEN
        </label>
        <input
          id={tokenInputId}
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          autoFocus
          className="rounded border border-line bg-page px-3 py-2 font-mono text-sm text-ink transition-colors duration-200 ease-out hover:border-line-strong focus-visible:border-accent-blue focus-visible:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={verifying || input.trim().length === 0}
        className="inline-flex min-h-9 items-center justify-center rounded bg-ink px-4 py-2 text-sm font-medium text-page transition-colors duration-200 ease-out hover:bg-ink/85 focus-visible:bg-ink/85 disabled:cursor-not-allowed disabled:bg-subtle"
      >
        {verifying ? "검증 중…" : "확인"}
      </button>
      {errorMessage && (
        <p role="alert" className="text-xs text-accent-pink">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
