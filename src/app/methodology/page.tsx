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
  description: "說明指數燈號如何整理趨勢、風險、資料品質與下一步觀察。"
};

const methodModules = [
  ["燈號狀態", "把市場狀態整理為偏多、觀望、警戒等可讀標籤。", "讓使用者快速理解目前氛圍。"],
  ["趨勢強弱", "觀察市場是否延續原方向，或開始出現轉弱跡象。", "協助判斷是否需要加強觀察。"],
  ["風險分數", "整理波動、評價與資料品質等風險因素。", "提醒使用者不要只看正向訊號。"],
  ["下一步觀察", "把燈號轉成可執行的觀察順序。", "降低資訊擷取與判斷成本。"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>燈號是市場閱讀工具，不是交易指令</h1>
        <p>
          指數燈號把趨勢、風險、資料品質與觀察重點整理成可理解的狀態，協助一般投資者快速建立市場觀察流程。
        </p>
        <p className="runtime-boundary-line">目前仍為公開 Beta 示範資料，真實資料上線前會清楚標示。</p>
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
