import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { getMarketSignalRepository } from "@/lib/repositories/market-signal-repository";
import { absoluteUrl, siteConfig } from "@/lib/site";

type StockPageProps = {
  params: {
    symbol: string;
  };
};

export function generateMetadata({ params }: StockPageProps): Metadata {
  const repository = getMarketSignalRepository();
  const asset = repository.getAssetBySymbol(params.symbol);
  if (!asset) return {};
  const snapshot = repository.getSnapshot(asset.symbol, "2026-05-28");
  const signal = snapshot?.signal.title ?? "燈號";

  return {
    title: `${asset.symbol} ${asset.name} ${signal}`,
    description: `${asset.symbol} ${asset.name} 目前${signal}，追蹤多頭健康度、回檔風險度、新聞信心與回測摘要。`,
    alternates: {
      canonical: absoluteUrl(`/stocks/${asset.symbol}`)
    },
    openGraph: {
      title: `${asset.symbol} ${asset.name} ${signal}`,
      description: `${asset.symbol} ${asset.name} 目前${signal}，追蹤多頭健康度、回檔風險度、新聞信心與回測摘要。`,
      type: "article",
      url: absoluteUrl(`/stocks/${asset.symbol}`),
      siteName: siteConfig.name
    }
  };
}

export function generateStaticParams() {
  const repository = getMarketSignalRepository();
  return repository.getAssets().map((asset) => ({
    symbol: asset.symbol
  }));
}

export default function StockPage({ params }: StockPageProps) {
  const repository = getMarketSignalRepository();
  const asset = repository.getAssetBySymbol(params.symbol);
  if (!asset) notFound();
  const snapshot = repository.getSnapshot(asset.symbol, "2026-05-28");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${asset.symbol} ${asset.name}`,
    url: absoluteUrl(`/stocks/${asset.symbol}`),
    category: asset.group,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    additionalProperty: snapshot
      ? [
          {
            "@type": "PropertyValue",
            name: "多頭健康度",
            value: snapshot.healthScore
          },
          {
            "@type": "PropertyValue",
            name: "回檔風險度",
            value: snapshot.riskScore
          },
          {
            "@type": "PropertyValue",
            name: "綜合燈號",
            value: snapshot.signal.title
          },
          {
            "@type": "PropertyValue",
            name: "資料品質",
            value: `${snapshot.dataQualityGrade} 級`
          }
        ]
      : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <DashboardShell initialSymbol={asset.symbol} includeSeoContent />
    </>
  );
}
