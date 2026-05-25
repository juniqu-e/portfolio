"use client";

import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";
import { GuestbookAdminList } from "@/components/admin/GuestbookAdminList";

export default function GuestbookAdminPage() {
  return (
    <div className="mx-auto flex max-w-prose flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-ink">방명록 관리</h1>
          <p className="font-mono text-xs text-subtle">/admin/guestbook</p>
        </div>
        <Link
          href="/"
          className="font-mono text-xs text-muted underline-offset-4 transition-colors duration-200 ease-out hover:text-ink hover:underline"
        >
          ← 메인으로
        </Link>
      </header>

      <AdminGate>
        {({ token, signOut }) => (
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs text-subtle">authed</p>
              <button
                type="button"
                onClick={signOut}
                className="min-h-9 rounded border border-line px-3 py-1.5 text-xs text-muted transition-colors duration-200 ease-out hover:border-line-strong hover:text-ink"
              >
                로그아웃
              </button>
            </div>
            <GuestbookAdminList token={token} onUnauthorized={signOut} />
          </section>
        )}
      </AdminGate>
    </div>
  );
}
