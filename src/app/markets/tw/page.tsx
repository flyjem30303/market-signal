import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { buildI18nAlternates } from "@/lib/i18n/metadata";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import { buildRouteMetadata } from "@/lib/seo";
import { buildStockExplanation, type ExplanationItem } from "@/lib/stock-explanation-engine";
import type { ModuleScore, SignalSnapshot } from "@/lib/signal-model";

export const revalidate = 300;

export const metadata: Metadata = buildRouteMetadata({
  description: "台灣市場風險指南針，說明綜合分數、風險分數、今日變化、證據因子、歷史位置與近期燈號脈絡。",
  path: "/markets/tw",
  title: "台灣市場風險指南針"
});

metadata.alternates = buildI18nAlternates("marketTw");

export default async function TaiwanMarketPage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime({ historyDays: 260, symbols: ["TWII"] });
  const freshness = await getDataFreshnessSnapshot();
  const marketSeries = repository.getSeries("TWII");
  const fallbackSnapshot = repository
    .getAssets()
    .map((asset) => repository.getSeries(asset.symbol).at(-1))
    .find((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));
  const market = marketSeries.at(-1) ?? fallbackSnapshot;

  if (!market) {
    return (
      <main className="page-shell global-market-detail-page">
        <section className="hero global-detail-hero">
          <p className="eyebrow">Taiwan Market Detail</p>
          <h1>台灣市場風險指南針</h1>
          <p>目前沒有可用的市場快照。請先確認資料更新狀態，再回到本頁查看市場解釋。</p>
        </section>
      </main>
    );
  }

  const previous = findPreviousSnapshot(marketSeries, market.date);
  const explanation = buildStockExplanation(market, { seriesLength: marketSeries.length });
  const todayChange = buildTodayChange(previous, market);
  const changeDrivers = buildMarketChangeDrivers(previous, market);
  const evidenceDrivers = buildEvidenceDrivers(market);
  const historicalContext = buildHistoricalContext(marketSeries, market);
  const signalHistory = buildSignalHistory(marketSeries);
  const sourceLabel = formatPublicSourceLabel(freshness.sourceName, marketSignalSourceStatus.resolvedSource === "supabase");
  const riskRegime = describeRiskRegime(market.riskScore);

  return (
    <main className="page-shell global-market-detail-page">
      <PageViewTracker eventName="home_page_viewed" payload={{ market: "tw", page: "markets/tw" }} />

      <section className="hero global-detail-hero market-detail-hero" aria-labelledby="tw-market-title">
        <div>
          <p className="eyebrow">Taiwan Market Detail</p>
          <h1 id="tw-market-title">台灣市場風險指南針</h1>
          <p>
            這頁不是市場資料牆，而是解釋台灣市場目前為什麼落在這個燈號。先看狀態，再看今日變化、主要證據與歷史位置。
          </p>
        </div>
        <div className="market-detail-metric-grid" aria-label="台灣市場目前狀態">
          <MetricCard label="市場燈號" value={market.signal.title} note={explanation.scoreLevel} />
          <MetricCard label="綜合分數" value={`${market.compositeScore}/100`} note={formatDeltaFromPrevious(previous?.compositeScore, market.compositeScore)} />
          <MetricCard label="風險分數" value={`${market.riskScore}/100`} note={riskRegime.label} />
          <MetricCard label="資料日期" value={market.date} note={sourceLabel} />
        </div>
      </section>

      <DataFreshnessStrip
        fallbackAsOfDate={market.date}
        freshness={freshness}
        marketSignalSourceStatus={marketSignalSourceStatus}
      />

      <section className="global-market-section market-detail-change" aria-labelledby="tw-market-change-title">
        <div className="global-market-section-head">
          <div>
            <p className="eyebrow">L1 Current + Change</p>
            <h2 id="tw-market-change-title">今天市場什麼變了？</h2>
          </div>
          <span>{todayChange.comparisonDateRange}</span>
        </div>
        <p>{todayChange.summaryText}</p>
        <div className="market-detail-change-grid">
          <MetricCard label="市場方向" value={todayChange.signalDelta} note={todayChange.signalNote} />
          <MetricCard label="綜合分數變化" value={todayChange.compositeDelta} note={todayChange.compositeNote} />
          <MetricCard label="風險分數變化" value={todayChange.riskDelta} note={todayChange.riskNote} />
        </div>
        <ChangeReasonList items={changeDrivers} />
      </section>

      <section className="panel global-explainable-card" aria-labelledby="tw-market-drivers-title">
        <p className="eyebrow">L2 Evidence Drivers</p>
        <h2 id="tw-market-drivers-title">目前支撐與風險</h2>
        <p>
          這裡解釋目前狀態的主要原因。每一條都必須能追溯到 component、rule、source 與 value；資料品質只影響信心，不作為市場正負原因。
        </p>
        <div className="global-explanation-columns">
          <EvidenceDriverList title="主要支撐" items={evidenceDrivers.positives} />
          <EvidenceDriverList title="主要風險" items={evidenceDrivers.negatives} />
        </div>
      </section>

      <section className="global-detail-grid" aria-label="歷史位置與燈號脈絡">
        <article className="panel global-explainable-card">
          <p className="eyebrow">L3 Historical Context</p>
          <h2>這個分數代表什麼？</h2>
          <p>{historicalContext.summary}</p>
          <div className="market-detail-context-grid">
            <MetricCard label="綜合分數位置" value={historicalContext.compositePosition} note={historicalContext.compositeNote} />
            <MetricCard label="風險分數位置" value={historicalContext.riskPosition} note={historicalContext.riskNote} />
          </div>
        </article>

        <article className="panel global-explainable-card">
          <p className="eyebrow">L3 Signal History</p>
          <h2>最近燈號脈絡</h2>
          <p>{signalHistory.summary}</p>
          <div className="market-detail-signal-strip" aria-label="最近 30 筆燈號色塊">
            {signalHistory.items.map((snapshot) => (
              <span
                key={`${snapshot.date}-${snapshot.signal.title}`}
                aria-label={`${snapshot.date} ${snapshot.signal.title}，綜合 ${snapshot.compositeScore}，風險 ${snapshot.riskScore}`}
                className={`market-detail-signal-dot ${getSignalToneClass(snapshot)}`}
                title={`${snapshot.date}：${snapshot.signal.title}，綜合 ${snapshot.compositeScore}，風險 ${snapshot.riskScore}`}
              />
            ))}
          </div>
          <p className="market-detail-history-summary">{signalHistory.detail}</p>
        </article>
      </section>

      <section className="panel global-explainable-card market-detail-next" aria-labelledby="tw-market-next-title">
        <p className="eyebrow">Next Observation</p>
        <h2 id="tw-market-next-title">下一步觀察什麼</h2>
        <p>{buildNextObservation(market, evidenceDrivers.negatives[0])}</p>
        <nav className="market-detail-link-row" aria-label="台灣市場下一步閱讀">
          <TrackedLink eventName="nav_link_clicked" href="/weekly" label="週報" payload={{ area: "markets-tw-next" }}>
            查看本週脈絡
          </TrackedLink>
          <TrackedLink eventName="nav_link_clicked" href="/stocks/TWII" label="台灣加權指數" payload={{ area: "markets-tw-next" }}>
            查看台灣加權指數
          </TrackedLink>
          <TrackedLink eventName="nav_link_clicked" href="/methodology" label="方法說明" payload={{ area: "markets-tw-next" }}>
            理解分數形成方式
          </TrackedLink>
        </nav>
      </section>

      <details className="market-detail-notes">
        <summary>
          <span>
            <span className="eyebrow">Methodology Notes</span>
            <strong>目前未納入的限制</strong>
          </span>
          <span className="market-detail-notes-summary">Breadth inactive · Confidence Medium</span>
        </summary>
        <ul>
          <li>
            <strong>Market Breadth</strong>
            <span>等待合法且可驗證的資料來源，不納入支撐或風險。</span>
          </li>
          <li>
            <strong>Confidence</strong>
            <span>Medium；目前仍使用 Phase 1 production runtime。</span>
          </li>
          <li>
            <strong>Market Explain Snapshot</strong>
            <span>report-only，尚未替換 production scoring；validation remains not statistically validated。</span>
          </li>
        </ul>
        <TrackedLink eventName="nav_link_clicked" href="/methodology" label="方法說明" payload={{ area: "markets-tw-notes" }}>
          Signal Framework v1 · TWSE OpenAPI · 查看方法說明
        </TrackedLink>
      </details>
    </main>
  );
}

