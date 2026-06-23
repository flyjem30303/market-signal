import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { buildStockPagePayload } from "@/lib/stock-page-payload";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const revalidate = 300;
export const dynamic = "force-static";
const stockPageInitialHistoryDays = 390;
const stockPagePublicCopyContract =
  "本頁提供市場資訊整理、燈號狀態與風險觀察，不構成個股買賣建議。請搭配資料日期、引用來源與自身風險承受度判斷。";

type StockPageProps = {
  params: {
    symbol: string;
  };
};

export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
  const payload = await buildStockPagePayload(params.symbol, stockPageInitialHistoryDays);
  const asset = payload.asset;
  if (!asset) return {};

  const signal = payload.snapshot?.signal.title ?? "觀察";
  const title = `${asset.symbol} ${asset.name} 標的燈號：${signal}`;
  const description = `${asset.symbol} ${asset.name} 的市場燈號、分數、報價走勢與風險觀察。${stockPagePublicCopyContract}`;

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
  const payload = await buildStockPagePayload(params.symbol, stockPageInitialHistoryDays);
  const asset = payload.asset;
  if (!asset) notFound();

  const snapshot = payload.snapshot;
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
            name: "市場燈號",
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
        freshnessSnapshot={payload.freshnessSnapshot}
        initialSymbol={asset.symbol}
        includeSeoContent
        marketSignalSourceStatus={payload.marketSignalSourceStatus}
        repositoryData={payload.repositoryData}
      />
    </>
  );
}
