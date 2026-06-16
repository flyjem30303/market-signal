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
        <p className="eyebrow">標的公開摘要</p>
        <h2>
          {asset.symbol} {asset.name} 目前燈號{" "}
          <span style={{ color: signalColor(snapshot.signal.key) }}>{snapshot.signal.title}</span>
        </h2>
        <p>
          本段使用示範資料說明標的頁如何呈現市場狀態、風險來源與資料限制。內容不是投資建議。
        </p>
      </article>

      <div className="seo-grid">
        <article className="panel">
          <h2>相對強項</h2>
          <p>
            目前健康度較高的模組是 {strongest.name}，分數為 {strongest.health}/100。正式資料上線後，這裡會用來解釋燈號背後原因。
          </p>
        </article>

        <article className="panel">
          <h2>主要風險</h2>
          <p>
            目前風險較高的模組是 {riskiest.name}，風險為 {riskiest.risk}/100。分數越高，越需要確認資料更新時間與市場背景。
          </p>
        </article>
      </div>

      <article className="panel">
        <h2>相關觀察</h2>
        {latestNews ? (
          <p>
            示範觀察：{latestNews.title}。來源為 {latestNews.source}，分類為 {latestNews.category}，影響值為 {latestNews.impact > 0 ? "+" : ""}
            {latestNews.impact}。這是示範內容，不代表即時新聞。
          </p>
        ) : (
          <p>目前沒有相關示範觀察。</p>
        )}
      </article>

      <article className="panel">
        <h2>示範回測區間</h2>
        <p>
          {orangeBucket
            ? `示範資料中，觀望燈號樣本數為 ${orangeBucket.count}，平均表現 ${orangeBucket.avgReturn.toFixed(1)}%，勝率 ${orangeBucket.winRate.toFixed(1)}%，最大回撤 ${orangeBucket.maxDrawdown.toFixed(1)}%。`
            : "目前沒有觀望燈號的示範回測資料。"}{" "}
          這些數字只用於頁面呈現測試，不代表真實績效。
        </p>
      </article>

      <article className="disclaimer">
        <h2>資料說明</h2>
        <p>目前為公開 Beta 示範資料，不提供投資建議，也不代表真實市場資料。</p>
      </article>
    </section>
  );
}
