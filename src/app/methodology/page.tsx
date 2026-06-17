import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicRouteReadingContract } from "@/components/public-route-reading-contract";
import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "方法說明",
  description: "說明指數燈號如何把市場資料整理成可閱讀、可追蹤的風險狀態。"
};

const methodModules = [
  ["市場燈號", "把趨勢、風險與資料狀態整理成紅黃綠狀態。", "協助使用者先建立閱讀順序。"],
  ["綜合分數", "呈現市場狀態的示範分數。", "不是預測，也不是投資建議。"],
  ["風險分數", "提示市場或標的是否需要加強觀察。", "分數越高，越應回看原因與資料時間。"],
  ["資料狀態", "標示資料來源、更新時間與 mock/real 邊界。", "正式資料 promotion 前必須清楚揭露。"]
] as const;

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>用燈號降低市場資訊理解門檻</h1>
        <p>指數燈號不是把複雜資料堆給使用者，而是把狀態、原因、更新時間與下一步觀察整理成固定閱讀流程。</p>
        <p className="runtime-boundary-line">公開 Beta 目前使用示範資料；正式資料升級尚未開放。</p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicRouteReadingContract context="methodology" />
      <RouteLocalTrustCopyPanel context="methodology" />
      <TrustRuntimeBoundaryNotice context="methodology" />

      <section className="panel method-section">
        <h2>核心模組</h2>
        <div className="method-table" role="table" aria-label="判讀模組">
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
        <h2>相關頁面</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="查看風險聲明" payload={{ area: "methodology" }}>
          查看風險聲明
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/" label="回市場總覽" payload={{ area: "methodology" }}>
          回市場總覽
        </TrackedLink>
      </section>
    </main>
  );
}
