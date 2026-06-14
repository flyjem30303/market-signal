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
    <section className="stock-runtime-at-a-glance" aria-label="狀態儀表">
      <div>
        <p className="eyebrow">標的快速判讀</p>
        <h2>
          {snapshot.asset.symbol} {snapshot.asset.name} 狀態儀表
        </h2>
        <p>
          這裡把燈號、風險、資料狀態與下一步觀察整理在同一個區塊，讓使用者先用 30 秒看懂狀態，再用 3 分鐘決定要觀察什麼。
        </p>
      </div>

      <div className="stock-public-decision-summary" aria-label="標的快速判讀">
        <article className={decisionBrief.statusTone}>
          <span>目前狀態</span>
          <strong>{decisionBrief.status}</strong>
          <p>成因：{decisionBrief.cause}</p>
        </article>
        <article className={decisionBrief.impactTone}>
          <span>影響層級</span>
          <strong>{decisionBrief.impactLevel}</strong>
          <p>更新時間：{decisionBrief.updatedAt}</p>
          <p>下一步：{decisionBrief.nextStep}</p>
        </article>
        <article className="blocked">
          <span>資料邊界</span>
          <strong>示範資料 / 示範分數</strong>
          <p>公開 Beta 目前用示範資料建立閱讀流程；正式市場資料尚未啟用。</p>
          <p>分數來源：{scoreSourceLabel}</p>
          <p>{dataReadiness.stopLine}</p>
        </article>
      </div>

      <div className="stock-runtime-action-strip" aria-label="標的行動順序">
        <article className="active">
          <span>30 秒</span>
          <strong>先看燈號與風險</strong>
          <p>先確認市場氣氛、標的狀態與風險是否需要提高觀察頻率。</p>
        </article>
        <article className="readying">
          <span>3 分鐘</span>
          <strong>再看原因與資料邊界</strong>
          <p>複核成因、更新時間、資料品質與下一步觀察，不把單一分數當成結論。</p>
        </article>
        <article className="blocked">
          <span>使用邊界</span>
          <strong>不能當成個股買賣指令</strong>
          <p>本頁是市場資訊整理與風險辨識工具，不提供報酬承諾，也不代替使用者做投資決策。</p>
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

      <nav className="runtime-next-links" aria-label="標的延伸閱讀">
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
          label="返回市場總覽"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          返回市場總覽
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
      cause: "資料有缺漏或過期標記，需先確認更新時間與資料品質。",
      impactLevel: "需複核",
      impactTone: "readying" as Tone,
      nextStep: "先確認資料邊界，再搭配市場總覽判讀。",
      status: "資料需複核",
      statusTone: "readying" as Tone,
      updatedAt
    };
  }

  if (highRisk) {
    return {
      cause: `風險分數 ${snapshot.riskScore}/100，表示需要提高警覺並複核關鍵成因。`,
      impactLevel: "高",
      impactTone: "blocked" as Tone,
      nextStep: "降低單點判斷，優先觀察風險是否連續升高。",
      status: "高風險觀察",
      statusTone: "blocked" as Tone,
      updatedAt
    };
  }

  if (watchRisk || !strongHealth) {
    return {
      cause: `綜合分數 ${snapshot.compositeScore}/100，市場訊號仍需要等待確認。`,
      impactLevel: "中",
      impactTone: "readying" as Tone,
      nextStep: "持續觀察量能、風險與燈號是否出現一致方向。",
      status: "觀望中",
      statusTone: "readying" as Tone,
      updatedAt
    };
  }

  return {
    cause: `健康分數 ${snapshot.healthScore}/100，短線狀態相對穩定。`,
    impactLevel: "低",
    impactTone: "active" as Tone,
    nextStep: "維持追蹤，並確認資料更新時間與風險提示。",
    status: "相對穩定",
    statusTone: "active" as Tone,
    updatedAt
  };
}

function formatTaipeiTime(value: string) {
  return value.replace("T", " ").replace("+08:00", " 台北時間");
}
