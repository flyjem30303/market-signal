import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "燈號方法",
  description: "說明指數燈號如何整理市場狀態、風險提示與資料邊界；燈號不是交易指令。"
};

const methodModules = [
  ["燈號方法", "把趨勢、風險、資料時間與市場廣度轉成可讀狀態", "讓使用者先判斷市場氛圍"],
  ["成因拆解", "說明燈號背後的主要因素", "避免只看單一分數"],
  ["資料來源", "標示資料是否仍為示範資料，以及更新時間", "降低誤判風險"],
  ["非交易指令", "所有內容都是市場觀察輔助", "不能當作交易指令或買賣建議"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">燈號方法</p>
        <h1>燈號把市場資料整理成觀察順序，不是交易指令</h1>
        <p>指數燈號用市場狀態、風險分數、資料時間與成因說明，協助使用者建立固定的市場檢查流程。</p>
        <p className="runtime-boundary-line">
          正式資料尚未啟用前，所有燈號都應搭配資料邊界閱讀；本網站不提供個別買賣建議。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="panel method-section">
        <h2>方法拆解</h2>
        <div className="method-table" role="table" aria-label="方法拆解">
          <div className="method-row method-head" role="row">
            <span>項目</span>
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
        <h2>信任與風險</h2>
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
