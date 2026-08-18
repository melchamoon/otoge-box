"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  mdiGithub,
  mdiInformationOutline,
  mdiMusicBoxMultiple,
  mdiOpenInNew,
  mdiScriptText,
  mdiTimelineText,
  mdiDatabase,
  mdiCommentQuestion,
  mdiApps,
} from "@mdi/js";
import { useTranslations } from "next-intl";
import sites from "@/data/sites.json";
import { useOptionalGameContext } from "@/contexts/GameContext";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";

export function NavDrawer() {
  const game = useOptionalGameContext();
  const params = useParams<{ gameCode?: string | string[] }>();
  const routeGameCode = Array.isArray(params.gameCode)
    ? params.gameCode[0]
    : params.gameCode;
  const routeSite = sites.find((site) => site.gameCode === routeGameCode);
  const currentSite = game?.siteInfo ?? routeSite;
  const currentGameCode = game?.gameCode ?? currentSite?.gameCode;
  const currentThemeColor =
    game?.themeColor ?? currentSite?.themeColor ?? "#424242";
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("otoge:open-drawer", handler);
    return () => window.removeEventListener("otoge:open-drawer", handler);
  }, []);
  if (!currentSite || !currentGameCode || !open) return null;
  const menu = [
    {
      icon: mdiApps,
      title: t("page-title.home"),
      href: `/${currentGameCode}/`,
    },
    {
      icon: mdiTimelineText,
      title: t("page-title.timeline"),
      href: `/${currentGameCode}/timeline/`,
      isNew: true,
    },
    {
      icon: mdiScriptText,
      title: t("page-title.gallery"),
      href: `/${currentGameCode}/gallery/`,
    },
    {
      icon: mdiDatabase,
      title: t("page-title.songs"),
      href: `/${currentGameCode}/songs/`,
    },
    {
      icon: mdiCommentQuestion,
      title: t("page-title.bug-report"),
      href: process.env.NEXT_PUBLIC_SITE_REPORT_URL,
    },
    {
      icon: mdiGithub,
      title: t("page-title.source-code"),
      href: process.env.NEXT_PUBLIC_SOURCE_CODE_URL,
    },
    {
      icon: mdiInformationOutline,
      title: t("page-title.about"),
      href: `/${currentGameCode}/about/`,
    },
  ];
  return (
    <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}>
      <div
        className="h-full w-80 max-w-[90vw] overflow-y-auto border-r border-[var(--border)] bg-[var(--card)] p-4 text-[var(--foreground)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center gap-2">
          <Icon
            path={mdiMusicBoxMultiple}
            size={34}
            style={{ color: currentThemeColor }}
          />
          <div>
            <div className="font-medium">
              {process.env.NEXT_PUBLIC_SITE_TITLE}
            </div>
            <div className="text-sm opacity-70">{currentSite.gameTitle}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setOpen(false)}
          >
            ×
          </Button>
        </div>
        <Separator />
        <div className="my-3 space-y-1">
          {sites
            .filter((site) => !site.isHidden || dark)
            .map((site) => (
              <Link
                key={site.gameCode}
                href={`/${site.gameCode}/`}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded px-2 py-2 text-sm hover:bg-black/10 dark:hover:bg-white/10",
                  site.gameCode === currentGameCode && "font-semibold",
                )}
              >
                <Icon
                  path={mdiMusicBoxMultiple}
                  size={20}
                  style={{ color: site.themeColor }}
                />
                {site.gameTitle}
              </Link>
            ))}
        </div>
        <Separator />
        <nav className="mt-3 space-y-1">
          {menu.map((item) =>
            item.href ? (
              <Link
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded px-2 py-2 text-sm hover:bg-black/10 dark:hover:bg-white/10"
              >
                <Icon path={item.icon} size={20} />
                {item.title}
                {item.isNew && (
                  <Badge className="bg-red-500 text-white">NEW!</Badge>
                )}
                {item.href.startsWith("http") && (
                  <Icon path={mdiOpenInNew} size={14} className="ml-auto" />
                )}
              </Link>
            ) : null,
          )}
        </nav>
      </div>
    </div>
  );
}
