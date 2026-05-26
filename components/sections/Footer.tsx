export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-page">
      <div className="mx-auto flex max-w-prose flex-col gap-6 px-6 py-12">
        <p className="font-display text-2xl font-semibold tracking-display text-ink sm:text-3xl">
          LeeJunik
        </p>
        <p className="font-display text-base text-muted sm:text-lg">
          <span className="text-accent-blue">Try</span> the code,{" "}
          <span className="text-accent-blue">Catch</span> the people,{" "}
          <span className="text-accent-blue">Finally</span> make it reliable.
        </p>
        <p className="font-mono text-xs text-subtle">© {year} LeeJunik. All rights reserved.</p>
      </div>
    </footer>
  );
}
