"use client";

import { useCallback, useEffect, useId, useState } from "react";
import type { GuestbookAdminEntry, GuestbookAdminListResponse } from "@/types";

type AdminStatus = "pending" | "approved" | "deleted" | "all";

// types/index.ts 의 GuestbookAdminEntry / GuestbookAdminListResponse 사용
// (head 머지 시 backend 정의로 통합)
type AdminListResponse = GuestbookAdminListResponse;

type FetchState =
  | { kind: "loading" }
  | { kind: "ok"; items: GuestbookAdminEntry[]; nextCursor: number | null }
  | { kind: "empty" }
  | { kind: "error"; message: string };

type ActionFeedback = { kind: "ok"; message: string } | { kind: "error"; message: string };

const TABS: { key: AdminStatus; label: string }[] = [
  { key: "pending", label: "대기" },
  { key: "approved", label: "승인" },
  { key: "deleted", label: "삭제" },
  { key: "all", label: "전체" },
];

const LIMIT = 20;

type Props = {
  onUnauthorized: () => void;
};

export function GuestbookAdminList({ onUnauthorized }: Props) {
  const liveRegionId = useId();
  const [activeStatus, setActiveStatus] = useState<AdminStatus>("pending");
  const [state, setState] = useState<FetchState>({ kind: "loading" });
  const [pendingActionId, setPendingActionId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);

  const load = useCallback(
    async (status: AdminStatus, cursor?: number) => {
      if (cursor == null) setState({ kind: "loading" });
      try {
        const url = new URL("/api/admin/guestbook", window.location.origin);
        url.searchParams.set("status", status);
        url.searchParams.set("limit", String(LIMIT));
        if (cursor != null) url.searchParams.set("cursor", String(cursor));

        const res = await fetch(url.toString(), {
          credentials: "include",
          cache: "no-store",
        });

        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        if (res.status === 404) {
          setState({
            kind: "error",
            message:
              "관리자 API (/api/admin/guestbook) 가 아직 배포되지 않았습니다. 백엔드 머지 후 다시 시도해주세요.",
          });
          return;
        }
        if (!res.ok) {
          setState({ kind: "error", message: `요청 실패 (HTTP ${res.status})` });
          return;
        }

        const payload = (await res.json()) as Partial<AdminListResponse>;
        const items = Array.isArray(payload.items) ? payload.items : [];
        const nextCursor = typeof payload.nextCursor === "number" ? payload.nextCursor : null;

        if (cursor != null) {
          setState((prev) =>
            prev.kind === "ok"
              ? { kind: "ok", items: [...prev.items, ...items], nextCursor }
              : items.length === 0
                ? { kind: "empty" }
                : { kind: "ok", items, nextCursor },
          );
          return;
        }
        if (items.length === 0) {
          setState({ kind: "empty" });
        } else {
          setState({ kind: "ok", items, nextCursor });
        }
      } catch {
        setState({ kind: "error", message: "네트워크 오류가 발생했습니다." });
      }
    },
    [onUnauthorized],
  );

  useEffect(() => {
    setFeedback(null);
    load(activeStatus);
  }, [activeStatus, load]);

  async function performAction(entryId: number, action: "approve" | "delete" | "restore") {
    setPendingActionId(entryId);
    setFeedback(null);
    try {
      const target =
        action === "approve"
          ? { url: `/api/guestbook/${entryId}/approve`, method: "PATCH" as const }
          : action === "delete"
            ? { url: `/api/guestbook/${entryId}`, method: "DELETE" as const }
            : { url: `/api/admin/guestbook/${entryId}/restore`, method: "PATCH" as const };

      const res = await fetch(target.url, {
        method: target.method,
        credentials: "include",
      });

      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (!res.ok) {
        setFeedback({
          kind: "error",
          message: `작업 실패 (HTTP ${res.status}) — #${entryId}`,
        });
        return;
      }

      const label = action === "approve" ? "승인" : action === "delete" ? "삭제" : "복원";
      setFeedback({ kind: "ok", message: `#${entryId} ${label} 완료` });
      await load(activeStatus);
    } catch {
      setFeedback({
        kind: "error",
        message: "네트워크 오류가 발생했습니다.",
      });
    } finally {
      setPendingActionId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="방명록 상태"
        className="flex flex-wrap gap-1 border-b border-line"
      >
        {TABS.map((tab) => {
          const active = tab.key === activeStatus;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveStatus(tab.key)}
              className={
                active
                  ? "min-h-9 border-b-2 border-accent-blue px-3 py-2 text-sm font-medium text-ink"
                  : "min-h-9 border-b-2 border-transparent px-3 py-2 text-sm text-muted transition-colors duration-200 ease-out hover:text-ink"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={liveRegionId}
        role="status"
        aria-live="polite"
        className={
          feedback
            ? feedback.kind === "ok"
              ? "text-xs text-accent-blue"
              : "text-xs text-accent-pink"
            : "sr-only"
        }
      >
        {feedback?.message ?? "대기 중"}
      </div>

      <ListBody
        state={state}
        pendingActionId={pendingActionId}
        onApprove={(id) => performAction(id, "approve")}
        onDelete={(id) => performAction(id, "delete")}
        onRestore={(id) => performAction(id, "restore")}
        onLoadMore={(cursor) => load(activeStatus, cursor)}
      />
    </div>
  );
}

type ListBodyProps = {
  state: FetchState;
  pendingActionId: number | null;
  onApprove: (id: number) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onLoadMore: (cursor: number) => void;
};

function ListBody({
  state,
  pendingActionId,
  onApprove,
  onDelete,
  onRestore,
  onLoadMore,
}: ListBodyProps) {
  if (state.kind === "loading") {
    return (
      <p className="font-mono text-xs text-subtle" aria-live="polite">
        로딩 중…
      </p>
    );
  }
  if (state.kind === "error") {
    return (
      <p role="alert" className="text-sm text-accent-pink">
        {state.message}
      </p>
    );
  }
  if (state.kind === "empty") {
    return <p className="text-sm text-muted">표시할 항목이 없습니다.</p>;
  }

  const nextCursor = state.nextCursor;
  return (
    <>
      <p className="font-mono text-xs text-subtle">
        {state.items.length}건 표시{nextCursor != null ? " · 더 있음" : ""}
      </p>
      <ul className="flex flex-col gap-2">
        {state.items.map((entry) => (
          <Row
            key={entry.id}
            entry={entry}
            pending={pendingActionId === entry.id}
            onApprove={() => onApprove(entry.id)}
            onDelete={() => onDelete(entry.id)}
            onRestore={() => onRestore(entry.id)}
          />
        ))}
      </ul>
      {nextCursor != null && (
        <button
          type="button"
          onClick={() => onLoadMore(nextCursor)}
          className="min-h-9 self-start rounded border border-line px-3 py-2 text-sm text-muted transition-colors duration-200 ease-out hover:border-line-strong hover:text-ink"
        >
          더 보기
        </button>
      )}
    </>
  );
}

type RowProps = {
  entry: GuestbookAdminEntry;
  pending: boolean;
  onApprove: () => void;
  onDelete: () => void;
  onRestore: () => void;
};

function Row({ entry, pending, onApprove, onDelete, onRestore }: RowProps) {
  const tag =
    entry.status === "deleted"
      ? { label: "삭제", className: "text-subtle" }
      : entry.status === "approved"
        ? { label: "승인", className: "text-accent-blue" }
        : { label: "대기", className: "text-accent-pink" };

  const displayName = entry.name && entry.name.trim() !== "" ? entry.name : "익명";
  const ipTail = entry.ipHash.slice(-8);

  return (
    <li className="grid gap-3 rounded-lg border border-line bg-page p-4 md:grid-cols-[max-content_1fr_auto] md:items-start">
      <div className="flex flex-col gap-1 font-mono text-xs text-subtle">
        <span className="text-ink">#{entry.id}</span>
        <span className={tag.className}>{tag.label}</span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="whitespace-pre-line break-words text-sm leading-relaxed text-ink">
          {entry.body}
        </p>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-subtle">
          <span>{displayName}</span>
          <span aria-hidden>·</span>
          <time dateTime={entry.createdAt}>{formatAbsolute(entry.createdAt)}</time>
          <span aria-hidden>·</span>
          <span title={entry.ipHash}>ip:{ipTail}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-start gap-2">
        {entry.status === "deleted" ? (
          <button
            type="button"
            disabled={pending}
            onClick={onRestore}
            className="min-h-9 rounded border border-line px-3 py-1.5 text-xs text-muted transition-colors duration-200 ease-out hover:border-line-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            복원
          </button>
        ) : (
          <>
            {entry.status === "pending" && (
              <button
                type="button"
                disabled={pending}
                onClick={onApprove}
                className="min-h-9 rounded border border-accent-blue px-3 py-1.5 text-xs text-accent-blue transition-colors duration-200 ease-out hover:bg-accent-blue/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                승인
              </button>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={onDelete}
              className="min-h-9 rounded border border-line px-3 py-1.5 text-xs text-muted transition-colors duration-200 ease-out hover:border-accent-pink hover:text-accent-pink disabled:cursor-not-allowed disabled:opacity-50"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  );
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatAbsolute(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
