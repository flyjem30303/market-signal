import type { Metadata } from "next";
import type { Asset } from "@/lib/assets";
import type { MarketSignalSourceStatus } from "@/lib/repositories/market-signal-source-status";
import type { MarketSignalRepository } from "@/lib/repositories/types";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const SEO_STOCK_SITEMAP_LIMIT = 100;

export const seoDefaultImagePath = "/og-default.svg";

export const seoSiteDescription =
  "指數燈號用紅黃綠燈與風險分數整理台股與主要市場觀察重點，協助投資人快速理解市場風險與趨勢強弱。";

const prioritySeoSymbols = ["TWII", "0050", "006208", "2330", "2454", "2317", "2308", "2382"];

export function buildRouteMetadata({
  description,
  path,
  title,
  type = "website"
}: {
  description: string;
  path: string;
  title: string;
  type?: "article" | "website";
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(seoDefaultImagePath);

  return {
    alternates: {
      canonical: url
    },
    description,
    openGraph: {
      description,
      images: [
        {
          alt: "指數燈號 Market Signal",
          height: 630,
          url: imageUrl,
          width: 1200
        }
      ],
      locale: "zh_TW",
      siteName: siteConfig.name,
      title,
      type,
      url
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [imageUrl],
      title
    }
  };
}

export function getStockSeoMetadataCopy(asset: Asset, signalTitle?: string) {
  const signalSuffix = signalTitle ? `：${signalTitle}` : "";

  return {
    description: `查看 ${asset.name}（${asset.symbol}）的紅黃綠燈號、風險分數與近期觀察重點。內容為市場資訊整理，不提供買賣建議。`,
    title: `${asset.name}（${asset.symbol}）台股燈號與風險分數${signalSuffix}`
  };
}

export function shouldIndexStockPage({
  asset,
  repository,
  sourceStatus
}: {
  asset: Asset;
  repository: MarketSignalRepository;
  sourceStatus: MarketSignalSourceStatus;
}) {
  if (sourceStatus.resolvedSource !== "supabase") return false;
  if (sourceStatus.publicScoreSource !== "real") return false;
  if (!["index", "etf", "stock"].includes(asset.type)) return false;

  const series = repository.getSeries(asset.symbol);
  const snapshot = series.at(-1);
  if (!snapshot) return false;
  if (series.length < 30) return false;
  if (snapshot.dataQualityScore < 70) return false;
  if (snapshot.dataQualityGrade === "D") return false;

  return true;
}

export function getSeoStockSitemapAssets({
  repository,
  sourceStatus
}: {
  repository: MarketSignalRepository;
  sourceStatus: MarketSignalSourceStatus;
}) {
  const priority = new Map(prioritySeoSymbols.map((symbol, index) => [symbol, index]));

  return repository
    .getAssets()
    .filter((asset) => shouldIndexStockPage({ asset, repository, sourceStatus }))
    .sort((a, b) => {
      const aPriority = priority.get(a.symbol) ?? Number.MAX_SAFE_INTEGER;
      const bPriority = priority.get(b.symbol) ?? Number.MAX_SAFE_INTEGER;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.symbol.localeCompare(b.symbol);
    })
    .slice(0, SEO_STOCK_SITEMAP_LIMIT);
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: seoSiteDescription,
    inLanguage: "zh-Hant",
    name: siteConfig.name,
    url: siteConfig.url
  };
}

export function buildWebPageJsonLd({
  description,
  path,
  title
}: {
  description: string;
  path: string;
  title: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    description,
    inLanguage: "zh-Hant",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url
    },
    name: title,
    url: absoluteUrl(path)
  };
}

export function buildBreadcrumbJsonLd({ path, title }: { path: string; title: string }) {
  const items = [
    {
      "@type": "ListItem",
      item: absoluteUrl("/"),
      name: siteConfig.name,
      position: 1
    }
  ];

  if (path !== "/") {
    items.push({
      "@type": "ListItem",
      item: absoluteUrl(path),
      name: title,
      position: 2
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  };
}

export function buildCorePageJsonLd({
  description,
  path,
  title
}: {
  description: string;
  path: string;
  title: string;
}) {
  return [buildWebPageJsonLd({ description, path, title }), buildBreadcrumbJsonLd({ path, title })];
}
