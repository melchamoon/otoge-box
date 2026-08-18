'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Sheet } from '@/types';

type ComboState = {
  isOpened: boolean;
  isDrawPool: boolean;
  isDrawMode: boolean;
  isShowAll: boolean;
  headerTitle?: string;
  currentSheets: Sheet[];
  isBlindfoldMode: boolean;
  blindfoldedIndexes: Set<number>;
  open: (sheets: Sheet[], options?: { isDrawPool?: boolean; asDrawPool?: boolean; isDrawMode?: boolean; headerTitle?: string }) => void;
  close: () => void;
  setBlindfoldMode: (value: boolean) => void;
  reveal: (index: number) => void;
};

type DrawSizeState = { value: number; setValue: (value: number) => void };
type AllowDuplicateState = { value: boolean; setValue: (value: boolean) => void };

export const useSheetComboDrawSizeStore = create<DrawSizeState>()(persist(
  (set) => ({ value: 4, setValue: (value) => set({ value }) }),
  { name: 'SheetComboDrawer:drawSize' },
));

export const useSheetComboAllowDuplicateStore = create<AllowDuplicateState>()(persist(
  (set) => ({ value: false, setValue: (value) => set({ value }) }),
  { name: 'SheetComboDrawer:allowDuplicate' },
));

export const useSheetComboDialogStore = create<ComboState>((set) => ({
  isOpened: false, isDrawPool: false, isDrawMode: false, isShowAll: false, currentSheets: [], isBlindfoldMode: false, blindfoldedIndexes: new Set(),
  open: (currentSheets, options) => set({
    isOpened: true,
    currentSheets,
    isShowAll: false,
    isBlindfoldMode: false,
    blindfoldedIndexes: new Set(),
    isDrawPool: options?.asDrawPool ?? options?.isDrawPool ?? false,
    isDrawMode: options?.isDrawMode ?? false,
    headerTitle: options?.headerTitle,
  }),
  close: () => set({ isOpened: false }),
  setBlindfoldMode: (isBlindfoldMode) => set({ isBlindfoldMode, blindfoldedIndexes: new Set() }),
  reveal: (index) => set((state) => ({ blindfoldedIndexes: new Set(state.blindfoldedIndexes).add(index) })),
}));
