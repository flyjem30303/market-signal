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
        <p className="eyebrow">標的狀態說明</p>
        <h2>
          {asset.symbol} {asset.name} 目前燈號{" "}
          <span style={{ color: signalColor(snapshot.signal.key) }}>{snapshot.signal.title}</span>
        </h2>
        <p>
          本區塊用示範資料整理標的狀態、核心分數與風險提示。正式市場資料尚未啟用，內容僅供資訊整理，不提供個股買賣建議。
        </p>
      </article>

      <div className="seo-grid">
        <article className="panel">
          <h2>主要支撐因素</h2>
          <p>
            目前較強的模組是 {strongest.name}，健康分數為 {strongest.health}/100。使用者應搭配資料狀態與更新時間一起閱讀。
          </p>
        </article>

        <article className="panel">
          <h2>主要風險因素</h2>
          <p>
            目前較需要複核的模組是 {riskiest.name}，風險分數為 {riskiest.risk}/100。風險偏高時，先觀察成因，不急著做方向判斷。
          </p>
        </article>
      </div>

      <article className="panel">
        <h2>相關事件</h2>
        {latestNews ? (
          <p>
            示範事件：{latestNews.title}。來源為 {latestNews.source}，分類為 {latestNews.category}，影響分數為 {latestNews.impact > 0 ? "+" : ""}
            {latestNews.impact}。這是示範關聯，不代表正式新聞資料。
          </p>
        ) : (
          <p>目前沒有可顯示的示範事件。</p>
        )}
      </article>

      <article className="panel">
        <h2>歷史示範回看</h2>
        <p>
          {orangeBucket
            ? `示範回看中，觀望燈號樣本數為 ${orangeBucket.count}，平均報酬 ${orangeBucket.avgReturn.toFixed(1)}%，勝率 ${orangeBucket.winRate.toFixed(1)}%，最大回撤 ${orangeBucket.maxDrawdown.toFixed(1)}%。`
            : "目前沒有足夠的示範回看資料。"}{" "}
          回看資料只用來說明產品方向，不是績效承諾。
        </p>
      </article>

      <article className="disclaimer">
        <h2>資料邊界</h2>
        <p>本頁仍為公開 Beta 示範資料，不宣稱即時行情、不提供個股買賣建議，也不保證任何投資結果。</p>
      </article>
    </section>
  );
}
