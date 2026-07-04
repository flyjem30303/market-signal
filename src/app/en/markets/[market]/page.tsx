import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";

import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { GlobalIndexRouteTemplate } from "@/components/global-index-route-template";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { buildI18nAlternates } from "@/lib/i18n/metadata";
import { SECONDARY_LOCALE } from "@/lib/i18n/config";
import { mockGlobalIndexProvider } from "@/lib/mock-global-index-provider";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import { buildRouteMetadata } from "@/lib/seo";
import type { SignalSnapshot } from "@/lib/signal-model";

export const revalidate = 300;

const mockMarketMap = {
  "hang-seng": {
    internalRegionMetadata: "hk",
    nextSlice: "Phase 2A.33",
    referencePurpose:
      "Hang Seng Index is the third private mock reference route and the first Hong Kong market-index route candidate.",
    symbol: "HSI",
    title: "Hang Seng Index Market Risk Compass"
  },
  nikkei225: {
    internalRegionMetadata: "jp",
    nextSlice: "Phase 2A.28",
    referencePurpose:
      "Nikkei 225 is the second private mock reference route and the first Japan market-index route candidate.",
    symbol: "NIKKEI225",
    title: "Nikkei 225 Market Risk Compass"
  },
  sp500: {
    internalRegionMetadata: "us",
    nextSlice: "Phase 2A.25",
    referencePurpose: "S&P 500 is the first non-Taiwan market-index reference route.",
    symbol: "SP500",
    title: "S&P 500 Market Risk Compass"
  }
} as const;

