"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
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
      <AdminHeader
        path="admin"
        command="journalctl -u guestbook --follow"
        title="guestbook"
        actions={
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="transition-colors hover:text-term-red disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? "logout…" : "logout"}
          </button>
        }
      />

      <GuestbookAdminList onUnauthorized={handleUnauthorized} />
    </div>
  );
}
