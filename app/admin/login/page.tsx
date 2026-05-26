"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminLogin } from "@/components/admin/AdminLogin";

// next 파라미터는 동일 origin 경로만 허용 — open-redirect 차단.
function safeNext(raw: string | null): string {
  if (!raw) return "/admin";
  if (!raw.startsWith("/")) return "/admin";
  if (raw.startsWith("//")) return "/admin";
  return raw;
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  return (
    <AdminLogin
      onSuccess={() => {
        router.push(next);
        router.refresh();
      }}
    />
  );
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex max-w-prose flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-ink">관리자 로그인</h1>
          <p className="font-mono text-xs text-subtle">/admin/login</p>
        </div>
        <Link
          href="/"
          className="font-mono text-xs text-muted underline-offset-4 transition-colors duration-200 ease-out hover:text-ink hover:underline"
        >
          ← 메인으로
        </Link>
      </header>

      <Suspense
        fallback={
          <p className="font-mono text-xs text-subtle" aria-live="polite">
            로딩 중…
          </p>
        }
      >
        <LoginInner />
      </Suspense>
    </div>
  );
}
