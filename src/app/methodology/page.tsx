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
  description: "說明指數燈號、綜合分數、風險分數與資料狀態的閱讀方式。"
};

const methodModules = [
  ["市場燈號", "用紅黃綠等狀態降低理解門檻。", "幫助使用者快速知道目前偏多、觀望或警戒。"],
  ["綜合分數", "整理趨勢、品質、評價、資金與風險背景。", "分數越高代表示範模型中的市場狀態越健康。"],
  ["風險分數", "整理波動、集中度與資料風險。", "分數越高代表越需要提高警覺。"],
  ["資料狀態", "揭露資料來源、更新時間與是否為示範資料。", "避免使用者把過期或示範資料誤認為正式資料。"]
] as const;

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>用可理解的燈號，整理市場狀態與風險</h1>
        <p>
          指數燈號不是投資建議，而是把市場狀態、風險分數與資料狀態整理成可快速閱讀的順序。
          使用者應把它當成觀察輔助，而不是交易指令。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料；正式資料、正式分數與資料來源揭露會在正式資料檢查通過後才啟用。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicRouteReadingContract context="methodology" />
      <TrustRuntimeBoundaryNotice context="methodology" />

      <section className="panel method-section">
        <h2>指標模組</h2>
        <div className="method-table" role="table" aria-label="指標模組">
          <div className="method-row method-head" role="row">
            <span>項目</span>
            <span>用途</span>
            <span>閱讀價值</span>
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
