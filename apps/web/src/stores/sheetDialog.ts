"use client";

import { create } from "zustand";
import type { Sheet } from "@/types";

type SheetDialogState = {
  isOpened: boolean;
  isDrawMode: boolean;
  currentSheet?: Sheet;
  open: (sheet: Sheet, isDrawMode?: boolean) => void;
  close: () => void;
};
export const useSheetDialogStore = create<SheetDialogState>((set) => ({
  isOpened: false,
  isDrawMode: false,
  currentSheet: undefined,
  open: (currentSheet, isDrawMode = false) =>
    set({ isOpened: true, currentSheet, isDrawMode }),
  close: () => set({ isOpened: false, isDrawMode: false }),
}));
