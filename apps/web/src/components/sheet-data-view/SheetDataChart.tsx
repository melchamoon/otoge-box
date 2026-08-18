"use client";

import dynamic from "next/dynamic";
import * as echarts from "echarts";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useGameDataQuery, useCurrentData } from "@/hooks/useGameDataQuery";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSheetBrowserContext } from "@/contexts/SheetBrowserContext";
import { useSheetComboDialogStore } from "@/stores/sheetComboDialog";
import { countSheetsByDifficultyAndLevel } from "@/lib/utils/chart";
import type { FilterOption } from "@/types";
import type { Sheet } from "@/types";

const EChart = dynamic(() => import("echarts-for-react"), { ssr: false });
const initOptions = { renderer: "svg" } as const;
const rainbowGradient = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "red" },
  { offset: 1 / 6, color: "orange" },
  { offset: 2 / 6, color: "yellow" },
  { offset: 3 / 6, color: "green" },
  { offset: 4 / 6, color: "blue" },
  { offset: 5 / 6, color: "indigo" },
  { offset: 1, color: "violet" },
]);

type LevelOption = { value: number; text: string };
type ChartClickParams = { dataIndex?: number; name?: string };

function getLevelOptions(
  options: FilterOption<number>[] | null,
): LevelOption[] {
  return (options ?? [])
    .filter(
      (option): option is { $type: "option"; text: string; value: number } =>
        option.$type === "option",
    )
    .map(({ value, text }) => ({ value, text }));
}

export function SheetDataChart({ sheets }: { sheets: Sheet[] }) {
  const t = useTranslations();
  const data = useCurrentData();
  useGameDataQuery();
  const { filters, filterOptions } = useSheetBrowserContext();
  const openCombo = useSheetComboDialogStore((state) => state.open);
  const mobile = useMediaQuery("(max-width: 600px)");
  const useInternalLevel = Boolean(filters.useInternalLevel);
  const levelOptions = useMemo(() => {
    const allOptions = getLevelOptions(
      useInternalLevel ? filterOptions.internalLevels : filterOptions.levels,
    );
    const values = sheets
      .map((sheet) =>
        useInternalLevel ? sheet.internalLevelValue : sheet.levelValue,
      )
      .filter((value): value is number => value != null);
    if (values.length === 0) return allOptions;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const inRange = allOptions.filter(
      (option) => option.value >= min && option.value <= max,
    );
    if (inRange.length > 0) return inRange;
    return allOptions;
  }, [
    filterOptions.internalLevels,
    filterOptions.levels,
    sheets,
    useInternalLevel,
  ]);
  const levels = useMemo(() => {
    if (levelOptions.length > 0) return levelOptions;
    return [
      ...new Map(
        sheets
          .map((sheet) => {
            const value = useInternalLevel
              ? sheet.internalLevelValue
              : sheet.levelValue;
            return value == null
              ? null
              : ([
                  value,
                  useInternalLevel
                    ? (sheet.internalLevel ?? String(value))
                    : (sheet.level ?? String(value)),
                ] as const);
          })
          .filter((entry): entry is readonly [number, string] => entry != null),
      ),
    ]
      .sort(([a], [b]) => a - b)
      .map(([value, text]) => ({ value, text }));
  }, [levelOptions, sheets, useInternalLevel]);
  const counts = useMemo(
    () =>
      countSheetsByDifficultyAndLevel(
        sheets,
        data.difficulties.map((entry) => entry.difficulty),
        useInternalLevel,
      ),
    [data.difficulties, sheets, useInternalLevel],
  );
  const series = useMemo(
    () => [
      {
        name: "-",
        type: "bar",
        stack: "default",
        itemStyle: { color: rainbowGradient },
        data: levels.map(({ value, text }) => ({
          name: text,
          value: counts.get(null)?.get(value) ?? 0,
        })),
      },
      ...data.difficulties.map((difficulty) => ({
        name: difficulty.name,
        type: "bar",
        stack: "default",
        itemStyle: { color: difficulty.color },
        data: levels.map(({ value, text }) => ({
          name: text,
          value: counts.get(difficulty.difficulty)?.get(value) ?? 0,
        })),
      })),
    ],
    [counts, data.difficulties, levels],
  );
  const option = useMemo(
    () => ({
      animation: false,
      grid: { top: 10, left: 0, right: 10, bottom: 0, containLabel: true },
      tooltip: {
        trigger: "axis",
        order: "seriesDesc",
        showContent: !mobile,
        axisPointer: { animation: !mobile },
      },
      legend: { type: "scroll" },
      xAxis: {
        type: "category",
        axisTick: { interval: 0, alignWithLabel: true },
        axisLabel: { showMinLabel: true, showMaxLabel: true },
        data: levels.map(({ text }) => text),
      },
      yAxis: { type: "value" },
      series,
    }),
    [levels, mobile, series],
  );
  const events = useMemo(
    () => ({
      click: (params: ChartClickParams) => {
        const level = levels[params.dataIndex ?? -1];
        if (!level) return;
        const selectedSheets = sheets.filter(
          (sheet) =>
            (useInternalLevel ? sheet.internalLevelValue : sheet.levelValue) ===
            level.value,
        );
        openCombo(selectedSheets, {
          asDrawPool: true,
          headerTitle: `${useInternalLevel ? t("term.internalLevel") : t("term.level")} ${level.text}`,
        });
      },
    }),
    [levels, openCombo, sheets, t, useInternalLevel],
  );
  return (
    <div className="min-w-[1000px] overflow-x-auto">
      <EChart
        option={option}
        opts={initOptions}
        onEvents={events}
        style={{ height: "calc(100vh - 200px)", minHeight: 420 }}
      />
    </div>
  );
}
