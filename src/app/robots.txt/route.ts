import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /internal",
    "Disallow: /api/internal",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `Host: ${siteConfig.url}`,
    ""
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
