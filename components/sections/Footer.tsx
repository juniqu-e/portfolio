export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-page">
      <div className="mx-auto flex max-w-prose flex-col gap-4 px-6 py-12">
        <p className="font-display text-2xl font-semibold tracking-display text-ink sm:text-3xl">
          LeeJunik
        </p>
        <p className="font-mono text-xs text-subtle">© {year} LeeJunik. All rights reserved.</p>
      </div>
    </footer>
  );
}
