'use client';

import { mdiLightbulbOnOutline, mdiWeatherNight } from '@mdi/js';
import { useTheme } from 'next-themes';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/ui/button';

export function DarkModeSwitcher() { const { resolvedTheme, setTheme } = useTheme(); return <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}><Icon path={resolvedTheme === 'dark' ? mdiLightbulbOnOutline : mdiWeatherNight} /></Button>; }
