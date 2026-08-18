'use client';

import { useOptionalGameContext } from '@/contexts/GameContext';

export function useGameInfo() {
  const game = useOptionalGameContext();
  return {
    gameCode: game?.gameCode ?? null,
    gameTitle: game?.siteInfo.gameTitle,
    themeColor: game?.themeColor ?? '#424242',
    coverImageSize: game?.coverImageSize ?? { width: 100, height: 100 },
    dataSourceUrl: game?.dataSourceUrl,
  };
}
