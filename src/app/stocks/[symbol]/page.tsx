import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRuntime, getMarketSignalSearchItems } from "@/lib/repositories/market-signal-repository";
import type { MarketSignalRepository } from "@/lib/repositories/types";
import { buildRouteMetadata, getStockSeoMetadataCopy, shouldIndexStockPage } from "@/lib/seo";
import { toMarketSignalRepositoryData } from "@/lib/repositories/static-market-signal-repository";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const revalidate = 300;
const stockPageHistoryDays = 120;

type StockPageProps = {
  params: {
    symbol: string;
  };
};

const fallbackSnapshotDate = "2026-05-28";

export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime({
    historyDays: stockPageHistoryDays,
    symbols: [params.symbol]
  });
  const asset = repository.getAssetBySymbol(params.symbol);
  if (!asset) {
    return {
      robots: {
        follow: false,
        index: false
      }
    };
  }

  const snapshotDate = getLatestSnapshotDate(repository, asset.symbol);
  const snapshot = repository.getSnapshot(asset.symbol, snapshotDate);
  const copy = getStockSeoMetadataCopy(asset, snapshot?.signal.title);
  const indexable = shouldIndexStockPage({ asset, repository, sourceStatus: marketSignalSourceStatus });

  return {
    ...buildRouteMetadata({
      description: copy.description,
      path: `/stocks/${asset.symbol}`,
      title: copy.title,
      type: "article"
    }),
    robots: indexable
      ? {
          follow: true,
          index: true
        }
      : {
          follow: false,
          index: false,
          googleBot: {
            follow: false,
            index: false
          }
        }
  };
}

export default async function StockPage({ params }: StockPageProps) {
  const stockPageSymbols = buildStockPageSymbols(params.symbol);
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime({
    historyDays: stockPageHistoryDays,
    symbols: stockPageSymbols
  });
  const watchlistItems = await getMarketSignalSearchItems();
  const asset = repository.getAssetBySymbol(params.symbol);
  if (!asset) notFound();

  const freshness = await getDataFreshnessSnapshot();
  const snapshotDate = getLatestSnapshotDate(repository, asset.symbol);
  const snapshot = repository.getSnapshot(asset.symbol, snapshotDate);
  const seoCopy = getStockSeoMetadataCopy(asset, snapshot?.signal.title);
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
    description: seoCopy.description,
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
