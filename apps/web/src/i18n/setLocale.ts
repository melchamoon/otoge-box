"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { defaultLocale, localeCookieName, locales } from "./locales";

export async function setLocale(locale: string) {
  const nextLocale = locales.some((entry) => entry.code === locale)
    ? locale
    : defaultLocale;
  (await cookies()).set(localeCookieName, nextLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
