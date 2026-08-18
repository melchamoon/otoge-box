"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useSheetBrowserContext } from "@/contexts/SheetBrowserContext";
import { VirtualCombobox } from "@/components/VirtualCombobox";
import { MultiSelect } from "@/components/MultiSelect";
import { SuperFilterDialog } from "@/components/dialogs/SuperFilterDialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { FilterOption } from "@/types";

function options<T>(entries: FilterOption<T>[] | null) {
  return (entries ?? []).filter(
    (entry): entry is { $type: "option"; text: string; value: T } =>
      entry.$type === "option",
  );
}

export function SheetFilter() {
  const t = useTranslations();
  const { filters, setFilters, filterOptions } = useSheetBrowserContext();
  const [superOpen, setSuperOpen] = useState(false);
  const levelOptions = filters.useInternalLevel
    ? filterOptions.internalLevels
    : filterOptions.levels;
  const update = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K],
  ) => setFilters((current) => ({ ...current, [key]: value }));
  const setSynced = (
    key: "minLevelValue" | "maxLevelValue" | "minBPM" | "maxBPM",
    value: string,
  ) =>
    setFilters((current) => {
      const numeric = value === "" ? null : Number(value);
      if (
        current.syncLevelValue &&
        (key === "minLevelValue" || key === "maxLevelValue")
      )
        return { ...current, minLevelValue: numeric, maxLevelValue: numeric };
      if (current.syncBPM && (key === "minBPM" || key === "maxBPM"))
        return { ...current, minBPM: numeric, maxBPM: numeric };
      return { ...current, [key]: numeric };
    });
  const multi = (
    key: "categories" | "versions" | "types" | "difficulties" | "noteDesigners",
    entries: FilterOption<string>[] | null,
  ) => (
    <MultiSelect
      options={options(entries).map((entry) => ({
        value: String(entry.value),
        text: entry.text,
      }))}
      value={filters[key]}
      onChange={(value) => update(key, value)}
      placeholder={t("ui.all")}
    />
  );
  const titleItems = useMemo(
    () => filterOptions.titles ?? [],
    [filterOptions.titles],
  );
  const artistItems = useMemo(
    () => filterOptions.artists ?? [],
    [filterOptions.artists],
  );
  const noteDesignerItems = useMemo(
    () =>
      options(filterOptions.noteDesigners).map((entry) => String(entry.value)),
    [filterOptions.noteDesigners],
  );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label>{t("term.category")}</Label>
        {multi("categories", filterOptions.categories)}
      </div>
      <div>
        <Label>{t("term.title")}</Label>
        <div className="flex gap-2">
          <VirtualCombobox
            items={titleItems}
            value={filters.title}
            onChange={(value) => update("title", value as string | null)}
          />
          <Button
            variant={filters.matchExactTitle ? "default" : "outline"}
            size="icon"
            title={t("sfc.SheetFilter.exactMatch")}
            onClick={() =>
              update("matchExactTitle", filters.matchExactTitle ? null : true)
            }
          >
            ≡
          </Button>
        </div>
      </div>
      <div>
        <Label>{t("term.difficulty")}</Label>
        {multi("difficulties", [
          ...(filterOptions.difficulties ?? []),
          ...(filterOptions.extraDifficulties?.length
            ? [
                { $type: "divider", divider: true } as FilterOption<string>,
                ...filterOptions.extraDifficulties,
              ]
            : []),
        ])}
      </div>
      <div>
        <Label>
          {filters.useInternalLevel
            ? t("term.minInternalLevel")
            : t("term.minLevel")}{" "}
          /{" "}
          {filters.useInternalLevel
            ? t("term.maxInternalLevel")
            : t("term.maxLevel")}
        </Label>
        <div className="flex gap-2">
          <Select
            value={
              filters.minLevelValue == null ? "" : String(filters.minLevelValue)
            }
            onChange={(event) => setSynced("minLevelValue", event.target.value)}
            className="w-full"
          >
            <option value="">—</option>
            {options(levelOptions).map((entry) => (
              <option key={String(entry.value)} value={String(entry.value)}>
                {entry.text}
              </option>
            ))}
          </Select>
          <Button
            variant={filters.syncLevelValue ? "default" : "outline"}
            size="icon"
            onClick={() =>
              setFilters((current) => {
                const next = !current.syncLevelValue;
                const value = current.minLevelValue ?? current.maxLevelValue;
                return {
                  ...current,
                  syncLevelValue: next ? true : null,
                  minLevelValue: next ? value : current.minLevelValue,
                  maxLevelValue: next ? value : current.maxLevelValue,
                };
              })
            }
          >
            ↔
          </Button>
          <Select
            value={
              filters.maxLevelValue == null ? "" : String(filters.maxLevelValue)
            }
            onChange={(event) => setSynced("maxLevelValue", event.target.value)}
            className="w-full"
          >
            <option value="">—</option>
            {options(levelOptions).map((entry) => (
              <option key={String(entry.value)} value={String(entry.value)}>
                {entry.text}
              </option>
            ))}
          </Select>
          <Button
            variant={filters.useInternalLevel ? "default" : "outline"}
            size="icon"
            title={t("sfc.SheetFilter.useInternalLevel")}
            onClick={() =>
              update("useInternalLevel", filters.useInternalLevel ? null : true)
            }
          >
            CC
          </Button>
        </div>
      </div>
      <div>
        <Label>{t("term.version")}</Label>
        {multi("versions", filterOptions.versions)}
      </div>
      <div>
        <Label>{t("term.type")}</Label>
        {multi("types", filterOptions.types)}
      </div>
      <div>
        <Label>{t("term.artist")}</Label>
        <div className="flex gap-2">
          <VirtualCombobox
            items={artistItems}
            value={filters.artist}
            onChange={(value) => update("artist", value as string | null)}
          />
          <Button
            variant={filters.matchExactArtist ? "default" : "outline"}
            size="icon"
            title={t("sfc.SheetFilter.exactMatch")}
            onClick={() =>
              update("matchExactArtist", filters.matchExactArtist ? null : true)
            }
          >
            ≡
          </Button>
        </div>
      </div>
      <div>
        <Label>{t("term.noteDesigner")}</Label>
        <VirtualCombobox
          items={noteDesignerItems}
          multiple
          value={filters.noteDesigners}
          onChange={(value) =>
            update("noteDesigners", (value as string[]) ?? [])
          }
        />
      </div>
      <div>
        <Label>{t("term.region")}</Label>
        <div className="flex gap-2">
          <Select
            value={filters.region ?? ""}
            onChange={(event) => update("region", event.target.value || null)}
            className="w-full"
          >
            <option value="">{t("ui.all")}</option>
            {options(filterOptions.regions).map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.text}
              </option>
            ))}
          </Select>
          <Button
            variant={filters.useRegionOverride ? "default" : "outline"}
            size="icon"
            disabled={!filters.region || filters.region.startsWith("!")}
            onClick={() =>
              update(
                "useRegionOverride",
                filters.useRegionOverride ? null : true,
              )
            }
          >
            ↻
          </Button>
        </div>
      </div>
      <div>
        <Label>
          {t("term.minBPM")} / {t("term.maxBPM")}
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            min={0}
            value={filters.minBPM ?? ""}
            onChange={(event) => setSynced("minBPM", event.target.value)}
            placeholder={String(filterOptions.bpms?.at(0) ?? 0)}
          />
          <Button
            variant={filters.syncBPM ? "default" : "outline"}
            size="icon"
            onClick={() =>
              setFilters((current) => {
                const next = !current.syncBPM;
                const value = current.maxBPM ?? current.minBPM;
                return {
                  ...current,
                  syncBPM: next ? true : null,
                  minBPM: next ? value : current.minBPM,
                  maxBPM: next ? value : current.maxBPM,
                };
              })
            }
          >
            ↔
          </Button>
          <Input
            type="number"
            min={0}
            value={filters.maxBPM ?? ""}
            onChange={(event) => setSynced("maxBPM", event.target.value)}
            placeholder={String(filterOptions.bpms?.at(-1) ?? 999)}
          />
        </div>
      </div>
      {filters.superFilter !== null && (
        <div className="md:col-span-2">
          <Label>{t("term.superFilter")}</Label>
          <Button
            variant="outline"
            className="h-auto min-h-20 w-full justify-start whitespace-pre-wrap text-left font-mono"
            onClick={() => setSuperOpen(true)}
          >
            {filters.superFilter || t("description.superFilterPlaceholder")}
          </Button>
          <SuperFilterDialog
            open={superOpen}
            onOpenChange={setSuperOpen}
            value={filters.superFilter}
            onCommit={(value) => update("superFilter", value)}
          />
        </div>
      )}
    </div>
  );
}
