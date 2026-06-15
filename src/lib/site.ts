export const siteConfig = {
  name: "\u6307\u6578\u71c8\u865f",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
