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
  description: "說明指數燈號如何整理市場狀態、風險分數與資料品質。目前使用示範資料，不提供投資建議。"
};

const methodModules = [
  ["市場燈號", "把市場狀態分成偏多、觀望、警戒等可理解層級。", "幫助使用者先建立方向感。"],
  ["綜合分數", "整合趨勢、資料品質、估值壓力、市場廣度、資金與總體風險。", "用於排序觀察，不是交易指令。"],
  ["風險分數", "提醒波動、壓力與市場分歧是否升高。", "分數越高，越需要先確認風險來源。"],
  ["資料狀態", "標示資料來源、更新時間與是否仍為示範資料。", "資料不完整時，前台應降低承諾並提示使用者。"]
] as const;

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>燈號幫你建立觀察順序，不替你做投資決策</h1>
        <p>指數燈號把市場資料整理成狀態、原因與風險提示，讓一般使用者能快速理解今天該注意什麼。</p>
        <p className="runtime-boundary-line">目前公開頁使用示範資料；正式資料啟用前，所有分數都只代表閱讀流程示範。</p>
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
            <span>閱讀方式</span>
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
        <h2>延伸閱讀</h2>
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
