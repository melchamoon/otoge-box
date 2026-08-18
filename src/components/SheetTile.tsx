"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import { useGameContext } from "@/contexts/GameContext";
import { useGameLookups } from "@/hooks/useGameLookups";
import { useSelectedSheets } from "@/hooks/useSelectedSheets";
import { getCanonicalSheet } from "@/lib/utils/sheet";
import { useSheetDialogStore } from "@/stores/sheetDialog";
import { cn } from "@/lib/cn";
import type { Sheet } from "@/types";

export const SheetTile = memo(function SheetTile({
  sheet,
  hideTitle = false,
  hideCover = false,
  hideLevel = false,
  hideLock = false,
  filterMode,
  onClick,
}: {
  sheet: Sheet;
  hideTitle?: boolean;
  hideCover?: boolean;
  hideLevel?: boolean;
  hideLock?: boolean;
  filterMode?: string;
  onClick?: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const { coverImageSize } = useGameContext();
  const lookup = useGameLookups();
  const { selectedSheetSet, toggleSheetSelection } = useSelectedSheets();
  const open = useSheetDialogStore((state) => state.open);
  const canonical = getCanonicalSheet(sheet);
  const selected = selectedSheetSet.has(canonical);
  const typeIcon = lookup.getTypeIconUrl(sheet.type);
  const difficultyIcon = lookup.getDifficultyIconUrl(sheet.difficulty);
  return (
    <div
      className={cn(
        "relative cursor-pointer rounded p-3 select-none transition hover:z-10 hover:shadow-[0_0_10px_5px_rgb(0_0_0/25%)]",
        filterMode !== "my-list" && selected && "bg-[#4eda]",
      )}
      title={!hideTitle ? sheet.title : undefined}
      onClick={onClick ?? (() => open(sheet))}
      onContextMenu={(event) => {
        event.preventDefault();
        toggleSheetSelection(canonical);
      }}
    >
      <div
        className={cn(
          "inline-block p-2",
          sheet.isSpecial && "rainbow-background",
        )}
      >
        <div
          className={cn(
            "relative inline-block bg-gray-500 shadow-[0_14px_28px_rgb(0_0_0/25%),0_10px_10px_rgb(0_0_0/22%)] transition-transform duration-250 hover:scale-120",
            resolvedTheme === "dark" && "dark-style",
          )}
          style={{ width: coverImageSize.width, height: coverImageSize.height }}
        >
          <div className="h-full w-full overflow-hidden">
            {hideCover ? (
              <div className="grid h-full place-items-center text-2xl text-white">
                {sheet.songNo}
              </div>
            ) : sheet.imageUrl ? (
              <img
                src={sheet.imageUrl}
                alt=""
                className="h-full w-full object-cover align-middle"
              />
            ) : (
              <div className="grid h-full place-items-center text-2xl text-white">
                {sheet.songNo}
              </div>
            )}
          </div>
          {!hideCover &&
            (sheet.imageName ?? "").endsWith("default-cover.png") && (
              <span className="absolute left-0 top-0 max-h-full max-w-full overflow-hidden p-1.5 font-bold text-white [text-shadow:0_0_3px_black,0_0_3px_black,0_0_3px_black,0_0_3px_black]">
                {sheet.title}
              </span>
            )}
          {sheet.isLocked && !hideLock && (
            <img
              src={lookup.getLockedIconUrl()}
              height={lookup.getLockedIconHeight()}
              alt=""
              className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2"
            />
          )}
          {typeIcon && (
            <img
              src={typeIcon}
              height={lookup.getTypeIconHeight(sheet.type)}
              alt=""
              className="absolute bottom-0 left-[-20px] translate-y-1/2"
            />
          )}
          {sheet.internalLevel != null && !hideLevel && (
            <span className="absolute left-0 top-0 min-w-11 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-600 px-1.5 text-center font-bold text-white">
              {sheet.internalLevel}
            </span>
          )}
        </div>
      </div>
      <div
        className="mt-4 text-center"
        style={{ maxWidth: coverImageSize.width + 16 }}
      >
        <div
          className="whitespace-nowrap font-bold"
          style={{
            color: lookup.getDifficultyColor(sheet.difficulty),
            fontSize:
              sheet.levelValue != null && sheet.levelValue >= 100
                ? "small"
                : undefined,
          }}
        >
          {difficultyIcon ? (
            <img
              src={difficultyIcon}
              height={lookup.getDifficultyIconHeight(sheet.difficulty)}
              alt={lookup.getDifficultyName(sheet.difficulty)}
              className="mr-1 inline align-middle"
            />
          ) : (
            lookup.getDifficultyName(sheet.difficulty)
          )}
          {!hideLevel && sheet.level}
        </div>
      </div>
    </div>
  );
});
