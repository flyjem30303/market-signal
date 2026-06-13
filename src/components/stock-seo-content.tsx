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
        <p className="eyebrow">標的補充說明</p>
        <h2>
          {asset.symbol} {asset.name} 目前燈號{" "}
          <span style={{ color: signalColor(snapshot.signal.key) }}>{snapshot.signal.title}</span>
        </h2>
        <p>
          本段提供搜尋與長文閱讀所需的背景說明。現在仍以 mock 資料展示燈號、健康分數、風險分數與資料品質，
          不代表正式行情資料已上線。
        </p>
      </article>

      <div className="seo-grid">
        <article className="panel">
          <h2>主要支撐</h2>
          <p>
            目前健康分數最高的模組是 {strongest.name}，分數 {strongest.health}/100。這代表它在 mock 模型中
            對目前燈號有較大支撐，但仍需等待正式資料來源與欄位契約完成。
          </p>
        </article>

        <article className="panel">
          <h2>主要風險</h2>
          <p>
            目前風險分數最高的模組是 {riskiest.name}，分數 {riskiest.risk}/100。若後續風險持續升高，
            使用者應優先查看資料時間與風險來源。
          </p>
        </article>
      </div>

      <article className="panel">
        <h2>近期背景</h2>
        {latestNews ? (
          <p>
            參考事件：{latestNews.title}，來源為 {latestNews.source}，分類為 {latestNews.category}，
            影響分數 {latestNews.impact > 0 ? "+" : ""}
            {latestNews.impact}。這些內容只作為市場脈絡，不是投資建議。
          </p>
        ) : (
          <p>目前沒有可顯示的背景事件。</p>
        )}
      </article>

      <article className="panel">
        <h2>歷史情境</h2>
        <p>
          {orangeBucket
            ? `mock 歷史樣本中，警戒觀察燈號共 ${orangeBucket.count} 筆，20 日平均變化約 ${(orangeBucket.avgReturn * 100).toFixed(1)}%，勝率約 ${(orangeBucket.winRate * 100).toFixed(1)}%，最大回撤約 ${(orangeBucket.maxDrawdown * 100).toFixed(1)}%。`
            : "目前沒有足夠的 mock 歷史樣本可供展示。"}{" "}
          歷史情境只用來說明燈號解讀方式，不保證未來結果。
        </p>
      </article>

      <article className="disclaimer">
        <h2>資料邊界</h2>
        <p>
          本頁仍為公開 Beta 與 mock 資料展示；正式資料、完整覆蓋率與 real score 需要另行通過資料來源、
          回補、驗證與正式升級檢查。內容不構成買進、賣出、持有或個人化投資建議。
        </p>
      </article>
    </section>
  );
}
