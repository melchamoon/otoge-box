'use client';

import { create } from 'zustand';
import type { Sheet } from '@/types';

type ComboState = { isOpened: boolean; isDrawPool: boolean; isShowAll: boolean; headerTitle?: string; currentSheets: Sheet[]; drawSize: number; allowDuplicate: boolean; isBlindfoldMode: boolean; blindfoldedIndexes: Set<number>; open: (sheets: Sheet[], options?: Partial<Pick<ComboState, 'isDrawPool' | 'headerTitle' | 'drawSize' | 'allowDuplicate'>>) => void; close: () => void; setDrawSize: (value: number) => void; setAllowDuplicate: (value: boolean) => void; setBlindfoldMode: (value: boolean) => void; reveal: (index: number) => void };

export const useSheetComboDialogStore = create<ComboState>((set) => ({
  isOpened: false, isDrawPool: false, isShowAll: false, currentSheets: [], drawSize: 4, allowDuplicate: false, isBlindfoldMode: false, blindfoldedIndexes: new Set(),
  open: (currentSheets, options) => set({ isOpened: true, currentSheets, isShowAll: false, blindfoldedIndexes: new Set(), ...options }),
  close: () => set({ isOpened: false }),
  setDrawSize: (drawSize) => set({ drawSize }),
  setAllowDuplicate: (allowDuplicate) => set({ allowDuplicate }),
  setBlindfoldMode: (isBlindfoldMode) => set({ isBlindfoldMode, blindfoldedIndexes: new Set() }),
  reveal: (index) => set((state) => ({ blindfoldedIndexes: new Set(state.blindfoldedIndexes).add(index) })),
}));
