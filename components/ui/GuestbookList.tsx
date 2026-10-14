"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { formatRelative } from "@/lib/relative-time";
import type { GuestbookEntry } from "@/types";

export type GuestbookListHandle = {
  refresh: () => void;
};

type Tone = "light" | "term";

const LIST_STYLES = {
  light: {
    loading: "font-mono text-xs text-subtle",
    error: "text-sm text-accent-pink",
    empty: "text-sm text-muted",
    item: "rounded-lg border border-line bg-page p-4 transition-colors duration-200 ease-out hover:border-line-strong",
    body: "whitespace-pre-line text-sm leading-relaxed text-ink",
    meta: "mt-3 flex items-center gap-2 font-mono text-xs text-subtle",
  },
  term: {
    loading: "font-mono text-xs text-term-dim",
    error: "font-mono text-sm text-term-amber",
    empty: "font-mono text-sm text-term-muted",
    item: "border border-term-line bg-term-panel/40 p-4 transition-colors duration-200 ease-out hover:border-term-muted",
    body: "whitespace-pre-line break-keep text-sm leading-relaxed text-term-ink",
    meta: "mt-3 flex items-center gap-2 font-mono text-xs text-term-dim",
  },
} as const;

type FetchState =
  | { kind: "loading" }
  | { kind: "ok"; items: GuestbookEntry[] }
  | { kind: "empty" }
  | { kind: "error" };

export const GuestbookList = forwardRef<GuestbookListHandle, { tone?: Tone }>(
  function GuestbookList({ tone = "light" }, externalRef) {
    const st = LIST_STYLES[tone];
    const [state, setState] = useState<FetchState>({ kind: "loading" });

    const load = useCallback(async () => {
      setState({ kind: "loading" });
      try {
        const res = await fetch("/api/guestbook?limit=10", { cache: "no-store" });
        if (!res.ok) {
          setState({ kind: "error" });
          return;
        }
        const payload = (await res.json()) as { items?: GuestbookEntry[] };
        const items = Array.isArray(payload.items) ? payload.items : [];
        setState(items.length === 0 ? { kind: "empty" } : { kind: "ok", items });
      } catch {
        setState({ kind: "error" });
      }
    }, []);

    useImperativeHandle(externalRef, () => ({ refresh: load }), [load]);

    useEffect(() => {
      load();
    }, [load]);

    if (state.kind === "loading") {
      return (
        <p className={st.loading} aria-live="polite">
          로딩 중…
        </p>
      );
    }

    if (state.kind === "error") {
      return (
        <p role="alert" className={st.error}>
          방명록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      );
    }

    if (state.kind === "empty") {
      return <p className={st.empty}>첫 번째 방명록을 남겨주세요.</p>;
    }

    return (
      <ul className="flex flex-col gap-3">
        {state.items.map((entry) => (
          <li
            key={entry.id}
            className={st.item}
          >
            <p className={st.body}>{entry.body}</p>
            <p className={st.meta}>
              <span>{entry.name && entry.name.trim() !== "" ? entry.name : "익명"}</span>
              <span aria-hidden>·</span>
              <time dateTime={entry.createdAt}>{formatRelative(entry.createdAt)}</time>
            </p>
          </li>
        ))}
      </ul>
    );
  },
);
