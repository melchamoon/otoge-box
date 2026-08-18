'use client';

import { useParams } from 'next/navigation';
import sites from '@/data/sites.json';
import { useOptionalGameContext } from '@/contexts/GameContext';

export function Footer() {
  const game = useOptionalGameContext();
  const params = useParams<{ gameCode?: string | string[] }>();
  const routeGameCode = Array.isArray(params.gameCode) ? params.gameCode[0] : params.gameCode;
  const routeSite = sites.find((site) => site.gameCode === routeGameCode);
  const counterUrl = game?.accessCounterUrl ?? (routeSite as (typeof sites)[number] & { accessCounterUrl?: string } | undefined)?.accessCounterUrl ?? process.env.NEXT_PUBLIC_INDEX_ACCESS_COUNTER_URL;

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex h-8 items-center justify-center gap-3 bg-[var(--card)]/95 text-xs opacity-80">
      {counterUrl && (
        <a href="https://www.free-counter.jp/" target="_blank" rel="noreferrer" aria-label="Access counter">
          <img src={counterUrl} width={70} height={12} alt="Access counter" />
        </a>
      )}
      <span>© {new Date().getFullYear()} / made by @zetaraku with &lt;3</span>
    </footer>
  );
}
