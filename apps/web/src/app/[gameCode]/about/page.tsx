"use client";

import { useTranslations } from "next-intl";
import { useGameContext } from "@/contexts/GameContext";
import { ChangelogTimeline } from "@/components/changelog/ChangelogTimeline";

const sources: Record<string, string[]> = {
  maimai: ["https://maimai.sega.jp/", "https://maimai.wiki.fc2.com/"],
  chunithm: ["https://chunithm.sega.jp/", "https://gamerch.com/chunithm/"],
  sdvx: ["https://p.eagate.573.jp/game/sdvx/vi/", "https://w.atwiki.jp/sdvx/"],
  ongeki: ["https://ongeki.sega.jp/", "https://gamerch.com/ongeki/"],
  wacca: ["https://wacca.marv.jp/", "https://gamerch.com/wacca-wiki/"],
};

export default function AboutPage() {
  const t = useTranslations();
  const { gameCode } = useGameContext();
  const links = sources[gameCode] ?? [];
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-8">
      <h1 className="text-3xl font-semibold">{t("page-title.about")}</h1>
      <hr className="my-4 border-[var(--border)]" />
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("page.about.author")}</h2>
        <ul className="list-disc pl-6">
          <li>
            <a
              href="https://github.com/zetaraku"
              target="_blank"
              rel="noreferrer"
            >
              zetaraku (Raku Zeta)
            </a>
          </li>
          <li>
            <a
              href="https://reddit.com/u/zetaraku"
              target="_blank"
              rel="noreferrer"
            >
              u/zetaraku
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/zetaraku"
              target="_blank"
              rel="noreferrer"
            >
              @zetaraku
            </a>
          </li>
        </ul>
        <p>
          This project is a Next.js derivative of{" "}
          <a
            className="text-blue-600 underline"
            href="https://github.com/zetaraku/arcade-songs"
            target="_blank"
            rel="noreferrer"
          >
            zetaraku/arcade-songs
          </a>{" "}
          (MIT License, Copyright (c) Raku Zeta).
        </p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">{t("page.about.dataSource")}</h2>
        <ul className="list-disc pl-6">
          {links.map((url) => (
            <li key={url}>
              <a
                className="text-blue-600 underline"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                {url}
              </a>
            </li>
          ))}
          <li>{t("page.about.sheetInfoDescription")}</li>
        </ul>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">{t("page.about.openSource")}</h2>
        <p>{t("page.about.openSourceDescription")}</p>
        <a
          className="text-blue-600 underline"
          href={process.env.NEXT_PUBLIC_SOURCE_CODE_URL}
          target="_blank"
          rel="noreferrer"
        >
          {process.env.NEXT_PUBLIC_SOURCE_CODE_URL}
        </a>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">
          {t("page.about.updateRecord")}
        </h2>
        <ChangelogTimeline />
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">{t("page.about.disclaimer")}</h2>
        <p>
          This site is not associated or officially connected with the game
          publishers or rights holders. Game names and related marks belong to
          their respective owners.
        </p>
      </section>
    </div>
  );
}
