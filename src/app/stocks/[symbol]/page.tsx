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
  const signal = snapshot?.signal.title ?? "Mock signal";
  const description = `${asset.symbol} ${asset.name} is shown in mock-only runtime. Scores are product-flow signals, not real market data, investment advice, or real score-source evidence.`;

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
            name: "Mock health score",
            value: snapshot.healthScore
          },
          {
            "@type": "PropertyValue",
            name: "Mock pullback risk score",
            value: snapshot.riskScore
          },
          {
            "@type": "PropertyValue",
            name: "Mock signal",
            value: snapshot.signal.title
          },
          {
            "@type": "PropertyValue",
            name: "Data quality state",
            value: `${snapshot.dataQualityGrade} / mock-only`
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
