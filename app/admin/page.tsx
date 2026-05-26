"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GuestbookAdminList } from "@/components/admin/GuestbookAdminList";

export default function AdminPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      // best-effort. 실패해도 클라이언트 측은 로그인 페이지로 보낸다 — 미들웨어가 다음 요청을 차단.
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    } catch {
      /* swallow */
    } finally {
      router.push("/admin/login");
    }
  }

  function handleUnauthorized() {
    router.push("/admin/login?next=/admin");
  }

  return (
    <div className="mx-auto flex max-w-prose flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-ink">방명록 관리</h1>
          <p className="font-mono text-xs text-subtle">/admin</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-mono text-xs text-muted underline-offset-4 transition-colors duration-200 ease-out hover:text-ink hover:underline"
          >
            ← 메인으로
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="min-h-9 rounded border border-line px-3 py-1.5 text-xs text-muted transition-colors duration-200 ease-out hover:border-line-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? "로그아웃 중…" : "로그아웃"}
          </button>
        </div>
      </header>

      <GuestbookAdminList onUnauthorized={handleUnauthorized} />
    </div>
  );
}