type PageProps = {
  params: {
    market: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (params.market === "tw") {
    const metadata = buildRouteMetadata({
      description:
        "Taiwan Market Risk Compass with composite score, risk score, recent change, evidence drivers, historical context, and signal history.",
      path: "/en/markets/tw",
      title: "Taiwan Market Risk Compass"
    });

    metadata.alternates = buildI18nAlternates("marketTw", SECONDARY_LOCALE);
    metadata.openGraph = {
      ...metadata.openGraph,
      locale: "en_US",
      url: "/en/markets/tw"
    };

    return metadata;
  }

  return {
    description: "This market route is not publicly available yet.",
    robots: { follow: false, index: false },
    title: "Market route not available"
  };
}

export default async function EnglishMarketDetailPage({ params }: PageProps) {
  if (params.market === "tw") return <EnglishTaiwanMarketPage />;

  notFound();
}

async function EnglishTaiwanMarketPage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime({ historyDays: 260, symbols: ["TWII"] });
  const freshness = await getDataFreshnessSnapshot();
  const marketSeries = repository.getSeries("TWII");
  const market = marketSeries.at(-1);

  if (!market) {
    return (
      <main className="page-shell global-market-detail-page">
        <section className="hero global-detail-hero">
          <p className="eyebrow">Taiwan Market Detail</p>
          <h1>Taiwan Market Risk Compass</h1>
          <p>Production market data is still accumulating.</p>
        </section>
      </main>
    );
  }

  const previous = findPreviousSnapshot(marketSeries, market.date);
  const todayChange = buildEnglishTodayChange(previous, market);
  const historicalContext = buildEnglishHistoricalContext(marketSeries, market);
  const signalHistory = buildEnglishSignalHistory(marketSeries);
  const evidenceDrivers = buildEnglishEvidenceDrivers(market);
  const riskRegime = describeEnglishRiskRegime(market.riskScore);
  const sourceLabel = marketSignalSourceStatus.resolvedSource === "supabase" ? "TWSE OpenAPI" : "mock data";

  return (
    <main className="page-shell global-market-detail-page">
      <PageViewTracker eventName="home_page_viewed" payload={{ locale: "en", market: "tw", page: "en/markets/tw" }} />

      <section className="hero global-detail-hero market-detail-hero" aria-labelledby="en-tw-market-title">
        <div>
          <p className="eyebrow">Taiwan Market Detail</p>
          <h1 id="en-tw-market-title">Taiwan Market Risk Compass</h1>
          <p>
            This page explains why Taiwan is in the current signal state. Read the current state first, then the change,
            evidence drivers, historical context, and signal pattern.
          </p>
        </div>
        <div className="market-detail-metric-grid" aria-label="Taiwan market current state">
          <MetricCard label="Signal" value={translateSignalTitle(market.signal.title)} note={riskRegime.label} />
          <MetricCard label="Composite" value={`${market.compositeScore}/100`} note={formatDelta(previous?.compositeScore, market.compositeScore)} />
          <MetricCard label="Risk" value={`${market.riskScore}/100`} note={riskRegime.label} />
          <MetricCard label="Data date" value={market.date} note={sourceLabel} />
        </div>
      </section>

      <DataFreshnessStrip fallbackAsOfDate={market.date} freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="global-market-section market-detail-change" aria-labelledby="en-tw-market-change-title">
        <div className="global-market-section-head">
          <div>
            <p className="eyebrow">L1 Current + Change</p>
            <h2 id="en-tw-market-change-title">What changed today?</h2>
          </div>
          <span>{todayChange.comparisonDateRange}</span>
        </div>
        <p>{todayChange.summaryText}</p>
        <div className="market-detail-change-grid">
          <MetricCard label="Market direction" value={todayChange.signalDelta} note={todayChange.signalNote} />
          <MetricCard label="Composite change" value={todayChange.compositeDelta} note={todayChange.compositeNote} />
          <MetricCard label="Risk change" value={todayChange.riskDelta} note={todayChange.riskNote} />
        </div>
      </section>

      <section className="panel global-explainable-card" aria-labelledby="en-tw-market-drivers-title">
        <p className="eyebrow">L2 Evidence Drivers</p>
        <h2 id="en-tw-market-drivers-title">Current support and risk</h2>
        <p>Each explanation item must trace to a component, rule, source, and value. Data quality affects confidence, not market reasons.</p>
        <div className="global-explanation-columns">
          <DriverList items={evidenceDrivers.positives} title="Primary support" />
          <DriverList items={evidenceDrivers.negatives} title="Primary risk" />
        </div>
      </section>

      <section className="global-detail-grid" aria-label="Historical context and signal history">
        <article className="panel global-explainable-card">
          <p className="eyebrow">L3 Historical Context</p>
          <h2>What does this score mean?</h2>
          <p>{historicalContext.summary}</p>
          <div className="market-detail-context-grid">
            <MetricCard label="Composite position" value={historicalContext.compositePosition} note={historicalContext.compositeNote} />
            <MetricCard label="Risk position" value={historicalContext.riskPosition} note={historicalContext.riskNote} />
          </div>
        </article>

        <article className="panel global-explainable-card">
          <p className="eyebrow">L3 Signal History</p>
          <h2>Recent signal pattern</h2>
          <p>{signalHistory.summary}</p>
          <div className="market-detail-signal-strip" aria-label="Recent signal dots">
            {signalHistory.items.map((snapshot) => (
              <span
                className={`market-detail-signal-dot ${getSignalToneClass(snapshot)}`}
                key={`${snapshot.date}-${snapshot.signal.title}`}
                title={`${snapshot.date}: ${translateSignalTitle(snapshot.signal.title)}, composite ${snapshot.compositeScore}, risk ${snapshot.riskScore}`}
              />
            ))}
          </div>
          <p className="market-detail-history-summary">{signalHistory.detail}</p>
        </article>
      </section>

      <section className="panel global-explainable-card market-detail-next" aria-labelledby="en-tw-market-next-title">
        <p className="eyebrow">Next Observation</p>
        <h2 id="en-tw-market-next-title">What should be observed next?</h2>
        <p>{buildEnglishNextObservation(market)}</p>
        <nav className="market-detail-link-row" aria-label="Taiwan market next reading">
          <TrackedLink eventName="nav_link_clicked" href="/en/weekly" label="Weekly" payload={{ area: "en-markets-tw-next" }}>
            Read weekly context
          </TrackedLink>
          <TrackedLink eventName="nav_link_clicked" href="/en/stocks/TWII" label="TWII target" payload={{ area: "en-markets-tw-next" }}>
            Open TWII target
          </TrackedLink>
          <TrackedLink eventName="nav_link_clicked" href="/en/methodology" label="Methodology" payload={{ area: "en-markets-tw-next" }}>
            View methodology
          </TrackedLink>
        </nav>
      </section>

      <details className="market-detail-notes">
        <summary>
          <span>
            <span className="eyebrow">Methodology Notes</span>
            <strong>What is not included yet?</strong>
          </span>
          <span className="market-detail-notes-summary">Breadth inactive · Confidence Medium</span>
        </summary>
        <ul>
          <li>
            <strong>Market Breadth</strong>
            <span>Waiting for a validated data source; not counted as support or drag.</span>
          </li>
          <li>
            <strong>Confidence</strong>
            <span>Medium; the current Phase 1 production runtime remains active.</span>
          </li>
          <li>
            <strong>Market Explain Snapshot</strong>
            <span>Market Explain Snapshot remains report-only and has not replaced production scoring; validation remains not statistically validated.</span>
          </li>
        </ul>
        <TrackedLink eventName="nav_link_clicked" href="/en/methodology" label="Methodology" payload={{ area: "en-markets-tw-notes" }}>
          Signal Framework v1 · TWSE OpenAPI · View methodology
        </TrackedLink>
      </details>
    </main>
  );
}

