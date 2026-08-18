import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import sites from "@/data/sites.json";
import { GameProvider } from "@/contexts/GameContext";
import { SheetDialog } from "@/components/dialogs/SheetDialog";
import { SheetComboDialog } from "@/components/dialogs/SheetComboDialog";

export function generateStaticParams() {
  return sites.map((site) => ({ gameCode: site.gameCode }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameCode: string }>;
}): Promise<Metadata> {
  const { gameCode } = await params;
  const site = sites.find((entry) => entry.gameCode === gameCode);
  if (!site) return {};
  const title = site.gameTitle ?? gameCode;
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE ?? "音ゲーぼっくす";
  const description = (
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION_EN ?? ""
  ).replace("______", title);
  const descriptionJp = (
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION_JP ?? ""
  ).replace("______", title);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageTitle = `${title} | ${siteTitle}`;
  const logoUrl = new URL("/logo.png?v=1", siteUrl).toString();
  return {
    title,
    description,
    openGraph: {
      title: pageTitle,
      siteName: pageTitle,
      description,
      url: new URL(`/${gameCode}/`, siteUrl),
      images: [logoUrl],
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: descriptionJp,
      images: [logoUrl],
    },
    other: {
      "theme-color": site.themeColor,
      "msapplication-TileColor": site.themeColor,
    },
  };
}

export async function generateViewport({
  params,
}: {
  params: Promise<{ gameCode: string }>;
}): Promise<Viewport> {
  const { gameCode } = await params;
  return {
    themeColor:
      sites.find((entry) => entry.gameCode === gameCode)?.themeColor ??
      "#424242",
  };
}

export default async function GameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ gameCode: string }>;
}) {
  const { gameCode } = await params;
  const site = sites.find((entry) => entry.gameCode === gameCode);
  if (!site) notFound();
  return (
    <GameProvider gameCode={gameCode}>
      <div
        className="contents"
        style={{ "--theme-color": site.themeColor } as CSSProperties}
      >
        {children}
        <SheetDialog />
        <SheetComboDialog />
      </div>
    </GameProvider>
  );
}
