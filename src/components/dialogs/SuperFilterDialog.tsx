"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGameContext } from "@/contexts/GameContext";
import { parseSuperFilter } from "@/lib/utils/filter";

export function SuperFilterDialog({
  open,
  onOpenChange,
  value,
  onCommit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onCommit: (value: string) => void;
}) {
  const t = useTranslations();
  const { dataSourceUrl } = useGameContext();
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);
  const error = useMemo(() => {
    if (!draft) return "";
    try {
      const result = parseSuperFilter(draft);
      return typeof result === "function"
        ? ""
        : "You should return a predicate function.";
    } catch (err) {
      return String(err);
    }
  }, [draft]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("term.superFilter")} (JavaScript)</DialogTitle>
          <DialogDescription>
            {t("description.superFilterHint")}
          </DialogDescription>
        </DialogHeader>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            <code>sheet</code> is a{" "}
            <a
              className="text-blue-600 underline"
              href="https://github.com/zetaraku/arcade-songs/blob/master/types/Sheet.ts"
              target="_blank"
              rel="noreferrer"
            >
              <code>Sheet</code>
            </a>{" "}
            with the properties of its{" "}
            <a
              className="text-blue-600 underline"
              href="https://github.com/zetaraku/arcade-songs/blob/master/types/Song.ts"
              target="_blank"
              rel="noreferrer"
            >
              <code>Song</code>
            </a>
            .
          </li>
          <li>
            You can refer to the <code>songs</code> property in the{" "}
            <a
              className="text-blue-600 underline"
              href={`${dataSourceUrl}/data.json`}
              target="_blank"
              rel="noreferrer"
            >
              Current Data Source
            </a>
            .
          </li>
          <li>
            <a
              className="text-blue-600 underline"
              href="https://gist.github.com/zetaraku/e2dab92b65ca2e0166f61f44fca16547"
              target="_blank"
              rel="noreferrer"
            >
              Examples
            </a>
          </li>
          <li>
            <strong>
              Do not paste code that you cannot trust or understand.
            </strong>
          </li>
        </ul>
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t("description.superFilterPlaceholder")}
          className="font-mono"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("ui.cancel")}
          </Button>
          <Button
            disabled={Boolean(error)}
            onClick={() => {
              onCommit(draft);
              onOpenChange(false);
            }}
          >
            {t("ui.ok")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
