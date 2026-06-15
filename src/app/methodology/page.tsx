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
  description: "說明指數燈號如何整理市場狀態、風險分數、資料狀態與非投資建議邊界。"
};

const methodModules = [
  ["市場燈號", "把市場狀態整理成偏多、觀望、警戒或高風險等可讀狀態。", "讓使用者先理解市場氛圍，而不是直接做買賣判斷。"],
  ["市場分數", "整合趨勢、資料品質、估值、廣度、資金與風險環境等示範模型因子。", "用來比較相對狀態，不代表預測報酬或投資建議。"],
  ["風險分數", "提示波動、資料延遲、訊號分歧或市場壓力是否升高。", "分數越高越需要複核資料時間、來源與自身風險承受度。"],
  ["資料狀態", "標示目前為示範資料或正式資料，並揭露更新時間與使用邊界。", "正式資料啟用前，公開頁不宣稱即時真實行情。"]
] as const;

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>燈號是市場閱讀工具，不是買賣建議</h1>
        <p>
          指數燈號把趨勢、風險、資料品質與市場廣度整理成容易閱讀的狀態，協助一般投資者建立固定觀察流程。
        </p>
        <p className="runtime-boundary-line">
          目前公開版仍使用示範資料與示範分數；正式資料必須完成合法來源、資料品質、寫入回讀、回退與上線審核後才會啟用。
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
            <span>使用者應該怎麼看</span>
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
