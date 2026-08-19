"use client";

import { createContext, useContext } from "react";
import type { FilterOptions, Filters, Sheet } from "@/types";

export type DisplayMode = "grid" | "table" | "chart";
export type FilterMode = "filter" | "my-list";
export type SheetBrowserContextValue = {
  displayingSheets: Sheet[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filterOptions: FilterOptions;
  displayMode: DisplayMode;
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>;
  filterMode: FilterMode;
  setFilterMode: React.Dispatch<React.SetStateAction<FilterMode>>;
};

const SheetBrowserContext = createContext<SheetBrowserContextValue | null>(
  null,
);

export function SheetBrowserProvider({
  value,
  children,
}: {
  value: SheetBrowserContextValue;
  children: React.ReactNode;
}) {
  return (
    <SheetBrowserContext.Provider value={value}>
      {children}
    </SheetBrowserContext.Provider>
  );
}
export function useSheetBrowserContext() {
  const value = useContext(SheetBrowserContext);
  if (!value)
    throw new Error(
      "useSheetBrowserContext must be used within SheetBrowserProvider",
    );
  return value;
}
