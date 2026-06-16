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
  description: "說明指數燈號如何整理市場分數、風險分數、資料品質與非投資建議邊界。"
};

const methodModules = [
  [
    "市場燈號",
    "把多個市場觀察項目整理成紅、黃、綠等可理解狀態。",
    "幫助使用者先判斷市場氛圍，再決定是否需要深入觀察。"
  ],
  [
    "市場分數",
    "以 0 到 100 呈現示範資料中的趨勢、動能與結構強弱。",
    "分數較高代表可列入觀察，但仍需搭配風險分數與更新時間。"
  ],
  [
    "風險分數",
    "整理波動、偏離、資料品質與其他風險提示。",
    "風險分數升高時，重點是加強確認，不是做出單一方向判斷。"
  ],
  [
    "資料品質",
    "標示目前資料是否為示範資料、來源是否完成確認、更新時間是否可靠。",
    "正式資料未啟用前，所有分數都只能用來示範閱讀順序。"
  ]
] as const;

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>把市場資料整理成可閱讀、可追蹤、可回看的燈號</h1>
        <p>
          指數燈號不是投資建議，也不是即時報價。它的目的，是把市場狀態整理成一般投資者能在 30 秒內理解的順序：
          先看市場燈號，再看市場分數、風險分數、資料品質與下一步觀察。
        </p>
        <p className="runtime-boundary-line">
          Phase 1 使用示範資料；正式市場資料、完整覆蓋率與真實分數必須通過來源、品質、回讀與揭露 gate 後才能啟用。
          本頁為非投資建議。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicRouteReadingContract context="methodology" />
      <TrustRuntimeBoundaryNotice context="methodology" />

      <section className="panel method-section">
        <h2>核心指標</h2>
        <div className="method-table" role="table" aria-label="核心指標">
          <div className="method-row method-head" role="row">
            <span>項目</span>
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
