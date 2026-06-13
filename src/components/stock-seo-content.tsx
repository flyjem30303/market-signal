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
        <p className="eyebrow">標的訊號摘要</p>
        <h2>
          {asset.symbol} {asset.name} 目前燈號：{" "}
          <span style={{ color: signalColor(snapshot.signal.key) }}>{snapshot.signal.title}</span>
        </h2>
        <p>
          這一頁目前用示範資料呈現健康分數、回檔風險與綜合燈號，目的是讓使用者看懂判讀順序；正式市場資料、
          完整覆蓋與投資建議都尚未啟用。
        </p>
      </article>

      <div className="seo-grid">
        <article className="panel">
          <h2>目前相對支撐</h2>
          <p>
            示範模組中最強的是 {strongest.name}，健康分數 {strongest.health}/100。這可作為頁面解釋方向，
            但仍需資料來源、品質與模型條件完成後才能升級為正式判讀。
          </p>
        </article>

        <article className="panel">
          <h2>目前需要留意</h2>
          <p>
            示範模組中風險最高的是 {riskiest.name}，風險分數 {riskiest.risk}/100。使用者可以把它當成觀察提示，
            但不能當成正式買賣訊號。
          </p>
        </article>
      </div>

      <article className="panel">
        <h2>最新情境提示</h2>
        {latestNews ? (
          <p>
            示範情境：{latestNews.title}，來源標籤為 {latestNews.source}。分類 {latestNews.category}；
            影響值 {latestNews.impact > 0 ? "+" : ""}
            {latestNews.impact}。這只用於產品情境展示，不代表已驗證新聞資料。
          </p>
        ) : (
          <p>目前本地資料集中沒有可顯示的情境提示。</p>
        )}
      </article>

      <article className="panel">
        <h2>回看樣本脈絡</h2>
        <p>
          {orangeBucket
            ? `本地示範樣本中，橘燈共有 ${orangeBucket.count} 次，20 日平均報酬 ${(
                orangeBucket.avgReturn * 100
              ).toFixed(1)}%，勝率 ${(orangeBucket.winRate * 100).toFixed(1)}%，最大回撤 ${(
                orangeBucket.maxDrawdown * 100
              ).toFixed(1)}%。`
            : "目前沒有橘燈示範樣本可顯示。"}{" "}
          這些數字只用於理解頁面設計與風險語氣，不能支撐正式績效宣稱。
        </p>
      </article>

      <article className="disclaimer">
        <h2>閱讀邊界</h2>
        <p>
          公開資料來源與分數來源仍維持示範狀態。正式市場資料、資料庫寫入、正式模型分數與投資建議，
          都必須等後續資料來源、覆蓋率、品質與法務揭露條件通過後才會開啟。
        </p>
      </article>
    </section>
  );
}
