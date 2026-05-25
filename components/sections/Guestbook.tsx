"use client";

import { useRef } from "react";
import { GuestbookForm } from "@/components/ui/GuestbookForm";
import { GuestbookList, type GuestbookListHandle } from "@/components/ui/GuestbookList";

export function Guestbook() {
  const listRef = useRef<GuestbookListHandle>(null);

  return (
    <section
      id="guestbook"
      aria-labelledby="guestbook-heading"
      className="mx-auto max-w-prose px-6 py-16 sm:py-24"
    >
      <h2
        id="guestbook-heading"
        className="font-display text-3xl font-semibold tracking-display text-ink sm:text-4xl"
      >
        Guestbook
      </h2>
      <p className="mt-3 text-sm text-muted">
        한 줄 응원이나 의견을 남겨주세요. 검토 후 노출됩니다.
      </p>

      <div className="mt-8">
        <GuestbookForm onSubmitted={() => listRef.current?.refresh()} />
      </div>

      <div className="mt-10">
        <h3 className="font-mono text-xs uppercase tracking-widest text-subtle">
          Recent
        </h3>
        <div className="mt-4">
          <GuestbookList ref={listRef} />
        </div>
      </div>
    </section>
  );
}
