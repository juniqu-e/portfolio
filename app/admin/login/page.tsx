"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
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
      <AdminHeader path="admin/login" command="sudo -i" title="login" />

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
