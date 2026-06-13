import { getMarketSignalRepository } from "@/lib/repositories/market-signal-repository";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const repository = getMarketSignalRepository();
  const staticRoutes = ["", "/briefing", "/weekly", "/membership", "/methodology", "/privacy", "/terms", "/disclaimer"];
  const stockRoutes = repository.getAssets().map((asset) => `/stocks/${asset.symbol}`);
  const now = "2026-05-28T04:00:00.000Z";
  const urls = [...staticRoutes, ...stockRoutes].map((route) =>
    [
      "  <url>",
      `    <loc>${escapeXml(absoluteUrl(route || "/"))}</loc>`,
      `    <lastmod>${now}</lastmod>`,
      `    <changefreq>${route.startsWith("/stocks") ? "daily" : "weekly"}</changefreq>`,
      `    <priority>${route === "" ? "1.0" : route.startsWith("/stocks") ? "0.8" : "0.7"}</priority>`,
      "  </url>"
    ].join("\n")
  );

  const body = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, "</urlset>", ""].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
}

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
