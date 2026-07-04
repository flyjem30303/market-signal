import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { buildI18nAlternates } from "@/lib/i18n/metadata";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";
import { buildCorePageJsonLd, buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  description:
    "了解 Market Signal 如何用可追溯的方法論解釋市場分數、風險、信心度與資料邊界，而不是提供投資建議。",
  path: "/methodology",
  title: "方法說明"
});

metadata.alternates = buildI18nAlternates("methodology");

const methodologyJsonLd = buildCorePageJsonLd({
  description:
    "Market Signal uses an explainable market-state framework. QMV1 is a governance-approved heuristic, not a statistically validated prediction model, and not investment advice.",
  path: "/methodology",
  title: "方法說明"
});

const methodModules = [
  {
    name: "趨勢",
    purpose: "觀察市場方向是否仍有結構支撐。",
    value: "協助判斷市場是延續、轉弱，還是進入分歧。"
  },
  {
    name: "動能",
    purpose: "觀察近期價格推進力是否增加或衰退。",
    value: "協助區分短期變化是暫時降溫，還是已經失去推升力。"
  },
  {
    name: "波動穩定度",
    purpose: "觀察市場波動是否正在擴大。",
    value: "協助判斷風險是否從價格變化擴散成不穩定狀態。"
  },
  {
    name: "參與度",
    purpose: "觀察市場變化是否有足夠標的共同參與。",
    value: "避免只看單一指數變化，忽略市場內部是否分散。"
  }
] as const;

const scoreRules = [
  {
    name: "綜合分數",
    purpose: "把趨勢、動能、波動穩定度與參與度整理成 0-100 的市場狀態讀數。",
    boundary: "它用來解釋市場狀態，不是報酬預測。"
  },
  {
    name: "風險分數",
    purpose: "整理波動、結構轉弱與資料風險，協助辨識市場是否更需要謹慎解讀。",
    boundary: "分數升高代表需要提高留意，不代表一定會下跌。"
  },
  {
    name: "信心度",
    purpose: "反映資料完整度、資料日期、樣本深度與缺漏狀態。",
    boundary: "信心度只影響判讀可信度，不應被當成市場漲跌原因。"
  }
] as const;

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <SeoJsonLd data={methodologyJsonLd} />

      <section className="hero">
        <p className="eyebrow">方法說明 / QMV1</p>
        <h1>Market Signal 如何解釋市場分數</h1>
        <p>
          這頁說明「為什麼今天是這個分數」。Market Signal uses an explainable market-state framework.
          QMV1 透過趨勢、動能、波動穩定度與參與度，將市場狀態整理成可追溯的綜合分數、風險分數與信心度。
        </p>
        <p className="runtime-boundary-line">
          QMV1 is a governance-approved heuristic, not a statistically validated prediction model, and not investment advice.
          中文解讀：這是市場狀態觀察方法，不是統計驗證通過的預測模型，也不是投資建議。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="panel method-section">
        <p className="eyebrow">Core Components</p>
        <h2>四個市場狀態構面</h2>
        <p>
          QMV1 不是用新聞情緒、社群聲量或 AI 主觀評論來打分數。它只使用目前可追溯的資料與規則，
          讓每一條 explanation 都能回到 rule / source / value。
        </p>
        <div className="method-table" role="table" aria-label="QMV1 四個構面">
          <div className="method-row method-head" role="row">
            <span>構面</span>
            <span>觀察重點</span>
            <span>使用價值</span>
          </div>
          {methodModules.map((item) => (
            <div className="method-row" role="row" key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.purpose}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel method-section">
        <p className="eyebrow">Score Reading</p>
        <h2>分數應該怎麼閱讀</h2>
        <div className="method-table" role="table" aria-label="QMV1 分數閱讀方式">
          <div className="method-row method-head" role="row">
            <span>項目</span>
            <span>代表意義</span>
            <span>邊界</span>
          </div>
          {scoreRules.map((item) => (
            <div className="method-row" role="row" key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.purpose}</span>
              <span>{item.boundary}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel method-section">
        <p className="eyebrow">Traceability</p>
        <h2>為什麼要能追溯 rule / source / value</h2>
        <p>
          Market Signal 的目標不是把分數翻譯成漂亮句子，而是回答「這個分數為什麼是這個分數」。
          因此每一條分數原因都必須能回到明確規則、資料來源與實際數值。
        </p>
        <div className="method-table" role="table" aria-label="QMV1 可追溯欄位">
          <div className="method-row method-head" role="row">
            <span>欄位</span>
            <span>用途</span>
            <span>前台意義</span>
          </div>
          <div className="method-row" role="row">
            <strong>ruleId</strong>
            <span>產生解釋句的 deterministic rule。</span>
            <span>避免無資料支撐的泛用敘述。</span>
          </div>
          <div className="method-row" role="row">
            <strong>source</strong>
            <span>該規則使用的原始欄位或衍生欄位。</span>
            <span>讓使用者知道分數原因來自哪裡。</span>
          </div>
          <div className="method-row" role="row">
            <strong>value</strong>
            <span>實際數值或數值變化。</span>
            <span>讓「54 為什麼是 54」可以被重新檢查。</span>
          </div>
        </div>
      </section>

      <section className="panel method-section">
        <p className="eyebrow">Current Validation Status</p>
        <h2>目前方法論狀態</h2>
        <p>
          QMV1 目前定位為 governance-approved heuristic。它已通過產品治理與可解釋性審查，
          但仍維持 validationClaim: not_statistically_validated，productionDecision: do_not_promote_to_production_scoring。
        </p>
        <p>
          這代表它可以作為市場狀態觀察與方法論說明的基礎，但不能被宣稱為已統計驗證的預測模型，
          也不能被包裝成買賣訊號。
        </p>
      </section>

      <section className="panel method-links">
        <h2>延伸閱讀</h2>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/disclaimer" label="風險提示" payload={{ area: "methodology" }}>
          查看風險提示
        </TrackedLink>
        <TrackedLink className="text-link" eventName="trust_link_clicked" href="/markets/tw" label="台灣市場" payload={{ area: "methodology" }}>
          查看台灣市場風險指南針
        </TrackedLink>
      </section>
    </main>
  );
}
