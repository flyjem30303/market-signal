import { TrackedLink } from "@/components/tracked-link";
import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";
import type { SignalSnapshot } from "@/lib/signal-model";
import { getStockRuntimeHeadlineSummary } from "@/lib/stock-runtime-headline-summary";

type StockRuntimeAtAGlanceProps = {
  scoreSourceLabel: string;
  snapshot: SignalSnapshot;
};

type Tone = "active" | "readying" | "blocked";

export function StockRuntimeAtAGlance({ scoreSourceLabel: _scoreSourceLabel, snapshot }: StockRuntimeAtAGlanceProps) {
  const dataReadiness = getPublicBetaDataReadinessStatus();
  const headlineSummary = getStockRuntimeHeadlineSummary(snapshot);
  const decisionBrief = buildStockDecisionBrief(snapshot);

  return (
    <section className="stock-runtime-at-a-glance" aria-label="標的公開狀態摘要">
      <div>
        <p className="eyebrow">公開 Beta 狀態</p>
        <h2>{snapshot.asset.symbol} 目前是示範資料閱讀頁</h2>
        <p>
          這個區塊協助你在 30 秒內看懂標的狀態，並在 3 分鐘內確認風險、資料品質與下一步觀察。
          正式資料尚未啟用前，所有分數都只能作為示範閱讀流程。
        </p>
      </div>

      <div className="stock-public-decision-summary" aria-label="標的決策摘要">
        <div>
          <p className="eyebrow">30 秒快速閱讀</p>
          <h2>{snapshot.asset.symbol} {snapshot.signal.title}</h2>
          <p>先看狀態，再看風險成因與資料品質；不要只用單一分數形成判斷。</p>
        </div>
        <article className={decisionBrief.statusTone}>
          <span>狀態</span>
          <strong>{decisionBrief.status}</strong>
          <p>成因：{decisionBrief.cause}</p>
        </article>
        <article className={decisionBrief.impactTone}>
          <span>影響級別</span>
          <strong>{decisionBrief.impactLevel}</strong>
          <p>更新時間：{decisionBrief.updatedAt}</p>
          <p>下一步：{decisionBrief.nextStep}</p>
        </article>
        <article className="blocked">
          <span>資料邊界</span>
          <strong>示範資料 / 示範分數</strong>
          <p>{dataReadiness.stopLine}</p>
        </article>
      </div>

      <div className="stock-runtime-action-strip" aria-label="標的頁資料使用方式">
        <article className="active">
          <span>30 秒可用</span>
          <strong>看標的狀態與市場氣氛</strong>
          <p>可用來快速理解這個標的目前偏強、觀望或偏防守，但只代表示範閱讀流程。</p>
        </article>
        <article className="readying">
          <span>3 分鐘要複核</span>
          <strong>對照成因、更新時間與資料狀態</strong>
          <p>若分數或燈號吸引注意，請先確認風險成因、資料品質與市場晨報，再決定是否持續觀察。</p>
        </article>
        <article className="blocked">
          <span>不能直接做</span>
          <strong>不能當成個股買賣指令</strong>
          <p>正式資料與正式分數尚未啟用，本頁不提供個股買賣建議，也不保證任何結果。</p>
        </article>
      </div>

      <div className="stock-runtime-headline-summary" aria-label="標的狀態摘要">
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

      <nav className="runtime-next-links" aria-label="標的頁下一步">
        <TrackedLink
          eventName="stock_link_clicked"
          href="/briefing"
          label="閱讀市場晨報"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          閱讀市場晨報
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
          label="回到首頁"
          payload={{ area: "stock_runtime_next_links", symbol: snapshot.asset.symbol }}
        >
          回到首頁
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
  const updatedAt = snapshot.lastUpdatedAt.replace("T", " ").replace("+08:00", " 台北時間");

  if (hasDataWarnings) {
    return {
      cause: "仍有資料缺口或更新旗標，分數需要保守解讀。",
      impactLevel: "中",
      impactTone: "readying" as Tone,
      nextStep: "先確認資料品質，再閱讀分數與警示。",
      status: "資料待確認",
      statusTone: "readying" as Tone,
      updatedAt
    };
  }

  if (highRisk) {
    return {
      cause: `風險分數 ${snapshot.riskScore}/100，代表需要先拆解風險來源。`,
      impactLevel: "高",
      impactTone: "blocked" as Tone,
      nextStep: "先看風險成因與市場廣度，避免只看單一標的。",
      status: "風險升溫",
      statusTone: "blocked" as Tone,
      updatedAt
    };
  }

  if (watchRisk || !strongHealth) {
    return {
      cause: `綜合分數 ${snapshot.compositeScore}/100，仍需要觀察延續性。`,
      impactLevel: "中",
      impactTone: "readying" as Tone,
      nextStep: "觀察下一次更新是否延續，並對照 ETF 與市場晨報。",
      status: "持續觀察",
      statusTone: "readying" as Tone,
      updatedAt
    };
  }

  return {
    cause: `健康分數 ${snapshot.healthScore}/100，風險暫時較低。`,
    impactLevel: "低",
    impactTone: "active" as Tone,
    nextStep: "保持觀察，不把示範分數當作正式交易依據。",
    status: "相對穩定",
    statusTone: "active" as Tone,
    updatedAt
  };
}