function MetricCard({ label, note, value }: { label: string; note: string; value: string }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

type EvidenceDriver = {
  componentId: string;
  direction: "positive" | "negative";
  label: string;
  note: string;
  ruleId: string;
  source: string;
  sourceValue: number | string | boolean;
  value: string;
  why: string;
};

function EvidenceDriverList({ items, title }: { items: EvidenceDriver[]; title: string }) {
  return (
    <div>
      <h3>{title}</h3>
      <ol className="market-detail-factor-list">
        {items.slice(0, 3).map((item) => (
          <li key={`${title}-${item.componentId}-${item.ruleId}`}>
            <p>
              <strong>{item.label}</strong>：{item.why}
            </p>
            <small>
              {item.value} / ruleId: {item.ruleId} / source: {item.source} / value: {String(item.sourceValue)}
            </small>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FactorList({ items, title }: { items: ExplanationItem[]; title: string }) {
  return (
    <div>
      <h3>{title}</h3>
      <ol className="market-detail-factor-list">
        {items.slice(0, 3).map((item) => (
          <li key={`${title}-${item.evidence[0]?.ruleId ?? item.text}`}>
            <p>{item.text}</p>
            <small>{formatEvidence(item)}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ChangeReasonList({ items }: { items: ChangeReason[] }) {
  return (
    <div className="market-detail-change-reasons">
      <h3>主要變化原因</h3>
      <ol>
        {items.map((item) => (
          <li key={`${item.label}-${item.text}`}>
            <strong>{item.label}</strong>
            <span>{item.text}</span>
            <small>{item.note}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}

function formatEvidence(item: ExplanationItem) {
  const primary = item.evidence[0];
  if (!primary) return "rule evidence pending";
  return `${primary.ruleId} / ${primary.source}: ${String(primary.value)}`;
}

function findPreviousSnapshot(series: SignalSnapshot[], date: string) {
  for (let index = series.length - 1; index >= 0; index -= 1) {
    const snapshot = series[index];
    if (snapshot.date < date) return snapshot;
  }
  return null;
}

function formatPublicSourceLabel(sourceName: string, isOfficialRuntime: boolean) {
  if (!isOfficialRuntime) return "mock data";
  if (!sourceName || sourceName === "正式資料" || sourceName.toLowerCase().includes("supabase")) return "TWSE OpenAPI";
  return sourceName;
}

function formatDeltaFromPrevious(previous: number | undefined, current: number) {
  if (previous === undefined) return "尚無前一筆比較";
  const delta = current - previous;
  return `${delta >= 0 ? "+" : ""}${delta} vs 前一筆`;
}

function buildTodayChange(previous: SignalSnapshot | null, current: SignalSnapshot) {
  const comparisonDateRange = previous ? `${previous.date} -> ${current.date}` : "尚無前一筆比較";
  const signalChanged = previous ? previous.signal.title !== current.signal.title : false;
  const compositeDelta = previous ? current.compositeScore - previous.compositeScore : 0;
  const riskDelta = previous ? current.riskScore - previous.riskScore : 0;

  if (!previous) {
    return {
      comparisonDateRange,
      compositeDelta: `${current.compositeScore}`,
      compositeNote: "目前只有最新快照，暫不解讀變化方向。",
      riskDelta: `${current.riskScore}`,
      riskNote: "等待更多每日快照後，才顯示風險變化。",
      signalDelta: current.signal.title,
      signalNote: "尚無前一筆燈號可比較。",
      summaryText: `目前台灣市場為「${current.signal.title}」。因尚無前一筆快照，這裡只呈現目前狀態，不宣稱今日變化。`
    };
  }

  const signalText = signalChanged
    ? `市場方向由「${previous.signal.title}」轉為「${current.signal.title}」`
    : `市場方向維持「${current.signal.title}」`;
  const compositeText = compositeDelta === 0 ? "綜合分數沒有變化" : `綜合分數${compositeDelta > 0 ? "上升" : "下降"} ${Math.abs(compositeDelta)} 分`;
  const riskText = riskDelta === 0 ? "風險分數沒有變化" : `風險分數${riskDelta > 0 ? "上升" : "下降"} ${Math.abs(riskDelta)} 分`;

  return {
    comparisonDateRange,
    compositeDelta: `${previous.compositeScore} -> ${current.compositeScore} (${formatSignedNumber(compositeDelta)})`,
    compositeNote: describeCompositeDelta(compositeDelta),
    riskDelta: `${previous.riskScore} -> ${current.riskScore} (${formatSignedNumber(riskDelta)})`,
    riskNote: describeRiskDelta(riskDelta),
    signalDelta: signalChanged ? `${previous.signal.title} -> ${current.signal.title}` : `${current.signal.title}（持續）`,
    signalNote: signalChanged ? "燈號已改變，優先看下方變化原因。" : "燈號未改變，重點放在分數與構面是否正在移動。",
    summaryText: `${signalText}。${compositeText}，${riskText}。下方列出最主要的構面變化，避免只看單一分數。`
  };
}

function describeCompositeDelta(delta: number) {
  if (delta > 0) return "市場健康度改善，但仍要看風險是否同步上升。";
  if (delta < 0) return "市場健康度轉弱，需檢查是趨勢、動能或波動造成。";
  return "綜合分數持平，表示主要構面沒有形成足以改變分數的變化。";
}

function describeRiskDelta(delta: number) {
  if (delta > 0) return "風險升高，需觀察波動是否擴散。";
  if (delta < 0) return "風險下降，代表短線壓力較前一筆緩和。";
  return "風險持平，尚未出現新的擴散訊號。";
}

type ChangeReason = {
  impact: number;
  label: string;
  note: string;
  text: string;
};

function buildMarketChangeDrivers(previous: SignalSnapshot | null, current: SignalSnapshot): ChangeReason[] {
  if (!previous) {
    return [
      {
        impact: current.compositeScore,
        label: "資料累積中",
        note: "rule: previousSnapshot.required",
        text: "目前只有最新快照，尚不能產生前後變化歸因。"
      }
    ];
  }

  const reasons = buildModuleDeltaReasons(previous.modules, current.modules);
  if (reasons.length > 0) return reasons.slice(0, 3);

  return [
    {
      impact: Math.abs(current.compositeScore - previous.compositeScore),
      label: "綜合分數變化",
      note: "rule: compositeScore.delta",
      text: `綜合分數 ${previous.compositeScore} -> ${current.compositeScore} (${formatSignedNumber(current.compositeScore - previous.compositeScore)})。`
    },
    {
      impact: Math.abs(current.riskScore - previous.riskScore),
      label: "風險分數變化",
      note: "rule: riskScore.delta",
      text: `風險分數 ${previous.riskScore} -> ${current.riskScore} (${formatSignedNumber(current.riskScore - previous.riskScore)})。`
    }
  ].filter((item) => item.impact > 0);
}

function buildModuleDeltaReasons(previousModules: ModuleScore[], currentModules: ModuleScore[]) {
  const nonMarketModuleIds = new Set(["quality", "dataQuality", "dataFreshness"]);
  const reasons: ChangeReason[] = [];

  for (const current of currentModules) {
    if (nonMarketModuleIds.has(current.id)) continue;
    const previous = previousModules.find((module) => module.id === current.id);
    if (!previous) continue;

    const healthDelta = current.health - previous.health;
    const riskDelta = current.risk - previous.risk;
    const moduleName = displayModuleName(current);

    if (Math.abs(healthDelta) >= 2) {
      reasons.push({
        impact: Math.abs(healthDelta),
        label: healthDelta > 0 ? `${moduleName}改善` : `${moduleName}轉弱`,
        note: `rule: modules.${current.id}.health / source: modules.${current.id}.health`,
        text: `${moduleName} health ${previous.health} -> ${current.health} (${formatSignedNumber(healthDelta)})。`
      });
    }

    if (Math.abs(riskDelta) >= 2) {
      reasons.push({
        impact: Math.abs(riskDelta),
        label: riskDelta < 0 ? `${moduleName}風險下降` : `${moduleName}風險上升`,
        note: `rule: modules.${current.id}.risk / source: modules.${current.id}.risk`,
        text: `${moduleName} risk ${previous.risk} -> ${current.risk} (${formatSignedNumber(riskDelta)})。`
      });
    }
  }

  return reasons.sort((left, right) => right.impact - left.impact);
}

function buildEvidenceDrivers(snapshot: SignalSnapshot) {
  const marketModules = snapshot.modules.filter((module) => !["quality", "dataQuality", "dataFreshness", "breadth"].includes(module.id));
  const positiveModules = marketModules
    .filter((module) => module.health >= 55 || module.risk <= 35)
    .sort((left, right) => scorePositiveImpact(right) - scorePositiveImpact(left));
  const negativeModules = marketModules
    .filter((module) => module.health < 65 || module.risk >= 45)
    .sort((left, right) => scoreNegativeImpact(right) - scoreNegativeImpact(left));

  return {
    positives: (positiveModules.length > 0 ? positiveModules : marketModules.slice().sort((left, right) => right.health - left.health).slice(0, 1)).map((module) =>
      buildEvidenceDriver(module, "positive")
    ),
    negatives: (negativeModules.length > 0 ? negativeModules : marketModules.slice().sort((left, right) => right.risk - left.risk).slice(0, 1)).map((module) =>
      buildEvidenceDriver(module, "negative")
    )
  };
}

function buildEvidenceDriver(module: ModuleScore, direction: "positive" | "negative"): EvidenceDriver {
  const primaryEvidence = module.evidence?.[0];
  return {
    componentId: module.id,
    direction,
    label: displayModuleName(module),
    note: module.note,
    ruleId: `${direction}-${module.id}-${direction === "positive" ? "health-risk-balance" : "drag-risk-balance"}`,
    source: primaryEvidence?.source ?? `modules.${module.id}.${direction === "positive" ? "health" : "risk"}`,
    sourceValue: primaryEvidence?.value ?? (direction === "positive" ? module.health : module.risk),
    value: `health ${module.health} / risk ${module.risk} / weight ${module.weight}`,
    why:
      direction === "positive"
        ? buildPositiveWhy(module)
        : buildNegativeWhy(module)
  };
}

function buildPositiveWhy(module: ModuleScore) {
  if (module.risk <= 35 && module.health >= 55) {
    return `${displayModuleName(module)}同時呈現較好的 health 與較低 risk，是目前市場狀態的主要支撐。`;
  }
  if (module.risk <= 35) return `${displayModuleName(module)}的 risk 偏低，代表這個構面暫未擴散成主要壓力。`;
  return `${displayModuleName(module)}的 health 仍有支撐，因此拉住整體綜合分數。`;
}

function buildNegativeWhy(module: ModuleScore) {
  if (module.risk >= 45 && module.health < 65) {
    return `${displayModuleName(module)}同時出現 health 不足與 risk 偏高，是目前最需要觀察的拖累構面。`;
  }
  if (module.risk >= 45) return `${displayModuleName(module)}的 risk 偏高，代表這個構面有升溫壓力。`;
  return `${displayModuleName(module)}的 health 還沒有強到足以推升整體燈號。`;
}

function scorePositiveImpact(module: ModuleScore) {
  return module.health + Math.max(0, 45 - module.risk);
}

function scoreNegativeImpact(module: ModuleScore) {
  return 100 - module.health + module.risk;
}

function buildHistoricalContext(series: SignalSnapshot[], current: SignalSnapshot) {
  const samples = series.filter((snapshot) => snapshot.date <= current.date).slice(-252);
  if (samples.length < 30) {
    return {
      compositeNote: `目前只有 ${samples.length} 筆可用樣本，先不宣稱歷史高低。`,
      compositePosition: "樣本不足",
      riskNote: "等待更多每日資料累積後，再判斷風險分數在歷史中的位置。",
      riskPosition: "樣本不足",
      summary: "目前歷史資料仍在累積中。當樣本足夠後，這裡會顯示目前分數在可用歷史資料中的位置。"
    };
  }

  const compositeAverage = average(samples.map((snapshot) => snapshot.compositeScore));
  const riskAverage = average(samples.map((snapshot) => snapshot.riskScore));
  const compositePercentile = Math.round(
    (samples.filter((snapshot) => snapshot.compositeScore <= current.compositeScore).length / samples.length) * 100
  );
  const riskPercentile = Math.round(
    (samples.filter((snapshot) => snapshot.riskScore <= current.riskScore).length / samples.length) * 100
  );

  return {
    compositeNote: `目前 ${current.compositeScore} 分，高於 ${compositePercentile}% 的可用歷史樣本；可用樣本平均 ${compositeAverage} 分。`,
    compositePosition: describeHistoricalBand(compositePercentile),
    riskNote: `目前 ${current.riskScore} 分，高於 ${riskPercentile}% 的可用歷史樣本；可用樣本平均 ${riskAverage} 分。`,
    riskPosition: describeHistoricalBand(riskPercentile),
    summary: `用最近 ${samples.length} 筆可用資料比較，目前綜合分數位於${describeHistoricalBand(compositePercentile)}，風險分數位於${describeHistoricalBand(riskPercentile)}。這是歷史脈絡，不是未來預測。`
  };
}

function buildSignalHistory(series: SignalSnapshot[]) {
  const items = series.slice(-30);
  if (items.length === 0) {
    return {
      detail: "目前沒有足夠資料形成燈號脈絡。",
      items,
      summary: "尚無可用燈號歷史。"
    };
  }

  const latest = items[items.length - 1];
  if (items.length === 1) {
    return {
      detail: `目前只有 ${latest.date} 一筆燈號資料。`,
      items,
      summary: `目前最新燈號為「${latest.signal.title}」，尚不能判斷是否形成趨勢。`
    };
  }

  const weakOrRiskCount = items.filter((snapshot) => getSignalToneClass(snapshot) === "is-weak" || getSignalToneClass(snapshot) === "is-risk").length;
  const first = items[0];

  return {
    detail: `${first.date} -> ${latest.date}，共 ${items.length} 筆；其中 ${weakOrRiskCount} 筆落在較弱或較高風險區間。`,
    items,
    summary: `最近 ${items.length} 筆燈號中，最新為「${latest.signal.title}」。用這段脈絡判斷目前燈號是延續還是剛轉向。`
  };
}

function buildNextObservation(current: SignalSnapshot, topNegative: EvidenceDriver | undefined) {
  if (current.riskScore >= 45) {
    return `下一次更新先觀察風險分數是否繼續升高，並檢查 ${topNegative?.label ?? "主要風險構面"} 是否擴散。這是風險觀察，不是買賣指令。`;
  }
  if (current.compositeScore >= 62) {
    return `下一次更新先觀察綜合分數是否維持，以及 ${topNegative?.label ?? "較弱構面"} 是否開始拖累。這頁只提供市場狀態解釋。`;
  }
  return `下一次更新先觀察 ${topNegative?.label ?? "動能或趨勢"} 是否改善；如果分數仍停在中間區間，就代表市場尚未給出更明確方向。`;
}

function describeHistoricalBand(percentile: number) {
  if (percentile <= 40) return "較低區間";
  if (percentile >= 66) return "較高區間";
  return "中間區間";
}

function formatSignedNumber(value: number) {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function getSignalToneClass(snapshot: SignalSnapshot) {
  if (snapshot.riskScore >= 60 || snapshot.compositeScore < 34) return "is-risk";
  if (snapshot.riskScore >= 45 || snapshot.compositeScore < 48) return "is-weak";
  if (snapshot.compositeScore >= 62 && snapshot.riskScore < 45) return "is-strong";
  return "is-neutral";
}

function displayModuleName(module: ModuleScore) {
  return module.label ?? module.name ?? module.id;
}

function describeRiskRegime(riskScore: number) {
  if (riskScore >= 60) {
    return {
      label: "高風險",
      title: "風險正在擴散",
      text: "風險分數偏高，代表市場波動或壓力已經升溫。此時應優先看風險來源，而不是只看綜合分數。"
    };
  }
  if (riskScore >= 45) {
    return {
      label: "風險升溫",
      title: "風險處於中段偏高",
      text: "風險分數位於中段偏高，代表市場還沒有失控，但需要觀察波動是否擴散。"
    };
  }
  return {
    label: "風險偏低",
    title: "風險尚未擴散",
    text: "風險分數偏低，代表目前主要壓力尚未擴散。不過仍需搭配趨勢與動能判斷。"
  };
}
