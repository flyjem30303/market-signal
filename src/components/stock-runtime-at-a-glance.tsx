import { TrackedLink } from "@/components/tracked-link";
import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";
import type { SignalSnapshot } from "@/lib/signal-model";
import { getStockRuntimeHeadlineSummary } from "@/lib/stock-runtime-headline-summary";

type StockRuntimeAtAGlanceProps = {
  scoreSourceLabel: string;
  snapshot: SignalSnapshot;
};

type Tone = "active" | "readying" | "blocked";

export function StockRuntimeAtAGlance({ scoreSourceLabel, snapshot }: StockRuntimeAtAGlanceProps) {
  const dataReadiness = getPublicBetaDataReadinessStatus();
  const headlineSummary = getStockRuntimeHeadlineSummary(snapshot);
  const decisionBrief = buildStockDecisionBrief(snapshot);

  return (
    <section className="stock-runtime-at-a-glance" aria-label="個股燈號快速摘要">
      <div>
        <p className="eyebrow">標的快速判讀</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name} 目前怎麼看？
        </h2>
        <p>
          這個頁面先用示範資料建立閱讀流程：30 秒可用來看懂標的狀態，3 分鐘要複核風險、成因、資料邊界與下一步觀察。
          正式資料升級前，頁面不宣稱即時行情，也不提供個股買賣建議。
        </p>
      </div>

      <div className="stock-public-decision-summary" aria-label="標的決策輔助摘要">
        <div>
          <p className="eyebrow">標的快速判讀 / 30 秒可用</p>
          <h2>
            {snapshot.asset.symbol} {snapshot.signal.title}
          </h2>
          <p>先看目前燈號，再確認風險原因、影響級別與資料更新時間。這是觀察順序整理，不是交易建議。</p>
        </div>
        <article className={decisionBrief.statusTone}>
          <span>狀態</span>
          <strong>{decisionBrief.status}</strong>
          <p>原因：{decisionBrief.cause}</p>
        </article>
        <article className={decisionBrief.impactTone}>
          <span>影響級別</span>
          <strong>{decisionBrief.impactLevel}</strong>
          <p>更新時間：{decisionBrief.updatedAt}</p>
          <p>下一步：{decisionBrief.nextStep}</p>
        </article>
        <article className="blocked">
          <span>資料來源</span>
          <strong>示範資料 / 示範分數</strong>
          <p>目前分數標示：{scoreSourceLabel}</p>
          <p>{dataReadiness.stopLine}</p>
        </article>
      </div>

      <div className="stock-runtime-action-strip" aria-label="標的閱讀順序">
        <article className="active">
          <span>30 秒可用</span>
          <strong>看燈號與風險分數</strong>
          <p>快速判斷目前偏多、觀望、警戒或高風險，不需要先讀完所有指標。</p>
        </article>
        <article className="readying">
          <span>3 分鐘要複核</span>
          <strong>複核成因、資料時間與資料邊界</strong>
          <p>查看風險來源、更新時間、缺漏提示與是否需要加強觀察。</p>
        </article>
        <article className="blocked">
          <span>使用邊界</span>
          <strong>不能當成個股買賣指令</strong>
          <p>本站是市場資訊整理與風險辨識工具，屬於非投資建議，不保證報酬，也不代替使用者做投資決策。</p>
        </article>
      </div>

      <div className="stock-runtime-headline-summary" aria-label="標的重點摘要">
        <div>
          <span>重點摘要</span>
          <strong>{headlineSummary.headline}</strong>
          <p>{headlineSummary.subhead}</p>
        </div>
        {headlineSummary.items.map((item) => (
          <article className={item.state} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.body}</p>
          </article>
        ))}
        <p className="stock-runtime-headline-stop-line">{headlineSummary.stopLine}</p>
      </div>

      <nav className="runtime-next-links" aria-label="標的下一步閱讀">
        <TrackedLink
          eventName="stock_link_clicked"
          href="/briefing"
          label="查看市場簡報"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看市場簡報
        </TrackedLink>
        <TrackedLink
          eventName="trust_link_clicked"
          href="/methodology"
          label="查看方法說明"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          查看方法說明
        </TrackedLink>
        <TrackedLink
          eventName="stock_link_clicked"
          href="/"
          label="回到市場總覽"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          回到市場總覽
        </TrackedLink>
      </nav>
    </section>
  );
}

function buildStockDecisionBrief(snapshot: SignalSnapshot) {
  const hasDataWarnings = snapshot.missingModuleFlags.length > 0 || snapshot.staleDataFlags.length > 0;
  const highRisk = snapshot.riskScore >= 70;
  const watchRisk = snapshot.riskScore >= 55;
  const strongHealth = snapshot.healthScore >= 68;
  const updatedAt = formatTaipeiTime(snapshot.lastUpdatedAt);

  if (hasDataWarnings) {
    return {
      cause: "目前仍有示範資料或資料缺漏提示，請先確認資料狀態再閱讀燈號。",
      impactLevel: "中",
      impactTone: "readying" as Tone,
      nextStep: "先看資料可信度與更新時間，再決定是否加強觀察。",
      status: "資料需複核",
      statusTone: "readying" as Tone,
      updatedAt
    };
  }

  if (highRisk) {
    return {
      cause: `風險分數 ${snapshot.riskScore}/100，示範模型顯示波動或弱勢訊號偏高。`,
      impactLevel: "高",
      impactTone: "blocked" as Tone,
      nextStep: "先降低解讀速度，複核成因與市場總覽，再決定是否降低風險。",
      status: "高風險觀察",
      statusTone: "blocked" as Tone,
      updatedAt
    };
  }

  if (watchRisk || !strongHealth) {
    return {
      cause: `綜合分數 ${snapshot.compositeScore}/100，目前適合維持觀察。`,
      impactLevel: "中",
      impactTone: "readying" as Tone,
      nextStep: "持續追蹤燈號是否連續轉弱，並與市場簡報一起閱讀。",
      status: "觀望或加強觀察",
      statusTone: "readying" as Tone,
      updatedAt
    };
  }

  return {
    cause: `健康分數 ${snapshot.healthScore}/100，示範模型顯示趨勢相對穩定。`,
    impactLevel: "低",
    impactTone: "active" as Tone,
    nextStep: "維持觀察即可，仍需留意資料更新時間與風險提示。",
    status: "相對穩定",
    statusTone: "active" as Tone,
    updatedAt
  };
}

function formatTaipeiTime(value: string) {
  return value.replace("T", " ").replace("+08:00", " 台北時間");
}
