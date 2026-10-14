"use client";

import { useRef } from "react";
import { GuestbookForm } from "@/components/ui/GuestbookForm";
import { GuestbookList, type GuestbookListHandle } from "@/components/ui/GuestbookList";
import { Reveal, SectionHead } from "./Reveal";

// 메인의 방명록과 같은 API(/api/guestbook)를 쓰고, 보기만 터미널 톤으로 바꾼다.
export function Guestbook() {
  const listRef = useRef<GuestbookListHandle>(null);
  return (
    <section id="guestbook" aria-label="방명록" className="relative px-4 py-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHead cmd='echo "..." >> /var/log/guestbook.log' title="guestbook" />
        <Reveal delay={0.05}>
          <p className="mt-6 font-mono text-xs text-term-muted sm:text-sm">
            한 줄 응원이나 의견을 남겨 주세요. 검토 후 노출됩니다.
          </p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-14">
            <GuestbookForm tone="term" onSubmitted={() => listRef.current?.refresh()} />
            <div>
              <p className="font-mono text-xs text-term-dim">
                <span className="text-term-green">$</span> tail -n 10 /var/log/guestbook.log
              </p>
              <div className="mt-4">
                <GuestbookList ref={listRef} tone="term" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
