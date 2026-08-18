"use client";

import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { toLocalDateString } from "@/lib/utils/format";
import {
  toLoadingStatus,
  useCurrentData,
  useGameDataQuery,
} from "@/hooks/useGameDataQuery";
import LoadingStatus from "@/enums/LoadingStatus";

export function DataInfoBar({ className }: { className?: string }) {
  const t = useTranslations();
  const query = useGameDataQuery();
  const data = useCurrentData();
  const status = toLoadingStatus(query);
  if (status === LoadingStatus.PENDING)
    return <Alert className={className}>{t("description.pending")}</Alert>;
  if (status === LoadingStatus.LOADING)
    return <Alert className={className}>{t("description.loading")}</Alert>;
  if (status === LoadingStatus.ERROR)
    return (
      <Alert className={`border-red-500 text-red-600 ${className ?? ""}`}>
        {t("sfc.DataInfoBar.loadFailed")} ({query.error?.message})
      </Alert>
    );
  return (
    <Alert className={`border-green-500 ${className ?? ""}`}>
      {t("sfc.DataInfoBar.updateTime", {
        time: toLocalDateString(new Date(data.updateTime)),
      })}
    </Alert>
  );
}
