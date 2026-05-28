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
  const hasOrangeSample = Boolean(orangeBucket && orangeBucket.count > 0);
  const orangeSummary =
    hasOrangeSample && orangeBucket
      ? `橘燈樣本共有 ${orangeBucket.count} 天，其後 20 日平均報酬為 ${(
          orangeBucket.avgReturn * 100
        ).toFixed(1)}%，勝率為 ${(orangeBucket.winRate * 100).toFixed(1)}%，樣本最大回檔為 ${(
          orangeBucket.maxDrawdown * 100
        ).toFixed(1)}%。`
      : "目前橘燈樣本不足，暫時不做統計判讀。";
  const latestNews = news[0];

  return (
    <section className="seo-content">
      <article className="panel">
        <p className="eyebrow">Stock Signal Summary</p>
        <h2>
          {asset.symbol} {asset.name} 今日燈號：{" "}
          <span style={{ color: signalColor(snapshot.signal.key) }}>{snapshot.signal.title}</span>
        </h2>
        <p>
          {asset.symbol} {asset.name} 目前多頭健康度為 {snapshot.healthScore}/100，回檔風險度為{" "}
          {snapshot.riskScore}/100，綜合分數為 {snapshot.compositeScore}/100。這個分數用來觀察目前趨勢是否仍健康、
          估值與籌碼是否偏熱，以及投資人是否需要降低追高速度。
        </p>
      </article>

      <div className="seo-grid">
        <article className="panel">
          <h2>多頭健康度解讀</h2>
          <p>
            從六大模組來看，{asset.symbol} 目前最強的支撐來自「{strongest.name}」，分數為{" "}
            {strongest.health}/100。若健康度維持在高位，代表價格趨勢、獲利基本面、族群擴散或產業上游仍有支撐；
            但若健康度開始下滑，就要留意是否從強勢整理轉為趨勢鈍化。
          </p>
        </article>

        <article className="panel">
          <h2>回檔風險度解讀</h2>
          <p>
            目前最大壓力來自「{riskiest.name}」，風險分數為 {riskiest.risk}/100。風險分數偏高不代表一定會下跌，
            但代表這檔標的可能已經累積估值、籌碼、集中度或宏觀壓力。對長期投資人來說，這通常代表加碼節奏要比平常更保守。
          </p>
        </article>
      </div>

      <article className="panel">
        <h2>新聞信心評論</h2>
        {latestNews ? (
          <p>
            最近相關事件是「{latestNews.title}」，來源為 {latestNews.source}。此事件分類為
            「{latestNews.category}」，信心影響分數為 {latestNews.impact > 0 ? "+" : ""}
            {latestNews.impact}。若新聞屬於基本面正向，通常有助於提高獲利續航信心；若屬於估值、籌碼或宏觀負向，
            則應視為追價風險升高的提醒。
          </p>
        ) : (
          <p>目前沒有可用的近期新聞事件。正式版本會接入新聞資料庫與週報摘要，補強投資信心評論。</p>
        )}
      </article>

      <article className="panel">
        <h2>回測摘要</h2>
        <p>
          在目前模型資料中，橘燈代表回檔風險升高。{orangeSummary}
          這些數字不是買賣訊號，而是幫助投資人理解不同燈號下的歷史風險環境。
        </p>
      </article>

      <article className="disclaimer">
        <h2>投資免責聲明</h2>
        <p>
          本頁內容為研究模型與資訊整理，不構成投資建議、買賣推薦或收益保證。股票與 ETF 投資皆有風險，
          實際決策仍應考量個人財務狀況、風險承受度與投資目標。
        </p>
      </article>
    </section>
  );
}
