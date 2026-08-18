'use client';

import { create } from 'zustand';
import type { Sheet } from '@/types';
import { isCanonicalSheet } from '@/lib/utils/sheet';

type MyListState = {
  byGame: Record<string, Sheet[]>;
  setSheets: (gameCode: string, sheets: Sheet[]) => void;
  toggle: (gameCode: string, sheet: Sheet) => void;
  clear: (gameCode: string) => void;
};

export const useMyListStore = create<MyListState>((set) => ({
  byGame: {},
  setSheets: (gameCode, sheets) => set((state) => ({ byGame: { ...state.byGame, [gameCode]: sheets } })),
  toggle: (gameCode, sheet) => set((state) => {
    if (!isCanonicalSheet(sheet)) console.warn('Non-canonical sheet should not be used as selected sheets.');
    const current = state.byGame[gameCode] ?? [];
    const next = current.includes(sheet) ? current.filter((entry) => entry !== sheet) : [...current, sheet];
    return { byGame: { ...state.byGame, [gameCode]: next } };
  }),
  clear: (gameCode) => set((state) => ({ byGame: { ...state.byGame, [gameCode]: [] } })),
}));
