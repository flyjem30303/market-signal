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
  description: "說明指數燈號如何以燈號、綜合分數、風險分數與資料狀態協助市場判讀。"
};

const methodModules = [
  ["燈號狀態", "把市場狀態整理成偏多、觀望、警戒或高風險等可讀訊號。", "協助使用者先抓方向，再進一步看成因。"],
  ["綜合分數", "彙整趨勢、動能與市場結構的示範分數。", "用於比較不同標的的相對強弱，不代表買賣建議。"],
  ["風險分數", "呈現波動、資料新鮮度與潛在風險條件。", "提醒使用者何時需要加強觀察或降低曝險。"],
  ["資料狀態", "標示資料來源、更新時間與 mock/real 邊界。", "避免使用者把示範資料誤認為正式即時資料。"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>燈號用來降低市場資訊理解門檻，不是交易指令</h1>
        <p>
          指數燈號把市場資料整理成燈號、分數、風險提示與資料狀態，協助使用者在短時間內建立觀察順序。
        </p>
        <p className="runtime-boundary-line">
          目前仍為示範資料模式。正式資料上線前，本頁只說明判讀框架，不宣稱真實資料服務已完成。
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
