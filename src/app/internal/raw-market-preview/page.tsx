import type { Metadata } from "next";
import { assertInternalDiagnosticsAccess } from "@/lib/internal-diagnostics";
import { buildMixedMarketSnapshot } from "@/lib/mixed-market-adapter";
import { getServerRawMarketOverview } from "@/lib/raw-market-loader";
import { mockMarketSignalRepository } from "@/lib/repositories/mock-market-signal-repository";

type RawMarketPreviewPageProps = {
  searchParams: {
    country?: string;
    exchange?: string;
    symbol?: string;
    token?: string;
  };
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Internal Raw Market Preview"
};

export default async function RawMarketPreviewPage({ searchParams }: RawMarketPreviewPageProps) {
  assertInternalDiagnosticsAccess(searchParams.token);

  const symbol = searchParams.symbol ?? "2330";
  const market = {
    country: searchParams.country ?? "TW",
    exchange: searchParams.exchange ?? "TWSE"
  };
  const overview = await getServerRawMarketOverview(symbol, market);
  const scoreDate = overview.snapshot?.price?.tradeDate ?? "2026-05-28";
  const score = mockMarketSignalRepository.getSnapshot(symbol, scoreDate);
  const mixed = score ? buildMixedMarketSnapshot({ raw: overview.snapshot, score }) : null;

  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">Internal Diagnostics</p>
        <h1>Raw Market Preview</h1>
        <p>
          This page is disabled by default, noindex, and intended only for checking real raw market data beside mock
          model scores.
        </p>
      </section>

      <section className="content-grid">
        <article className="panel">
          <p className="panel-label">Target</p>
          <h2>
            {market.country}/{market.exchange}/{symbol}
          </h2>
          <KeyValue label="Active markets" value={String(overview.activeMarkets.length)} />
          <KeyValue label="Raw data source" value={mixed?.rawDataSource ?? "unavailable"} />
          <KeyValue label="Score source" value={mixed?.scoreSource ?? "unavailable"} />
        </article>

        <article className="panel">
          <p className="panel-label">Warnings</p>
          <h2>Mixed Data State</h2>
          <ul>
            {(mixed?.warnings ?? ["snapshot-unavailable"]).map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <p className="panel-label">Raw Quote</p>
          <h2>{mixed?.stock.name ?? "Unavailable"}</h2>
          <KeyValue label="Symbol" value={mixed?.stock.symbol ?? symbol} />
          <KeyValue label="Trade date" value={mixed?.quote.tradeDate ?? "-"} />
          <KeyValue label="Open" value={formatNullable(mixed?.quote.open)} />
          <KeyValue label="High" value={formatNullable(mixed?.quote.high)} />
          <KeyValue label="Low" value={formatNullable(mixed?.quote.low)} />
          <KeyValue label="Close" value={formatNullable(mixed?.quote.close)} />
          <KeyValue label="Volume" value={formatNullable(mixed?.quote.volume)} />
        </article>

        <article className="panel">
          <p className="panel-label">Mock Score</p>
          <h2>{mixed?.score.signal.title ?? "Unavailable"}</h2>
          <KeyValue label="Model version" value={mixed?.score.modelVersion ?? "-"} />
          <KeyValue label="Health" value={String(mixed?.score.healthScore ?? "-")} />
          <KeyValue label="Risk" value={String(mixed?.score.riskScore ?? "-")} />
          <KeyValue label="Composite" value={String(mixed?.score.compositeScore ?? "-")} />
          <KeyValue label="Data quality" value={mixed ? `${mixed.score.dataQualityGrade} / ${mixed.score.dataQualityScore}` : "-"} />
        </article>
      </section>
    </main>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatNullable(value: number | null | undefined) {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 2 }).format(value);
}
