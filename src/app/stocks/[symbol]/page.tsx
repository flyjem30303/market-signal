import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRuntime, getMarketSignalSearchItems } from "@/lib/repositories/market-signal-repository";
import type { MarketSignalRepository } from "@/lib/repositories/types";
import { toMarketSignalRepositoryData } from "@/lib/repositories/static-market-signal-repository";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const revalidate = 300;

type StockPageProps = {
  params: {
    symbol: string;
  };
};

const fallbackSnapshotDate = "2026-05-28";
const stockPagePublicCopyContract =
  "本頁整理標的燈號、分數、資料日期與引用來源，協助使用者建立觀察順序；內容不構成投資建議。";

export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
  const { repository } = await getMarketSignalRuntime({ symbols: [params.symbol] });
  const asset = repository.getAssetBySymbol(params.symbol);
  if (!asset) return {};

  const snapshotDate = getLatestSnapshotDate(repository, asset.symbol);
  const snapshot = repository.getSnapshot(asset.symbol, snapshotDate);
  const signal = snapshot?.signal.title ?? "觀察";
  const title = `${asset.symbol} ${asset.name} 標的燈號：${signal}`;
  const description = `${asset.symbol} ${asset.name} 的市場狀態、綜合分數、風險分數與資料日期。${stockPagePublicCopyContract}`;

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

export default async function StockPage({ params }: StockPageProps) {
  const stockPageSymbols = buildStockPageSymbols(params.symbol);
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime({ symbols: stockPageSymbols });
  const watchlistItems = await getMarketSignalSearchItems();
  const asset = repository.getAssetBySymbol(params.symbol);
  if (!asset) notFound();

  const freshness = await getDataFreshnessSnapshot();
  const snapshotDate = getLatestSnapshotDate(repository, asset.symbol);
  const snapshot = repository.getSnapshot(asset.symbol, snapshotDate);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
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
            value: `${snapshot.dataQualityGrade} / ${snapshot.dataQualityScore}`
          }
        ]
      : undefined,
    category: asset.group,
    description: stockPagePublicCopyContract,
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
        repositoryData={toMarketSignalRepositoryData(repository, snapshotDate, stockPageSymbols, {
          includeSeriesDays: 90
        })}
        watchlistItems={watchlistItems}
      />
    </>
  );
}

function getLatestSnapshotDate(repository: MarketSignalRepository, symbol: string) {
  return repository.getSeries(symbol).at(-1)?.date ?? fallbackSnapshotDate;
}

function buildStockPageSymbols(symbol: string) {
  return Array.from(new Set([symbol, "TWII", "0050", "006208", "2330", "2308", "2382"]));
}
