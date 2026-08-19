"use client";

import { createContext, useContext, useMemo } from "react";
import sites from "@/data/sites.json";

type SiteInfo = (typeof sites)[number];
export type GameContextValue = {
  gameCode: string;
  siteInfo: SiteInfo;
  gameTitle?: string;
  dataSourceUrl: string;
  coverImageSize: { width: number; height: number };
  themeColor: string;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  gameCode,
  dataSourceUrl,
  children,
}: {
  gameCode: string;
  dataSourceUrl: string;
  children: React.ReactNode;
}) {
  const siteInfo = sites.find((site) => site.gameCode === gameCode);
  if (!siteInfo) throw new Error(`Unknown game code: ${gameCode}`);
  const typedSiteInfo = siteInfo as SiteInfo;
  const value = useMemo<GameContextValue>(
    () => ({
      gameCode,
      siteInfo: typedSiteInfo,
      gameTitle: typedSiteInfo.gameTitle,
      dataSourceUrl,
      coverImageSize: typedSiteInfo.coverImageSize ?? {
        width: 100,
        height: 100,
      },
      themeColor: typedSiteInfo.themeColor ?? "#424242",
    }),
    [dataSourceUrl, gameCode, typedSiteInfo],
  );
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const value = useContext(GameContext);
  if (!value) throw new Error("useGameContext must be used under GameProvider");
  return value;
}

export function useOptionalGameContext() {
  return useContext(GameContext);
}
