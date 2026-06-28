import type { Route } from "next";
import Link from "next/link";

import {
  globalActiveProvider,
  globalPublicDataSource,
  type GlobalIndexSeriesPoint,
  type GlobalIndexSnapshot
} from "@/lib/global-index-provider";

type GlobalIndexRouteTemplateProps = {
  backHref: Route;
  backLabel: string;
  indexSlug: string;
  internalRegionMetadata: string;
  nextSlice: string;
  referencePurpose: string;
  series: readonly GlobalIndexSeriesPoint[];
  snapshot: GlobalIndexSnapshot;
};

export function GlobalIndexRouteTemplate({
  backHref,
  backLabel,
  indexSlug,
  internalRegionMetadata,
  nextSlice,
  referencePurpose,
  series,
  snapshot
}: GlobalIndexRouteTemplateProps) {
  const previous = series.at(-2);
  const latest = series.at(-1);
  const closeDelta = previous && latest ? latest.close - previous.close : null;
  const routePath = `/markets/${indexSlug}`;

  return (
    <main className="page-shell global-market-detail-page">
      <section className="hero global-detail-hero market-detail-hero" aria-labelledby={`${indexSlug}-market-title`}>
        <div>
          <p className="eyebrow">Phase 2A private mock reference</p>
          <h1 id={`${indexSlug}-market-title`}>{snapshot.displayName} Market Risk Compass</h1>
          <p>
            {referencePurpose} This private mock route validates the reusable market-detail route template before any
            vendor-backed data, public navigation, sitemap exposure, or SEO indexing is opened.
          </p>
        </div>
        <div className="market-detail-metric-grid" aria-label={`${snapshot.displayName} mock market status`}>
          <MetricCard label="Signal" note="Mock-only state" value={snapshot.signalState} />
          <MetricCard label="Composite" note="Synthetic score" value={`${snapshot.compositeScore}/100`} />
          <MetricCard label="Risk" note="Synthetic score" value={`${snapshot.riskScore}/100`} />
          <MetricCard label="Data date" note="Private preview" value={snapshot.tradeDate} />
        </div>
      </section>

      <section className="panel freshness-strip mock">
        <strong>Mock-only private boundary</strong>
        <span className="freshness-description">
          globalPublicDataSource={globalPublicDataSource}; globalActiveProvider={globalActiveProvider}. 這是 private
          mock route，不是正式全球市場資料；不進導覽列、不進 sitemap、不做 SEO exposure。
        </span>
      </section>

      <section className="global-market-section market-detail-change" aria-labelledby={`${indexSlug}-change-title`}>
        <div className="global-market-section-head">
          <div>
            <p className="eyebrow">What Changed</p>
            <h2 id={`${indexSlug}-change-title`}>變化摘要</h2>
          </div>
          <span>{previous && latest ? `${previous.tradeDate} to ${latest.tradeDate}` : "mock sample accumulating"}</span>
        </div>
        <div className="market-detail-change-grid">
          <MetricCard label="Close" note={formatCloseDelta(closeDelta)} value={snapshot.close.toLocaleString("en-US")} />
          <MetricCard
            label="Daily change"
            note="Synthetic point"
            value={`${formatSigned(snapshot.change)} / ${snapshot.changePercent.toFixed(2)}%`}
          />
          <MetricCard label="Route identity" note="Index slug, not country route" value={routePath} />
        </div>
      </section>

      <section className="panel global-explainable-card" aria-labelledby={`${indexSlug}-evidence-title`}>
        <p className="eyebrow">Evidence Drivers</p>
        <h2 id={`${indexSlug}-evidence-title`}>證據來源</h2>
        <p>{snapshot.scoreSource}</p>
        <div className="global-explanation-columns">
          <DriverList items={snapshot.scoreDrivers} title="主要支撐" />
          <DriverList items={snapshot.riskDrivers} title="主要風險" />
        </div>
      </section>

      <section className="global-detail-grid" aria-label={`${snapshot.displayName} template readiness`}>
        <article className="panel global-explainable-card">
          <p className="eyebrow">Template Readiness</p>
          <h2>模板健康度</h2>
          <p>
            This page reuses the same market-detail contract for header, signal summary, change panel, evidence drivers,
            synthetic series preview, and confidence boundary. Route-specific code should only provide the index slug,
            internal region metadata, mock snapshot, and mock series.
          </p>
        </article>

        <article className="panel global-explainable-card">
          <p className="eyebrow">Private Boundary</p>
          <h2>公開邊界</h2>
          <p>
            This reference page is for PM/CEO private review only. It must remain out of navigation, sitemap, hreflang,
            GSC, and SEO exposure until vendor/source-rights, methodology, and runtime gates are approved.
          </p>
        </article>
      </section>

      <section className="panel">
        <p className="panel-label">Synthetic series preview</p>
        <div className="stock-score-bars">
          {series.map((point) => (
            <span key={point.tradeDate}>
              {point.tradeDate} close {point.close.toLocaleString("en-US")}
              <b style={{ width: `${Math.min(100, Math.max(12, Math.abs(point.changePercent) * 100))}%` }} />
            </span>
          ))}
        </div>
      </section>

      <section className="panel freshness-strip mock">
        <strong>Next gate</strong>
        <span className="freshness-description">
          {nextSlice} should decide whether to clean up this private route pair further or select the next reference
          index. internalRegionMetadata={internalRegionMetadata} remains metadata only; route identity remains index slug first.
        </span>
        <Link href={backHref}>{backLabel}</Link>
      </section>
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

function DriverList({ items, title }: { items: readonly string[]; title: string }) {
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {items.slice(0, 3).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function formatCloseDelta(delta: number | null) {
  if (delta === null) return "Need more mock points";
  if (delta > 0) return `Close improved by ${delta.toLocaleString("en-US")}`;
  if (delta < 0) return `Close fell by ${Math.abs(delta).toLocaleString("en-US")}`;
  return "Close unchanged";
}

function formatSigned(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toLocaleString("en-US")}`;
}