function MetricCard({ label, note, value }: { label: string; note: string; value: string }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

function DriverList({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <h3>{title}</h3>
      <ol className="market-detail-factor-list">
        {items.slice(0, 3).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  );
}

function findPreviousSnapshot(series: SignalSnapshot[], date: string) {
  for (let index = series.length - 1; index >= 0; index -= 1) {
    const snapshot = series[index];
    if (snapshot.date < date) return snapshot;
  }
  return null;
}

function buildEnglishTodayChange(previous: SignalSnapshot | null, current: SignalSnapshot) {
  if (!previous) {
    return {
      comparisonDateRange: "No previous snapshot",
      compositeDelta: `${current.compositeScore}`,
      compositeNote: "No previous point is available for comparison.",
      riskDelta: `${current.riskScore}`,
      riskNote: "Risk comparison is still accumulating.",
      signalDelta: translateSignalTitle(current.signal.title),
      signalNote: "Signal persistence is not available yet.",
      summaryText: `Taiwan is currently ${translateSignalTitle(current.signal.title)}. Change comparison is still accumulating.`
    };
  }

  const compositeDelta = current.compositeScore - previous.compositeScore;
  const riskDelta = current.riskScore - previous.riskScore;
  const signalChanged = previous.signal.title !== current.signal.title;

  return {
    comparisonDateRange: `${previous.date} -> ${current.date}`,
    compositeDelta: `${previous.compositeScore} -> ${current.compositeScore} (${formatSigned(compositeDelta)})`,
    compositeNote: describeEnglishCompositeDelta(compositeDelta),
    riskDelta: `${previous.riskScore} -> ${current.riskScore} (${formatSigned(riskDelta)})`,
    riskNote: describeEnglishRiskDelta(riskDelta),
    signalDelta: signalChanged
      ? `${translateSignalTitle(previous.signal.title)} -> ${translateSignalTitle(current.signal.title)}`
      : `${translateSignalTitle(current.signal.title)} (continued)`,
    signalNote: signalChanged ? "Signal state changed from the previous snapshot." : "Signal state remained unchanged.",
    summaryText: `Taiwan remained ${translateSignalTitle(current.signal.title)}. Composite changed by ${formatSigned(
      compositeDelta,
    )}, while risk changed by ${formatSigned(riskDelta)}.`
  };
}

function buildEnglishEvidenceDrivers(snapshot: SignalSnapshot) {
  const marketModules = snapshot.modules.filter((module) => !["quality", "dataQuality", "dataFreshness", "breadth"].includes(module.id));
  const positives = marketModules
    .slice()
    .sort((left, right) => right.health + Math.max(0, 45 - right.risk) - (left.health + Math.max(0, 45 - left.risk)))
    .slice(0, 3)
    .map((module) => `${displayModuleName(module)}: health ${module.health}, risk ${module.risk}. Source: modules.${module.id}.`);
  const negatives = marketModules
    .slice()
    .sort((left, right) => 100 - right.health + right.risk - (100 - left.health + left.risk))
    .slice(0, 3)
    .map((module) => `${displayModuleName(module)}: health ${module.health}, risk ${module.risk}. Source: modules.${module.id}.`);

  return { negatives, positives };
}

function buildEnglishHistoricalContext(series: SignalSnapshot[], current: SignalSnapshot) {
  const samples = series.filter((snapshot) => snapshot.date <= current.date).slice(-252);
  if (samples.length < 30) {
    return {
      compositeNote: `Only ${samples.length} usable samples are available.`,
      compositePosition: "Sample limited",
      riskNote: "Risk context will be shown after more samples accumulate.",
      riskPosition: "Sample limited",
      summary: "Historical context is still accumulating."
    };
  }

  const compositeAverage = average(samples.map((snapshot) => snapshot.compositeScore));
  const riskAverage = average(samples.map((snapshot) => snapshot.riskScore));
  const compositePercentile = Math.round((samples.filter((snapshot) => snapshot.compositeScore <= current.compositeScore).length / samples.length) * 100);
  const riskPercentile = Math.round((samples.filter((snapshot) => snapshot.riskScore <= current.riskScore).length / samples.length) * 100);

  return {
    compositeNote: `Higher than ${compositePercentile}% of available historical samples; average ${compositeAverage}.`,
    compositePosition: describeEnglishHistoricalBand(compositePercentile),
    riskNote: `Higher than ${riskPercentile}% of available historical samples; average ${riskAverage}.`,
    riskPosition: describeEnglishHistoricalBand(riskPercentile),
    summary: `Based on ${samples.length} available samples, composite is in the ${describeEnglishHistoricalBand(
      compositePercentile,
    )}, while risk is in the ${describeEnglishHistoricalBand(riskPercentile)}. This is historical context, not a forecast.`
  };
}

function buildEnglishSignalHistory(series: SignalSnapshot[]) {
  const items = series.slice(-30);
  if (items.length === 0) {
    return { detail: "No signal history is available yet.", items, summary: "Signal history is still accumulating." };
  }

  const latest = items[items.length - 1];
  if (items.length === 1) {
    return {
      detail: `Only one snapshot is available: ${latest.date}.`,
      items,
      summary: `Latest signal is ${translateSignalTitle(latest.signal.title)}. Persistence is not available yet.`
    };
  }

  const weakOrRiskCount = items.filter((snapshot) => ["is-weak", "is-risk"].includes(getSignalToneClass(snapshot))).length;
  const first = items[0];
  return {
    detail: `${first.date} -> ${latest.date}, ${items.length} snapshots; ${weakOrRiskCount} snapshots were weak or higher risk.`,
    items,
    summary: `Latest signal is ${translateSignalTitle(latest.signal.title)}. Use the recent pattern to judge persistence.`
  };
}

function buildEnglishNextObservation(current: SignalSnapshot) {
  if (current.riskScore >= 45) return "Next update should check whether risk continues to rise. This is risk observation, not trading advice.";
  if (current.compositeScore >= 62) return "Next update should check whether composite strength holds while risk remains contained.";
  return "Next update should check whether trend or momentum improves enough to move the market out of the middle zone.";
}

function formatDelta(previous: number | undefined, current: number) {
  if (previous === undefined) return "No previous snapshot";
  return `${formatSigned(current - previous)} vs previous`;
}

function describeEnglishCompositeDelta(delta: number) {
  if (delta > 0) return "Market health improved, but risk should still be checked.";
  if (delta < 0) return "Market health weakened; inspect trend, momentum, or stability drivers.";
  return "Composite was unchanged.";
}

function describeEnglishRiskDelta(delta: number) {
  if (delta > 0) return "Risk increased; watch whether volatility spreads.";
  if (delta < 0) return "Risk eased from the previous snapshot.";
  return "Risk was unchanged.";
}

function describeEnglishRiskRegime(riskScore: number) {
  if (riskScore >= 60) return { label: "High risk" };
  if (riskScore >= 45) return { label: "Risk warming" };
  return { label: "Contained risk" };
}

function translateSignalTitle(signalTitle?: string) {
  if (!signalTitle) return "Data accumulating";
  if (signalTitle.includes("偏強")) return "Constructive";
  if (signalTitle.includes("觀望")) return "Watch";
  if (signalTitle.includes("警戒")) return "Caution";
  if (signalTitle.includes("高風險")) return "High risk";
  if (signalTitle.includes("轉弱")) return "Weakening";
  return "Watch";
}

function displayModuleName(module: { id: string; label?: string; name?: string }) {
  return module.label ?? module.name ?? module.id;
}

function describeEnglishHistoricalBand(percentile: number) {
  if (percentile <= 40) return "lower range";
  if (percentile >= 66) return "higher range";
  return "middle range";
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function getSignalToneClass(snapshot: SignalSnapshot) {
  if (snapshot.riskScore >= 60 || snapshot.compositeScore < 34) return "is-risk";
  if (snapshot.riskScore >= 45 || snapshot.compositeScore < 48) return "is-weak";
  if (snapshot.compositeScore >= 62 && snapshot.riskScore < 45) return "is-strong";
  return "is-neutral";
}

function formatSigned(value: number) {
  return `${value >= 0 ? "+" : ""}${value}`;
}
