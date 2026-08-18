'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { mdiAlertCircleOutline } from '@mdi/js';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/ui/button';

export default function GameNotFound() {
  const t = useTranslations();
  const params = useParams<{ gameCode?: string | string[] }>();
  const gameCode = Array.isArray(params.gameCode) ? params.gameCode[0] : params.gameCode;
  return <div className="mx-auto grid max-w-screen-xl place-items-center gap-5 px-4 py-24 text-center"><Icon path={mdiAlertCircleOutline} size={120} className="text-[var(--theme-color)]" /><h1 className="text-3xl font-semibold">{t('page.error.notFound')}</h1><Button asChild><Link href={gameCode ? `/${gameCode}/` : '/'}>{t('page.error.backToHome')}</Link></Button></div>;
}
