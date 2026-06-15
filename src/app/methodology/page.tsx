import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "方法說明",
  description: "了解指數燈號如何整理趨勢、風險、資料品質與下一步觀察。"
};

const methodModules = [
  ["市場狀態", "用紅黃綠燈讓使用者快速判斷目前偏多、觀望、警戒或高風險。", "先看狀態，再看原因。"],
  ["原因", "整理趨勢、廣度、風險與資料品質，不只呈現單一分數。", "避免只看數字誤判。"],
  ["風險提醒", "提醒目前可能的波動、資料延遲與示範資料邊界。", "不提供買賣建議。"],
  ["下一步觀察", "把燈號轉成可執行的閱讀順序，例如觀察、複核、等待。", "幫助使用者建立固定流程。"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>燈號方法不是交易指令，而是市場狀態閱讀流程</h1>
        <p>
          指數燈號把複雜資料拆成狀態、原因、風險提醒與下一步觀察。使用者可以先在 30 秒內看懂市場氛圍，再用 3 分鐘確認是否需要加強觀察。
        </p>
        <p className="runtime-boundary-line">
          目前公開頁維持示範資料與模擬分數；正式每日資料尚未啟用，所有內容皆非投資建議。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicRouteReadingContract context="methodology" />

      <section className="panel method-section">
        <h2>核心閱讀模組</h2>
        <div className="method-table" role="table" aria-label="核心閱讀模組">
          <div className="method-row method-head" role="row">
            <span>模組</span>
            <span>原因</span>
            <span>使用方式</span>
          </div>
          {methodModules.map(([name, purpose, value]) => (
            <div className="method-row" role="row" key={name}>
              <strong>{name}</strong>
              <span>{purpose}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel method-links">
        <h2>繼續閱讀</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "methodology" }}>
          查看風險聲明
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/" label="回到市場總覽" payload={{ area: "methodology" }}>
          回到市場總覽
        </TrackedLink>
      </section>
    </main>
  );
}
