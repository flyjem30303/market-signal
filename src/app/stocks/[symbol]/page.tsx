import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import { absoluteUrl, siteConfig } from "@/lib/site";

type StockPageProps = {
  params: {
    symbol: string;
  };
};

const snapshotDate = "2026-05-28";

export function generateMetadata({ params }: StockPageProps): Metadata {
  const repository = getMarketSignalRepository();
  const asset = repository.getAssetBySymbol(params.symbol);
  if (!asset) return {};

  const snapshot = repository.getSnapshot(asset.symbol, snapshotDate);
  const signal = snapshot?.signal.title ?? "mock 燈號";
  const description = `${asset.symbol} ${asset.name} 的公開 Beta 燈號頁，整理 mock 市場狀態、風險分數、資料更新時間與非投資建議提醒。`;

  return {
    alternates: {
      canonical: absoluteUrl(`/stocks/${asset.symbol}`)
    },
    description,
    openGraph: {
      description,
      siteName: siteConfig.name,
      title: `${asset.symbol} ${asset.name} ${signal}`,
      type: "article",
      url: absoluteUrl(`/stocks/${asset.symbol}`)
    },
    title: `${asset.symbol} ${asset.name} ${signal}`
  };
}

export function generateStaticParams() {
  const repository = getMarketSignalRepository();
  return repository.getAssets().map((asset) => ({
    symbol: asset.symbol
  }));
}

export default async function StockPage({ params }: StockPageProps) {
  const repository = getMarketSignalRepository();
  const asset = repository.getAssetBySymbol(params.symbol);
  if (!asset) notFound();

  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();
  const snapshot = repository.getSnapshot(asset.symbol, snapshotDate);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    additionalProperty: snapshot
      ? [
          {
            "@type": "PropertyValue",
            name: "mock 健康分數",
            value: snapshot.healthScore
          },
          {
            "@type": "PropertyValue",
            name: "mock 風險分數",
            value: snapshot.riskScore
          },
          {
            "@type": "PropertyValue",
            name: "mock 燈號",
            value: snapshot.signal.title
          },
          {
            "@type": "PropertyValue",
            name: "資料品質",
            value: `${snapshot.dataQualityGrade} / mock 資料`
          }
        ]
      : undefined,
    category: asset.group,
    name: `${asset.symbol} ${asset.name}`,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    url: absoluteUrl(`/stocks/${asset.symbol}`)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <DashboardShell
        freshnessSnapshot={freshness}
        initialSymbol={asset.symbol}
        includeSeoContent
        marketSignalSourceStatus={marketSignalSourceStatus}
      />
    </>
  );
}
