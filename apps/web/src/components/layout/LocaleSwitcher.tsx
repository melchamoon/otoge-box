"use client";

import { useLocale } from "next-intl";
import { locales } from "@/i18n/locales";
import { setLocale } from "@/i18n/setLocale";
import { Select } from "@/components/ui/select";

export function LocaleSwitcher() {
  const locale = useLocale();
  return (
    <Select
      aria-label="Language"
      value={locale}
      onChange={(event) => {
        void setLocale(event.target.value);
      }}
      className="h-9 max-w-32 border-white/40 bg-transparent text-white"
    >
      <>
        {locales.map((entry) => (
          <option key={entry.code} value={entry.code} className="text-black">
            {entry.name}
          </option>
        ))}
      </>
    </Select>
  );
}
