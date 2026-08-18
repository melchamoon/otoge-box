"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import { useGameContext } from "@/contexts/GameContext";
import { useGameLookups } from "@/hooks/useGameLookups";
import { cn } from "@/lib/cn";
import type { Song } from "@/types";

export const SongTile = memo(function SongTile({
  song,
  hideTitle = false,
  hideCover = false,
  hideLock = false,
  onClick,
}: {
  song: Song;
  hideTitle?: boolean;
  hideCover?: boolean;
  hideLock?: boolean;
  onClick?: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const { coverImageSize } = useGameContext();
  const lookup = useGameLookups();
  return (
    <div
      className="relative cursor-pointer rounded p-2 select-none hover:z-10"
      title={!hideTitle ? song.title : undefined}
      onClick={onClick}
    >
      <div
        className={cn(
          "inline-block p-2",
          song.sheets.some((sheet) => sheet.isSpecial) && "rainbow-background",
        )}
      >
        <div
          className={cn(
            "relative inline-block bg-gray-500 shadow-[0_14px_28px_rgb(0_0_0/25%),0_10px_10px_rgb(0_0_0/22%)] transition-transform duration-250 hover:scale-120",
            resolvedTheme === "dark" && "dark-style",
          )}
          style={{ width: coverImageSize.width, height: coverImageSize.height }}
        >
          {hideCover ? (
            <div className="grid h-full place-items-center text-2xl text-white">
              {song.songNo}
            </div>
          ) : (
            <img
              src={song.imageUrlM ?? song.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          {!hideCover &&
            (song.imageName ?? "").endsWith("default-cover.png") && (
              <span className="absolute left-0 top-0 max-h-full max-w-full overflow-hidden p-1.5 font-bold text-white [text-shadow:0_0_3px_black,0_0_3px_black,0_0_3px_black,0_0_3px_black]">
                {song.title}
              </span>
            )}
          {song.isLocked && !hideLock && (
            <img
              src={lookup.getLockedIconUrl()}
              height={lookup.getLockedIconHeight()}
              alt=""
              className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2"
            />
          )}
        </div>
      </div>
    </div>
  );
});
