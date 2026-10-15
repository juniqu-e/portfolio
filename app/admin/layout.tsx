import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-term-bg font-sans text-term-ink selection:bg-term-green selection:text-term-bg">
      {children}
    </div>
  );
}
