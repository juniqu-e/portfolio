import Link from "next/link";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#tech-stack", label: "Tech" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line">
      <div className="mx-auto flex h-14 max-w-prose items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-base font-semibold tracking-display text-ink transition-colors hover:text-accent-blue"
        >
          Lee Junik
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-6 text-sm text-muted">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center px-1 py-2 transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
