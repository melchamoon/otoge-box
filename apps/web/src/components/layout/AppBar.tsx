"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { mdiMenu, mdiMusicBoxMultiple } from "@mdi/js";
import sites from "@/data/sites.json";
import { useOptionalGameContext } from "@/contexts/GameContext";
import { Icon } from "@/components/Icon";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function AppBar() {
  const game = useOptionalGameContext();
  const params = useParams<{ gameCode?: string | string[] }>();
  const routeGameCode = Array.isArray(params.gameCode)
    ? params.gameCode[0]
    : params.gameCode;
  const routeSite = sites.find((site) => site.gameCode === routeGameCode);
  const currentSite = game?.siteInfo ?? routeSite;
  const themeColor = game?.themeColor ?? currentSite?.themeColor ?? "#424242";
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 h-16 text-white shadow"
      style={{ backgroundColor: themeColor }}
    >
      <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-2 px-3 sm:px-6">
        <button
          type="button"
          aria-label="Open menu"
          className="rounded p-2 hover:bg-white/15"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("otoge:open-drawer"))
          }
          disabled={!currentSite}
        >
          <Icon path={mdiMenu} />
        </button>
        <Link href="/" className="flex min-w-0 items-center gap-2 no-underline">
          <Icon path={mdiMusicBoxMultiple} size={32} />
          <span className="min-w-0">
            <span className="block truncate text-lg font-medium leading-tight sm:text-xl">
              {process.env.NEXT_PUBLIC_SITE_TITLE ?? "音ゲーぼっくす"}
            </span>
            <span className="block truncate text-xs opacity-80">
              {currentSite?.gameTitle ?? "made by @zetaraku"}
            </span>
          </span>
        </Link>
        <div className="ml-auto">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
