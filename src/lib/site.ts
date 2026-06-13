export const siteConfig = {
  name: "指數燈號",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
