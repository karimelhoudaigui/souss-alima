export function publicAsset(src?: string | null) {
  if (!src) return src;
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!basePath || !src.startsWith("/")) return src;
  if (src.startsWith(`${basePath}/`)) return src;

  return `${basePath}${src}`;
}
