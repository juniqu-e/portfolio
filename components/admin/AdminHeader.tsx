import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

// 메인(터미널 컨셉)과 같은 프롬프트 머리 — 로고 · junik@homeserver:~/<path>$ · 명령 제목.
export function AdminHeader({
  path,
  command,
  title,
  actions,
}: {
  path: string;
  command: string;
  title: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-term-muted sm:text-xs">
        <Link href="/" className="flex items-center gap-2 transition-colors hover:text-term-green">
          <Image
            src="/brand/logo-512.png"
            alt=""
            width={18}
            height={18}
            unoptimized
            priority
            className="h-[18px] w-[18px] select-none"
          />
          <span>
            <span className="text-term-green">junik@homeserver</span>:
            <span className="text-term-cyan">~/{path}</span>$
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="transition-colors hover:text-term-green">
            cd ~
          </Link>
          {actions}
        </div>
      </div>
      <div>
        <p className="font-mono text-xs text-term-muted sm:text-sm">
          <span className="text-term-green">$</span> {command}
        </p>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-term-ink sm:text-4xl">
          {title}
        </h1>
      </div>
    </header>
  );
}
