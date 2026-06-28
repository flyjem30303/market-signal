import type { Metadata } from "next";
import { HomepageGlobalShell } from "@/components/homepage-global-shell";
import { PageViewTracker } from "@/components/page-view-tracker";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { SECONDARY_LOCALE } from "@/lib/i18n/config";
import { buildI18nAlternates } from "@/lib/i18n/metadata";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import { buildCorePageJsonLd, buildRouteMetadata, seoSiteDescription } from "@/lib/seo";
import type { SignalSnapshot } from "@/lib/signal-model";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildRouteMetadata({
  description: seoSiteDescription,
  path: "/en",
  title: "Global Market Risk Compass"
});

metadata.alternates = buildI18nAlternates("home", SECONDARY_LOCALE);

const homeJsonLd = buildCorePageJsonLd({
  description: seoSiteDescription,
  path: "/en",
  title: "Global Market Risk Compass"
});

export default async function EnglishHomePage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const freshness = await getDataFreshnessSnapshot();
  const taiwanAsset = repository.getAssetBySymbol("TWII");
  const taiwanSeries = taiwanAsset ? repository.getSeries(taiwanAsset.symbol) : [];
  const taiwanSnapshot = taiwanSeries.at(-1) ?? null;
  const previousTaiwanSnapshot = taiwanSnapshot ? findPreviousSnapshot(taiwanSeries, taiwanSnapshot.date) : null;
  const taiwanSummary = taiwanSnapshot
    ? {
        compositeDelta: previousTaiwanSnapshot ? taiwanSnapshot.compositeScore - previousTaiwanSnapshot.compositeScore : null,
        compositeScore: taiwanSnapshot.compositeScore,
        date: taiwanSnapshot.date,
        previousDate: previousTaiwanSnapshot?.date ?? null,
        riskDelta: previousTaiwanSnapshot ? taiwanSnapshot.riskScore - previousTaiwanSnapshot.riskScore : null,
        riskScore: taiwanSnapshot.riskScore,
        signalTitle: taiwanSnapshot.signal.title,
        sourceLabel: formatPublicSourceLabel(freshness.sourceName, marketSignalSourceStatus.resolvedSource === "supabase")
      }
    : null;
  const productionMarketCount = taiwanSummary ? 1 : 0;

  return (
    <>
      <PageViewTracker eventName="home_page_viewed" payload={{ locale: "en", page: "home" }} />
      <SeoJsonLd data={homeJsonLd} />
      <HomepageGlobalShell
        locale="en"
        todaySummary={{
          globalComposite: null,
          globalCompositeStatus: "requires_two_or_more_production_markets",
          marketsDecreasingRisk: taiwanSummary?.riskDelta !== null && taiwanSummary?.riskDelta !== undefined && taiwanSummary.riskDelta < 0 ? 1 : 0,
          marketsIncreasingRisk: taiwanSummary?.riskDelta !== null && taiwanSummary?.riskDelta !== undefined && taiwanSummary.riskDelta > 0 ? 1 : 0,
          marketsUpdated: productionMarketCount,
          primaryAvailableMarket: taiwanSummary,
          productionMarketCount,
          scope: "global",
          topChange: taiwanSummary
        }}
      />
    </>
  );
}

function formatPublicSourceLabel(sourceName: string, isOfficialRuntime: boolean) {
  if (!isOfficialRuntime) return "Mock data";
  if (!sourceName || sourceName.toLowerCase().includes("supabase")) return "TWSE OpenAPI";
  return sourceName;
}

function findPreviousSnapshot(series: SignalSnapshot[], date: string) {
  for (let index = series.length - 1; index >= 0; index -= 1) {
    const snapshot = series[index];
    if (snapshot.date < date) return snapshot;
  }
  return null;
}
