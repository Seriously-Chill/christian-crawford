export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-surface">
      <div className="mx-auto max-w-6xl px-space-3 py-space-3 text-label text-ink/60">
        © {new Date().getFullYear()} Christian Crawford.
      </div>
    </footer>
  );
}
