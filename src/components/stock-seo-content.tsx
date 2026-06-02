import type { Asset } from "@/lib/assets";
import type { BacktestBucket, NewsEvent, SignalSnapshot } from "@/lib/signal-model";
import { signalColor } from "@/lib/signal-model";

type StockSeoContentProps = {
  asset: Asset;
  backtestBuckets: BacktestBucket[];
  news: NewsEvent[];
  snapshot: SignalSnapshot;
};

export function StockSeoContent({ asset, backtestBuckets, news, snapshot }: StockSeoContentProps) {
  const strongest = snapshot.modules.slice().sort((a, b) => b.health - a.health)[0];
  const riskiest = snapshot.modules.slice().sort((a, b) => b.risk - a.risk)[0];
  const orangeBucket = backtestBuckets.find((bucket) => bucket.signal.key === "orange");
  const latestNews = news[0];

  return (
    <section className="seo-content">
      <article className="panel">
        <p className="eyebrow">Stock Signal Summary</p>
        <h2>
          {asset.symbol} {asset.name} mock signal:{" "}
          <span style={{ color: signalColor(snapshot.signal.key) }}>{snapshot.signal.title}</span>
        </h2>
        <p>
          This page is a mock-only runtime view. The health score, pullback-risk score, and composite score are useful
          for checking product flow and decision hierarchy, but they are not real market-data evidence and must not be
          treated as investment advice.
        </p>
      </article>

      <div className="seo-grid">
        <article className="panel">
          <h2>What currently looks strongest</h2>
          <p>
            The strongest mock module is {strongest.name} with health {strongest.health}/100. Use this as a product
            explanation cue only; source-depth, data quality, and model evidence still need separate accepted gates.
          </p>
        </article>

        <article className="panel">
          <h2>What currently needs caution</h2>
          <p>
            The highest mock risk module is {riskiest.name} with risk {riskiest.risk}/100. This can guide what the UI
            should explain next, but it does not approve real score-source mode or Supabase-backed public data.
          </p>
        </article>
      </div>

      <article className="panel">
        <h2>Latest mock news context</h2>
        {latestNews ? (
          <p>
            Latest mock news item: {latestNews.title} from {latestNews.source}. Category {latestNews.category}; impact{" "}
            {latestNews.impact > 0 ? "+" : ""}
            {latestNews.impact}. This is shown as product context only and should not be read as verified market news.
          </p>
        ) : (
          <p>No mock news item is available for this stock in the current local dataset.</p>
        )}
      </article>

      <article className="panel">
        <h2>Backtest context</h2>
        <p>
          {orangeBucket
            ? `The local backtest sample for orange signals contains ${orangeBucket.count} events, with average 20-day return ${(
                orangeBucket.avgReturn * 100
              ).toFixed(1)}%, win rate ${(orangeBucket.winRate * 100).toFixed(1)}%, and max drawdown ${(
                orangeBucket.maxDrawdown * 100
              ).toFixed(1)}%.`
            : "No orange-signal local backtest sample is available for this stock."}{" "}
          These figures remain mock/local evidence and cannot support public real-score claims.
        </p>
      </article>

      <article className="disclaimer">
        <h2>Reading boundary</h2>
        <p>
          Public data source remains mock, score source remains mock, and real score-source mode is blocked. Real market data,
          SQL-backed scoring, Supabase writes, and investment recommendations require later accepted gates.
        </p>
      </article>
    </section>
  );
}
