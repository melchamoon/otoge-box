"use client";

import { useMemo } from "react";
import { getCanonicalSheet } from "@/lib/utils/sheet";
import { useGameContext } from "@/contexts/GameContext";
import { useMyListStore } from "@/stores/myList";
import type { Sheet } from "@/types";

const EMPTY_SHEETS: Sheet[] = [];

export function useSelectedSheets() {
  const { gameCode } = useGameContext();
  const selectedSheets = useMyListStore(
    (state) => state.byGame[gameCode] ?? EMPTY_SHEETS,
  );
  const toggle = useMyListStore((state) => state.toggle);
  const setSheets = useMyListStore((state) => state.setSheets);
  const selectedSheetSet = useMemo(
    () => new Set(selectedSheets),
    [selectedSheets],
  );
  const toggleSheetSelection = (sheet: Sheet) =>
    toggle(gameCode, getCanonicalSheet(sheet));
  return {
    selectedSheets,
    selectedSheetSet,
    toggleSheetSelection,
    setSelectedSheets: (sheets: Sheet[]) => setSheets(gameCode, sheets),
  };
}
