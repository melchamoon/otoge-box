'use client';

import Link from 'next/link';
import { mdiAlertCircleOutline } from '@mdi/js';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/ui/button';

export default function NotFound() { return <div className="mx-auto grid max-w-screen-xl place-items-center gap-5 px-4 py-24 text-center"><Icon path={mdiAlertCircleOutline} size={120} className="text-[var(--theme-color)]" /><h1 className="text-3xl font-semibold">Page Not Found</h1><Button asChild><Link href="/">Back to Home</Link></Button></div>; }
