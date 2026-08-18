'use client';

import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { mdiArrowRight, mdiMusicBoxMultiple } from '@mdi/js';
import sites from '@/data/sites.json';
import { Icon } from '@/components/Icon';
import { RICK_SHEET } from '@/lib/utils/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function HomePage() {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();
  const timer = useRef<number | null>(null);
  const completed = useRef(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const [logoActive, setLogoActive] = useState(false);
  const dark = resolvedTheme === 'dark';

  const startSecret = () => {
    completed.current = false;
    setLogoActive(true);
    timer.current = window.setTimeout(() => {
      completed.current = true;
      const targetTheme = dark ? 'light' : 'dark';
      setTheme(targetTheme);
      if (targetTheme === 'dark') {
        window.setTimeout(() => {
          setSecretOpen(true);
          confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 }, zIndex: 999 });
        }, 1000);
      }
    }, 5000);
  };

  const stopSecret = () => {
    if (timer.current != null) window.clearTimeout(timer.current);
    timer.current = null;
    if (!completed.current) setLogoActive(false);
  };

  return (
    <>
      {(logoActive || dark) && <link rel="preload" href={RICK_SHEET.imageUrl} as="image" />}
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,2fr)] lg:items-start">
          <section className="text-center lg:sticky lg:top-24">
            <button type="button" className="mx-auto block select-none rounded-full p-3" onPointerDown={startSecret} onPointerUp={stopSecret} onPointerLeave={stopSecret} onPointerCancel={stopSecret} aria-label="音ゲーぼっくす logo">
              <Icon path={mdiMusicBoxMultiple} size={120} className={dark ? 'dark-style' : ''} style={{ transform: logoActive ? 'rotate(1845deg)' : undefined, transition: 'transform 5000ms' }} />
            </button>
            <h1 className="mt-3 text-4xl font-semibold">{process.env.NEXT_PUBLIC_SITE_TITLE ?? '音ゲーぼっくす'}</h1>
            <p className="mt-3 text-lg opacity-80">{t('page.index.description')}</p>
          </section>
          <section>
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
              {sites.filter((site) => !site.isHidden || dark).map((site) => <Link key={site.gameCode} href={`/${site.gameCode}/`} className="group flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"><Icon path={mdiMusicBoxMultiple} size={38} style={{ color: site.themeColor }} /><span className="flex-1 text-lg font-medium">{site.gameTitle}</span><Icon path={mdiArrowRight} className="opacity-0 transition group-hover:opacity-100" /></Link>)}
            </div>
          </section>
        </div>
      </div>
      <Dialog open={secretOpen} onOpenChange={setSecretOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{RICK_SHEET.title}</DialogTitle>
            <DialogDescription>{RICK_SHEET.artist}</DialogDescription>
          </DialogHeader>
          <img src={RICK_SHEET.imageUrl} alt={RICK_SHEET.title} className="mx-auto max-h-[55vh] max-w-full object-contain" />
          <p className="mt-4 whitespace-pre-wrap text-sm opacity-80">{RICK_SHEET.comment}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
