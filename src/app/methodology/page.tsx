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
  description: "說明指數燈號如何把市場資料整理成燈號、分數、風險提示與資料狀態。"
};

const methodModules = [
  [
    "市場燈號",
    "把市場狀態整理成偏多、觀望、警戒或高風險等易讀狀態。",
    "讓使用者先知道目前市場氛圍，而不是直接陷入大量數字。"
  ],
  [
    "市場分數",
    "用 0 到 100 的分數呈現趨勢、動能與風險的綜合狀態。",
    "分數越高代表狀態越強，但仍需搭配風險分數與資料狀態一起看。"
  ],
  [
    "風險分數",
    "整理波動、回檔、資料異常與市場壓力訊號。",
    "風險分數越高，越應降低單一訊號判斷，改以觀察與複核為主。"
  ],
  [
    "資料狀態",
    "標示資料來源、更新時間、覆蓋率與目前是否仍為示範資料。",
    "若資料尚未驗證或覆蓋不足，前台不會宣稱真實資料已上線。"
  ]
] as const;

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">燈號方法</p>
        <h1>燈號先回答市場狀態，再提醒風險與資料邊界</h1>
        <p>
          指數燈號不是把指標堆在一起，而是把市場資訊整理成「現在狀態、主要原因、下一步觀察」。
          目標是讓一般投資者能用 30 秒看懂狀態，再用 3 分鐘確認原因、風險與資料狀態。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料驗證產品流程；真實資料上線前，仍需通過來源權利、資料品質與切換門檻。
        </p>
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
            <span>使用者價值</span>
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
        <h2>相關閱讀</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看免責聲明" payload={{ area: "methodology" }}>
          查看免責聲明
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/" label="回到市場總覽" payload={{ area: "methodology" }}>
          回到市場總覽
        </TrackedLink>
      </section>
    </main>
  );
}
