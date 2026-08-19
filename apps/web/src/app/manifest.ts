import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "音ゲーぼっくす",
    short_name: "音ゲーぼっくす",
    icons: [
      {
        src: "/android-chrome-192x192.png?v=1",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png?v=1",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#1976d2",
    background_color: "#1976d2",
    lang: "en",
  };
}
