import type { MetadataRoute } from "next";

import { getMarketSignalRepository } from "@/lib/repositories/market-signal-repository";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const repository = getMarketSignalRepository();
  const staticRoutes = ["", "/briefing", "/weekly", "/membership", "/methodology", "/privacy", "/terms", "/disclaimer"];
  const stockRoutes = repository.getAssets().map((asset) => `/stocks/${asset.symbol}`);
  const lastModified = new Date("2026-05-28T04:00:00.000Z");

  return [...staticRoutes, ...stockRoutes].map((route) => ({
    url: absoluteUrl(route || "/"),
    lastModified,
    changeFrequency: route.startsWith("/stocks") ? "daily" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/stocks") ? 0.8 : 0.7
  }));
}
