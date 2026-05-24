export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-prose px-6 py-12">
        <p className="font-display text-lg text-ink">
          Try the code, Catch the people, Finally make it reliable.
        </p>
        <p className="mt-3 text-sm text-muted">
          Building reliable workflows for developers, teams, and services.
        </p>
        <p className="mt-8 text-xs text-subtle">© {year} 이준익 (Lee Junik)</p>
      </div>
    </footer>
  );
}
