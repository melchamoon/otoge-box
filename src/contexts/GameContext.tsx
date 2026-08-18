'use client';

import { createContext, useContext, useMemo } from 'react';
import { resolveDataSourceUrl } from '@/lib/utils/dataSource';
import sites from '@/data/sites.json';

export type SiteInfo = (typeof sites)[number];
export type GameContextValue = {
  gameCode: string;
  siteInfo: SiteInfo;
  gameTitle?: string;
  dataSourceUrl: string;
  coverImageSize: { width: number; height: number };
  themeColor: string;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ gameCode, children }: { gameCode: string; children: React.ReactNode }) {
  const siteInfo = sites.find((site) => site.gameCode === gameCode);
  if (!siteInfo) throw new Error(`Unknown game code: ${gameCode}`);
  const typedSiteInfo = siteInfo as SiteInfo;
  const value = useMemo<GameContextValue>(() => ({
    gameCode,
    siteInfo: typedSiteInfo,
    gameTitle: typedSiteInfo.gameTitle,
    dataSourceUrl: resolveDataSourceUrl(gameCode, process.env.NEXT_PUBLIC_LOCAL_DATA_BASE_URL || undefined) ?? typedSiteInfo.dataSourceUrl,
    coverImageSize: typedSiteInfo.coverImageSize ?? { width: 100, height: 100 },
    themeColor: typedSiteInfo.themeColor ?? '#424242',
  }), [gameCode, typedSiteInfo]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGameContext must be used under GameProvider');
  return value;
}

export function useOptionalGameContext() { return useContext(GameContext); }
