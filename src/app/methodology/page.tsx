import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "方法說明",
  description: "說明指數燈號如何整理市場資料、形成燈號、揭露資料邊界，並提醒本網站不是投資建議。"
};

const methodModules = [
  ["市場燈號", "整合趨勢、資金、評價與風險", "讓使用者先看懂市場狀態"],
  ["成因", "拆解造成燈號的主要因素", "避免只看單一分數"],
  ["資料", "標示來源、更新時間與模擬邊界", "降低誤判風險"],
  ["不是投資建議", "不提供買賣點或保證報酬", "維持資訊整理與風險辨識定位"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>燈號怎麼來：先整理資料，再形成可理解的市場狀態</h1>
        <p>指數燈號把複雜市場資訊轉成狀態、成因、影響級別與下一步觀察，協助一般投資者建立固定閱讀流程。</p>
        <p className="runtime-boundary-line">目前公開 Beta 使用展示資料；正式資料切換前，不宣稱即時真實資料，也不是投資建議。</p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="panel method-section">
        <h2>核心方法</h2>
        <div className="method-table" role="table" aria-label="核心方法">
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
        <h2>繼續閱讀</h2>
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
