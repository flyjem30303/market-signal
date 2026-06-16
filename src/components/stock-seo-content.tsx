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
          {asset.symbol} {asset.name} 目前燈號是{" "}
          <span style={{ color: signalColor(snapshot.signal.key) }}>{snapshot.signal.title}</span>
        </h2>
        <p>本段使用示範資料說明標的頁如何呈現市場狀態、風險來源與資料限制。內容不是投資建議。</p>
      </article>

      <div className="seo-grid">
        <article className="panel">
          <h2>主要支撐</h2>
          <p>
            目前相對健康的模組是 {strongest.name}，健康分數 {strongest.health}/100。使用者可先確認這個優勢是否仍存在。
          </p>
        </article>

        <article className="panel">
          <h2>主要風險</h2>
          <p>
            目前較需要留意的模組是 {riskiest.name}，風險分數 {riskiest.risk}/100。請搭配資料時間與市場背景一起判斷。
          </p>
        </article>
      </div>

      <article className="panel">
        <h2>市場事件觀察</h2>
        {latestNews ? (
          <p>
            {latestNews.title}。來源標記為 {latestNews.source}，分類為 {latestNews.category}。這是示範內容，不代表即時新聞，也不納入燈號分數。
          </p>
        ) : (
          <p>目前沒有示範市場事件。公開免費版不把新聞當成硬性評分指標。</p>
        )}
      </article>

      <article className="panel">
        <h2>回測限制</h2>
        <p>
          {orangeBucket
            ? `示範回測樣本數 ${orangeBucket.count}，平均報酬 ${orangeBucket.avgReturn.toFixed(1)}%，勝率 ${orangeBucket.winRate.toFixed(1)}%，最大回撤 ${orangeBucket.maxDrawdown.toFixed(1)}%。`
            : "目前沒有足夠的示範回測資料。"}{" "}
          這些數字只用來說明版面與解讀方式，不代表未來績效。
        </p>
      </article>

      <article className="disclaimer">
        <h2>資料聲明</h2>
        <p>目前使用示範資料，不是即時報價、不提供買賣建議，也不保證任何投資結果。</p>
      </article>
    </section>
  );
}
