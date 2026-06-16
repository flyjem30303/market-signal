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
const stockPagePublicCopyContract =
  "本頁提供市場狀態整理與風險辨識，不提供個股買賣建議。Phase 1 仍使用示範資料，正式資料切換需通過上線檢查。";

export function generateMetadata({ params }: StockPageProps): Metadata {
  const repository = getMarketSignalRepository();
  const asset = repository.getAssetBySymbol(params.symbol);
  if (!asset) return {};

  const snapshot = repository.getSnapshot(asset.symbol, snapshotDate);
  const signal = snapshot?.signal.title ?? "燈號觀察";
  const title = `${asset.symbol} ${asset.name} 燈號：${signal}`;
  const description = `${asset.symbol} ${asset.name} 的市場狀態、風險分數與資料更新邊界。Phase 1 使用示範資料，不提供投資建議。`;

  return {
    alternates: {
      canonical: absoluteUrl(`/stocks/${asset.symbol}`)
    },
    description,
    openGraph: {
      description,
      siteName: siteConfig.name,
      title,
      type: "article",
      url: absoluteUrl(`/stocks/${asset.symbol}`)
    },
    title
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
    description: stockPagePublicCopyContract,
    additionalProperty: snapshot
      ? [
          {
            "@type": "PropertyValue",
            name: "綜合分數",
            value: snapshot.compositeScore
          },
          {
            "@type": "PropertyValue",
            name: "風險分數",
            value: snapshot.riskScore
          },
          {
            "@type": "PropertyValue",
            name: "燈號狀態",
            value: snapshot.signal.title
          },
          {
            "@type": "PropertyValue",
            name: "資料品質",
            value: `${snapshot.dataQualityGrade} / 示範資料`
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
