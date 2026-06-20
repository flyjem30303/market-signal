import type { Metadata } from "next";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { buildCorePageJsonLd, buildRouteMetadata } from "@/lib/seo";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = buildRouteMetadata({
  description: "???????????????????????????????????????",
  path: "/methodology",
  title: "???"
});

const methodologyJsonLd = buildCorePageJsonLd({
  description: "???????????????????????????????????????",
  path: "/methodology",
  title: "???"
});

const methodModules = [
  ["市場燈號", "把市場狀態轉成偏多、觀望、警戒或高風險。", "建立閱讀順序，不是交易指令。"],
  ["綜合分數", "整合趨勢、動能、波動等可解釋模組，呈現市場狀態強弱。", "不是預測，也不是保證報酬。"],
  ["風險分數", "提醒波動、走弱或資料異常可能帶來的風險。", "分數越高越需要加強觀察。"],
  ["資料日期", "標示資料來源與更新時間。", "使用前應先確認是否為最新交易日資料。"]
] as const;

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <SeoJsonLd data={methodologyJsonLd} />
      <section className="hero">
        <p className="eyebrow">方法說明</p>
        <h1>先看燈號，再看原因，最後看資料時間</h1>
        <p>指數燈號把市場資料整理成可閱讀的燈號、分數與原因拆解，協助使用者快速掌握市場氛圍與觀察重點。</p>
        <p className="runtime-boundary-line">本站提供資訊整理與風險辨識，不提供個股買賣建議或保證報酬。</p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="panel method-section">
        <h2>核心閱讀模組</h2>
        <p>分數說明採用可追溯規則與資料欄位，不使用自由生成的投資評論取代資料判讀。</p>
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
