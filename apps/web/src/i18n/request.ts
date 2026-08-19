import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import YAML from "yaml";
import { defaultLocale, localeCookieName, locales } from "./locales";

type MessageTree = Record<string, unknown>;

function readMessages(locale: string): MessageTree {
  const file = path.join(process.cwd(), "src/i18n/messages", `${locale}.yaml`);
  return YAML.parse(fs.readFileSync(file, "utf8")) as MessageTree;
}

function isMessageTree(value: unknown): value is MessageTree {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

export function deepMerge(
  base: MessageTree,
  override: MessageTree,
): MessageTree {
  const result: MessageTree = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    result[key] =
      isMessageTree(current) && isMessageTree(value)
        ? deepMerge(current, value)
        : value;
  }
  return result;
}

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get(localeCookieName)?.value;
  const locale = locales.some((entry) => entry.code === cookieLocale)
    ? cookieLocale!
    : defaultLocale;
  return {
    locale,
    timeZone: "Asia/Tokyo",
    messages: deepMerge(readMessages(defaultLocale), readMessages(locale)),
  };
});
