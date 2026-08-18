import type { MetadataRoute } from "next";
import sites from "@/data/sites.json";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const sitemap = sites
    .filter((site) => !site.isHidden)
    .map((_, index) => `${base}/sitemap/${index}.xml`);
  return { rules: { userAgent: "*", allow: "/" }, sitemap };
}
