import type { MetadataRoute } from "next";

import { DEFAULT_LOCALE, SECONDARY_LOCALE, type SupportedLocale } from "@/lib/i18n/config";
import { I18N_ROUTE_KEYS, getLocalizedPath, type I18nRouteKey } from "@/lib/i18n/routes";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRepository, getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";
import { getSeoStockSitemapAssets } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const fallbackLastModified = new Date("2026-05-28T04:00:00.000Z");

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repository = getMarketSignalRepository();
  const sourceStatus = getMarketSignalSourceStatus();
  const i18nRoutes = I18N_ROUTE_KEYS.flatMap((routeKey) =>
    ([DEFAULT_LOCALE, SECONDARY_LOCALE] as const).map((locale) => buildI18nSitemapEntry(routeKey, locale))
  );
  const stockRoutes = getSeoStockSitemapAssets({ repository, sourceStatus }).map((asset) => `/stocks/${asset.symbol}`);
  const lastModified = await getSitemapLastModified();

  return [
    ...i18nRoutes.map((entry) => ({ ...entry, lastModified })),
    ...stockRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.8
    }))
  ];
}

async function getSitemapLastModified() {
  try {
    const freshness = await getDataFreshnessSnapshot();
    return toSitemapLastModified(freshness.asOfDate) ?? fallbackLastModified;
  } catch {
    return fallbackLastModified;
  }
}

function toSitemapLastModified(asOfDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(asOfDate)) return null;
  const date = new Date(`${asOfDate}T04:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildI18nSitemapEntry(routeKey: I18nRouteKey, locale: SupportedLocale) {
  const path = getLocalizedPath(routeKey, locale);
  const zhPath = getLocalizedPath(routeKey, DEFAULT_LOCALE);
  const enPath = getLocalizedPath(routeKey, SECONDARY_LOCALE);

  return {
    alternates: {
      languages: {
        [DEFAULT_LOCALE]: absoluteUrl(zhPath),
        [SECONDARY_LOCALE]: absoluteUrl(enPath),
        "x-default": absoluteUrl(zhPath)
      }
    },
    changeFrequency: "weekly" as const,
    priority: routeKey === "home" ? 1 : 0.7,
    url: absoluteUrl(path)
  };
}
