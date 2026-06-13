import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "方法說明",
  description: "說明指數燈號如何閱讀、目前資料狀態、正式資料尚未啟用的限制，以及非投資建議邊界。"
};

const methodModules = [
  ["趨勢動能", "觀察價格方向與均線關係", "協助判斷市場是否延續目前方向"],
  ["市場廣度", "觀察上漲是否集中在少數標的", "避免只看大盤指數造成誤判"],
  ["風險熱度", "整理波動、壓力與資料提示", "提醒使用者是否需要加強複核"],
  ["資金流向", "觀察資金是否集中或分散", "作為市場氣氛的輔助訊號"],
  ["資料狀態", "揭露資料來源、更新時間與限制", "正式資料升級前檢查的核心項目"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">Methodology</p>
        <h1>燈號方法：如何閱讀市場狀態</h1>
        <p>
          指數燈號不是單一分數工具，而是把市場氣氛、核心指標、風險提醒、資料品質與資料狀態整理成可理解的閱讀順序。
        </p>
        <p className="runtime-boundary-line">
          正式市場資料尚未啟用；正式資料尚未啟用前，正式資料必須先通過驗證、來源條件、覆蓋率與品質檢查。本頁不是交易指令，也不提供買賣建議或個股買賣建議。
        </p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <section className="method-quick-read" aria-label="方法快速閱讀">
        <article>
          <span>30 秒</span>
          <strong>先看燈號</strong>
          <p>確認市場目前偏多、觀望、警戒或高風險。</p>
        </article>
        <article>
          <span>3 分鐘</span>
          <strong>再看原因</strong>
          <p>複核風險分數、市場廣度、資料狀態與下一步觀察。</p>
        </article>
        <article>
          <span>使用邊界</span>
          <strong>不是交易指令</strong>
          <p>燈號是觀察輔助，不是買賣建議或獲利承諾。</p>
        </article>
      </section>

      <section className="panel method-section">
        <h2>核心指標</h2>
        <div className="method-table" role="table" aria-label="核心指標">
          <div className="method-row method-head" role="row">
            <span>指標</span>
            <span>看什麼</span>
            <span>對使用者的意義</span>
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

      <section className="method-guardrail-grid" aria-label="使用邊界">
        <article>
          <h2>正式資料升級前檢查</h2>
          <p>來源、欄位、覆蓋率、更新時間與錯誤回退都通過後，才會改變公開資料狀態。</p>
        </article>
        <article>
          <h2>資料狀態要先看</h2>
          <p>若資料延遲、缺漏或仍是示範資料，燈號只能作為閱讀流程示範。</p>
        </article>
        <article>
          <h2>不提供個股買賣建議</h2>
          <p>本站協助整理市場資訊與風險，不提供個股買賣建議、不保證報酬。</p>
        </article>
      </section>

      <section className="panel method-links">
        <h2>下一步</h2>
        <TrustTextLink href="/" label="回首頁" />
        <TrustTextLink href="/briefing" label="市場簡報" />
        <TrustTextLink href="/weekly" label="市場週報" />
        <TrustTextLink href="/disclaimer" label="風險聲明" />
      </section>
    </main>
  );
}

function TrustTextLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "methodology_next_links" }}>
      {label}
    </TrackedLink>
  );
}
