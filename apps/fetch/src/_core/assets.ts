export function getCoverImageMName(imageName: string) {
  if (imageName === "default-cover.png") return imageName;
  return imageName.replace(/\.[^/.]+$/, ".webp");
}
