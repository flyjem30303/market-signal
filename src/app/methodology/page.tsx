import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "方法說明",
  description: "說明指數燈號如何閱讀市場狀態、分數、資料來源、更新時間與風險邊界。"
};

const methodModules = [
  ["市場燈號", "把市場狀態轉成偏多、觀望、警戒或高風險。", "先用來建立閱讀順序，不是交易指令。"],
  ["綜合分數", "整合價格、趨勢與資料品質，呈現市場狀態強弱。", "不是預測，也不是保證報酬。"],
  ["風險分數", "提醒波動、走弱或資料異常可能帶來的風險。", "分數越高越需要加強觀察。"],
  ["資料狀態", "標示資料來源、更新時間、品質與是否降級。", "使用前應先確認資料時間與風險聲明。"]
] as const;

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>先看燈號，再看原因，最後看資料時間</h1>
        <p>指數燈號的目標是降低市場資訊理解門檻，協助使用者快速掌握市場氛圍與觀察重點。</p>
        <p className="runtime-boundary-line">本站提供資訊整理與風險辨識，不提供個股買賣建議或保證報酬。</p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="panel method-section">
        <h2>核心閱讀模組</h2>
        <div className="method-table" role="table" aria-label="方法模組">
          <div className="method-row method-head" role="row">
            <span>模組</span>
            <span>用途</span>
            <span>使用限制</span>
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
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/" label="回市場總覽" payload={{ area: "methodology" }}>
          回市場總覽
        </TrackedLink>
      </section>
    </main>
  );
}
