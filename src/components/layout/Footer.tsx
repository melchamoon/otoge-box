export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex h-8 items-center justify-center bg-[var(--card)]/95 text-xs opacity-80">
      <span>© {new Date().getFullYear()} / made by @zetaraku with &lt;3</span>
    </footer>
  );
}
