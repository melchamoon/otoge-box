"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto grid max-w-screen-xl place-items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">{t("page.error.error")}</h1>
      <p className="text-red-600">{error.message}</p>
      <div className="flex gap-2">
        <Button onClick={reset}>{t("sfc.SheetDialog.tryAgain")}</Button>
        {process.env.NEXT_PUBLIC_SITE_REPORT_URL && (
          <Button variant="outline" asChild>
            <a
              href={process.env.NEXT_PUBLIC_SITE_REPORT_URL}
              target="_blank"
              rel="noreferrer"
            >
              {t("page-title.bug-report")}
            </a>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/">{t("page.error.backToHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
