import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "方法說明",
  description: "說明指數燈號如何用趨勢、風險、資料狀態與觀察順序協助使用者理解市場。"
};

const methodModules = [
  ["市場燈號", "把市場狀態整理成偏多、觀望、警戒等可理解狀態。", "協助使用者快速建立第一層判斷。"],
  ["趨勢與強弱", "比較綜合分數與相對強弱，觀察市場或標的是否轉強。", "用來找出值得複核的方向，不是買賣訊號。"],
  ["風險分數", "整理波動、異常與防守訊號，提醒使用者注意下行風險。", "用來決定是否加強觀察或降低風險。"],
  ["資料狀態", "顯示來源、更新時間與示範模式，避免使用者誤判資料可靠度。", "正式資料上線前，所有分數仍需保留邊界提示。"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>燈號是市場判讀框架，不是交易指令</h1>
        <p>
          指數燈號把複雜的市場資訊整理成可閱讀的狀態：先看市場氣氛，再看風險來源，最後進入標的細節複核。
        </p>
        <p className="runtime-boundary-line">目前仍是公開版示範資料，正式資料與正式分數需等資料 gate 通過後才會啟用。</p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicRouteReadingContract context="methodology" />
      <TrustRuntimeBoundaryNotice context="methodology" />

      <section className="panel method-section">
        <h2>核心模組</h2>
        <div className="method-table" role="table" aria-label="核心模組">
          <div className="method-row method-head" role="row">
            <span>模組</span>
            <span>用途</span>
            <span>使用價值</span>
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
