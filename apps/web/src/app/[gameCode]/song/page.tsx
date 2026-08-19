"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useGameContext } from "@/contexts/GameContext";
import { useGameDataQuery, useCurrentData } from "@/hooks/useGameDataQuery";
import { useGameLookups } from "@/hooks/useGameLookups";
import { useSheetDialogStore } from "@/stores/sheetDialog";
import { noteTypesByGame } from "@/data/gameFeatures";
import { validateNoteCounts } from "@/lib/utils/sheet";
import { Button } from "@/components/ui/button";

function SongDetail() {
  const t = useTranslations();
  const params = useSearchParams();
  const { gameCode } = useGameContext();
  const query = useGameDataQuery();
  const data = useCurrentData();
  const lookup = useGameLookups();
  const open = useSheetDialogStore((state) => state.open);
  const songId = params.get("id");
  const song = data.songs.find((entry) => entry.songId === songId);
  const noteKeys = useMemo(
    () =>
      gameCode === "ongeki"
        ? ["total", "bell"]
        : noteTypesByGame[gameCode]
          ? ["total", ...noteTypesByGame[gameCode]]
          : [],
    [gameCode],
  );
  if (query.isSuccess && !song) notFound();
  if (!song)
    return <div className="p-10 text-center">{t("description.loading")}</div>;
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-8">
      <Button variant="outline" asChild>
        <Link href={`/${gameCode}/songs/`}>← {t("ui.goBack")}</Link>
      </Button>
      <h1 className="my-6 text-3xl font-semibold">{song.title}</h1>
      <div className="grid gap-6 md:grid-cols-[300px_1fr] md:items-start">
        <img
          src={song.imageUrl}
          alt={song.title}
          className="h-[300px] w-[300px] object-contain"
        />
        <table className="border-collapse text-sm">
          <tbody>
            {[
              [t("term.category"), song.category],
              [t("term.title"), song.title],
              [t("term.artist"), song.artist],
              [t("term.bpm"), song.bpm],
              [t("term.releaseDate"), song.releaseDate?.replaceAll("-", "/")],
              [t("term.version"), song.version],
            ].map(([key, value]) => (
              <tr
                key={key as string}
                className="border-b border-[var(--border)]"
              >
                <th className="px-3 py-2 text-left">{key}</th>
                <td className="px-3 py-2">{value ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="my-6 text-2xl font-semibold">
        {t("page.songs.sheetData")}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-[800px] border-collapse text-center text-sm">
          <thead>
            <tr className="bg-black/5 dark:bg-white/5">
              <th className="px-2 py-2">{t("term.type")}</th>
              <th className="px-2 py-2">{t("term.difficulty")}</th>
              <th className="px-2 py-2">{t("term.level")}</th>
              <th className="px-2 py-2">{t("term.internalLevel")}</th>
              {noteKeys.map((key) => (
                <th key={key} className="px-2 py-2">
                  {key === "total" ? t("term.totalNotes") : key.toUpperCase()}
                </th>
              ))}
              <th className="px-2 py-2">{t("term.noteDesigner")}</th>
            </tr>
          </thead>
          <tbody>
            {song.sheets.map((sheet) => (
              <tr
                key={sheet.sheetExpr}
                className="border-b border-[var(--border)]"
              >
                <td className="px-2 py-2">{lookup.getTypeAbbr(sheet.type)}</td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    className="font-bold underline"
                    style={{
                      color: lookup.getDifficultyColor(sheet.difficulty),
                    }}
                    onClick={() => open(sheet)}
                  >
                    {lookup.getDifficultyName(sheet.difficulty)}
                  </button>
                </td>
                <td className="px-2 py-2">{sheet.level}</td>
                <td className="px-2 py-2">{sheet.internalLevel ?? "—"}</td>
                {noteKeys.map((key) => (
                  <td key={key} className="px-2 py-2">
                    {sheet.noteCounts?.[key] ?? "—"}
                    {key === "total" &&
                      !validateNoteCounts(sheet, gameCode) && (
                        <span title={t("description.invalidNoteCounts")}>
                          {" "}
                          ⚠
                        </span>
                      )}
                  </td>
                ))}
                <td className="px-2 py-2">{sheet.noteDesigner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SongPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
      <SongDetail />
    </Suspense>
  );
}
