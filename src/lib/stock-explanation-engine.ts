import type { ModuleScore, SignalSnapshot } from "./signal-model";

export type ExplanationEvidence = {
  ruleId: string;
  source: string;
  value: number | string | boolean;
};

export type ExplanationItem = {
  text: string;
  impact: number;
  evidence: ExplanationEvidence[];
};

export type StockExplanation = {
  scoreLevel: string;
  summary: ExplanationItem;
  positives: ExplanationItem[];
  negatives: ExplanationItem[];
  longTermView: ExplanationItem;
  shortTermView: ExplanationItem;
  decisionContext: ExplanationItem[];
  confidence: {
    score: number;
    level: string;
    dataQuality: number;
    sampleDepth: string;
    missingInputs: string[];
    staleInputs: string[];
    note: string;
    evidence: ExplanationEvidence[];
  };
};

type BuildExplanationOptions = {
  seriesLength?: number;
};

type FactorRule = {
  label: string;
  positive: string;
  negative: string;
  watch: string;
};

const factorRules: Record<string, FactorRule> = {
  trend: {
    label: "趨勢延續力",
    positive: "趨勢分數相對穩定，代表價格位置與整體分數仍有支撐。",
    negative: "趨勢分數偏弱，代表價格方向還沒有形成足夠延續力。",
    watch: "後續可看趨勢分數是否回升，確認市場方向是否重新變清楚。"
  },
  momentum: {
    label: "價格動能",
    positive: "價格動能由開盤到收盤變化推估，今日收盤相對開盤仍有推升力。",
    negative: "價格動能由開盤到收盤變化推估，今日收盤相對開盤缺乏推升力。",
    watch: "下一步看收盤相對開盤是否改善，避免只用單日漲跌判斷強弱。"
  },
  volatility: {
    label: "波動風險",
    positive: "盤中高低區間沒有明顯放大，短線波動壓力相對可控。",
    negative: "盤中高低區間放大，代表價格震盪增加，短線判讀要更保守。",
    watch: "後續可看盤中高低區間是否收斂，確認波動是否降溫。"
  },
  valuation: {
    label: "估值壓力",
    positive: "估值壓力沒有明顯升高，價格沒有呈現過熱訊號。",
    negative: "估值壓力偏高，價格可能已反映較多樂觀預期。",
    watch: "後續可看估值壓力是否與價格動能同步改善。"
  },
  breadth: {
    label: "市場廣度",
    positive: "市場廣度較佳，代表支撐不是只集中在少數標的。",
    negative: "市場廣度不足，代表支撐可能集中在少數標的。",
    watch: "後續可看市場廣度是否擴散到更多族群。"
  },
  flow: {
    label: "資金動向",
    positive: "資金動向偏正面，代表市場仍有追蹤與承接意願。",
    negative: "資金動向不足，代表追價意願或承接力偏弱。",
    watch: "後續可看資金動向是否回到較穩定的流入狀態。"
  },
  macro: {
    label: "總體風險",
    positive: "總體風險沒有明顯惡化，市場背景相對穩定。",
    negative: "總體風險偏高，可能壓抑市場風險承受度。",
    watch: "後續可看外部風險是否繼續影響市場分數。"
  }
};

const nonMarketModuleIds = new Set(["quality", "dataQuality", "dataFreshness"]);
const deferredMissingFlagMatchers = [
  "valuation",
  "fund_flow",
  "fundflow",
  "fund-flow",
  "fund flow",
  "news_score",
  "news",
  "sentiment"
];

export function buildStockExplanation(snapshot: SignalSnapshot, options: BuildExplanationOptions = {}): StockExplanation {
  const marketModules = snapshot.modules.filter((module) => !nonMarketModuleIds.has(module.id));
  const positives = buildPositiveItems(snapshot, marketModules).sort(sortByImpact).slice(0, 3);
  const negatives = buildNegativeItems(snapshot, marketModules).sort(sortByImpact).slice(0, 3);
  const strongest = positives[0];
  const weakest = negatives[0];
  const confidence = buildConfidence(snapshot, options.seriesLength ?? 0);
  const scoreLevel = getScoreLevel(snapshot.compositeScore);

  return {
    scoreLevel,
    summary: {
      text: buildSummaryText(snapshot, scoreLevel, confidence),
      impact: snapshot.compositeScore,
      evidence: [
        evidence("score-level-from-composite", "compositeScore", snapshot.compositeScore),
        evidence("risk-band-from-risk-score", "riskScore", snapshot.riskScore)
      ]
    },
    positives,
    negatives,
    longTermView: {
      text: buildLongTermView(snapshot, confidence),
      impact: 100 - snapshot.riskScore,
      evidence: [
        evidence("long-term-view-from-risk-score", "riskScore", snapshot.riskScore),
        evidence("long-term-view-from-confidence", "confidence.score", confidence.score)
      ]
    },
    shortTermView: {
      text: buildShortTermView(snapshot, weakest),
      impact: weakest.impact,
      evidence: [
        evidence("short-term-view-from-top-negative", weakest.evidence[0]?.source ?? "compositeScore", weakest.evidence[0]?.value ?? snapshot.compositeScore),
        evidence("short-term-view-from-composite", "compositeScore", snapshot.compositeScore)
      ]
    },
    decisionContext: buildDecisionContext(snapshot, strongest, weakest, confidence),
    confidence
  };
}

function buildPositiveItems(snapshot: SignalSnapshot, modules: ModuleScore[]) {
  const candidates = selectPositiveModules(modules).map((module) => buildPositiveFactor(module));
  if (candidates.length > 0) return candidates;

  return [
    {
      text:
        snapshot.riskScore <= 45
          ? "風險分數目前不高，代表短線波動壓力相對可控。"
          : "綜合分數仍保留部分支撐，但需要更多市場因子補強。",
      impact: Math.max(1, snapshot.riskScore <= 45 ? 100 - snapshot.riskScore : snapshot.compositeScore),
      evidence: [
        evidence(
          "fallback-positive-from-score",
          snapshot.riskScore <= 45 ? "riskScore" : "compositeScore",
          snapshot.riskScore <= 45 ? snapshot.riskScore : snapshot.compositeScore
        )
      ]
    }
  ];
}

function buildNegativeItems(snapshot: SignalSnapshot, modules: ModuleScore[]) {
  const candidates = selectNegativeModules(modules).map((module) => buildNegativeFactor(module));
  if (candidates.length > 0) return candidates;

  return [
    {
      text: "目前缺少足夠明確的市場加分因子，分數仍需要用較保守的方式解讀。",
      impact: Math.max(1, 100 - snapshot.compositeScore),
      evidence: [evidence("fallback-negative-from-composite-score", "compositeScore", snapshot.compositeScore)]
    }
  ];
}

function buildPositiveFactor(module: ModuleScore): ExplanationItem {
  const impact = Math.round(module.health * (module.weight / 100) + Math.max(0, 45 - module.risk) * 0.16);
  const rule = factorRules[module.id];

  return {
    text: rule?.positive ?? `${displayModuleName(module)}分數較佳，對綜合分數形成支撐。`,
    impact,
    evidence: [
      evidence(`positive-${module.id}-health`, `modules.${module.id}.health`, module.health),
      evidence(`positive-${module.id}-risk`, `modules.${module.id}.risk`, module.risk),
      evidence(`positive-${module.id}-weight`, `modules.${module.id}.weight`, module.weight),
      ...moduleEvidence(module, "positive")
    ]
  };
}

function buildNegativeFactor(module: ModuleScore): ExplanationItem {
  const impact = Math.round((100 - module.health) * (module.weight / 100) + module.risk * 0.22);
  const rule = factorRules[module.id];

  return {
    text: rule?.negative ?? `${displayModuleName(module)}分數偏弱，是目前拖累綜合分數的因素之一。`,
    impact,
    evidence: [
      evidence(`negative-${module.id}-health`, `modules.${module.id}.health`, module.health),
      evidence(`negative-${module.id}-risk`, `modules.${module.id}.risk`, module.risk),
      evidence(`negative-${module.id}-weight`, `modules.${module.id}.weight`, module.weight),
      ...moduleEvidence(module, "negative")
    ]
  };
}

function selectPositiveModules(modules: ModuleScore[]) {
  const selected = modules.filter((module) => module.health >= 50 || module.risk <= 35);
  return selected.length > 0 ? selected : modules.slice().sort((left, right) => right.health - left.health).slice(0, 1);
}

function selectNegativeModules(modules: ModuleScore[]) {
  const selected = modules.filter((module) => module.health < 65 || module.risk >= 45);
  return selected.length > 0 ? selected : modules.slice().sort((left, right) => right.risk - left.risk).slice(0, 1);
}

function buildSummaryText(snapshot: SignalSnapshot, scoreLevel: string, confidence: StockExplanation["confidence"]) {
  const scoreTone =
    snapshot.compositeScore >= 62
      ? "綜合分數偏強"
      : snapshot.compositeScore >= 48
        ? "綜合分數位於中間區間"
        : "綜合分數偏弱";
  const riskTone =
    snapshot.riskScore >= 60
      ? "風險分數偏高"
      : snapshot.riskScore >= 45
        ? "風險分數中等"
        : "風險分數相對可控";
  const confidenceTone = confidence.score < 65 ? "但判讀信心偏低" : "且判讀信心足夠作為方向參考";

  return `${scoreTone}，目前屬於「${scoreLevel}」區間；${riskTone}，${confidenceTone}。`;
}

function buildLongTermView(snapshot: SignalSnapshot, confidence: StockExplanation["confidence"]) {
  if (confidence.score < 65) {
    return "長期或定期投入者可把本頁當作市場溫度參考，但不宜只依賴分數；需同步看資料日期、缺漏因子與風險提示。";
  }
  if (snapshot.riskScore >= 60) {
    return "長期或定期投入者可繼續觀察，但應先確認自身承受度，因為風險分數偏高。";
  }
  return "長期或定期投入者可把目前訊號作為市場溫度參考，再搭配自己的固定投資流程。";
}

function buildShortTermView(snapshot: SignalSnapshot, weakest: ExplanationItem) {
  if (snapshot.compositeScore >= 62 && snapshot.riskScore < 45) {
    return "短期觀察者可優先確認價格動能與風險分數是否同步改善，再判斷訊號是否延續。";
  }

  return `短期觀察者應先看最大拖累因素是否改善：${weakest.text}`;
}

function buildDecisionContext(
  snapshot: SignalSnapshot,
  strongest: ExplanationItem,
  weakest: ExplanationItem,
  confidence: StockExplanation["confidence"]
): ExplanationItem[] {
  return [
    {
      text: `下一次更新先看「${watchLabelFromEvidence(weakest.evidence[0])}」是否改善，這會影響分數能否脫離目前區間。`,
      impact: weakest.impact,
      evidence: [
        evidence("decision-context-top-negative", weakest.evidence[0]?.source ?? "compositeScore", weakest.evidence[0]?.value ?? snapshot.compositeScore)
      ]
    },
    {
      text: `再看「${watchLabelFromEvidence(strongest.evidence[0])}」能否維持，確認主要支撐不是單日現象。`,
      impact: strongest.impact,
      evidence: [
        evidence("decision-context-top-positive", strongest.evidence[0]?.source ?? "compositeScore", strongest.evidence[0]?.value ?? snapshot.compositeScore)
      ]
    },
    {
      text:
        confidence.score < 65
          ? "因為資料缺漏或樣本深度仍有限，本次解讀只適合作為方向參考。"
          : "資料品質與樣本深度目前足以支撐本頁的方向性解讀。",
      impact: confidence.score,
      evidence: confidence.evidence
    }
  ];
}

function buildConfidence(snapshot: SignalSnapshot, seriesLength: number): StockExplanation["confidence"] {
  const missingInputs = filterPhase1MissingInputs(snapshot.missingModuleFlags);
  const stalePenalty = snapshot.staleDataFlags.length * 10;
  const missingPenalty = missingInputs.length * 8;
  const samplePenalty = seriesLength >= 60 ? 0 : seriesLength >= 30 ? 5 : 12;
  const score = clamp(Math.round(snapshot.dataQualityScore - stalePenalty - missingPenalty - samplePenalty), 30, 95);
  const sampleDepth = seriesLength >= 60 ? "足夠" : seriesLength >= 30 ? "中等" : "不足";
  const missingText = missingInputs.length > 0 ? `缺漏因子 ${missingInputs.length} 項` : "沒有缺漏因子";
  const staleText = snapshot.staleDataFlags.length > 0 ? `資料延遲 ${snapshot.staleDataFlags.length} 項` : "沒有資料延遲";

  return {
    score,
    level: score >= 80 ? "高" : score >= 65 ? "中" : "低",
    dataQuality: snapshot.dataQualityScore,
    sampleDepth,
    missingInputs,
    staleInputs: snapshot.staleDataFlags,
    note: `資料日期 ${snapshot.date}，資料完整度 ${snapshot.dataQualityScore}/100，${missingText}，${staleText}，歷史樣本深度${sampleDepth}。這些只影響判讀信心，不作為市場正負原因。`,
    evidence: [
      evidence("confidence-from-data-quality", "dataQualityScore", snapshot.dataQualityScore),
      evidence("confidence-from-stale-flags", "staleDataFlags.length", snapshot.staleDataFlags.length),
      evidence("confidence-from-missing-flags", "missingModuleFlags.length", missingInputs.length),
      evidence("confidence-from-series-length", "series.length", seriesLength)
    ]
  };
}

function filterPhase1MissingInputs(flags: string[]) {
  return flags.filter((flag) => {
    const normalized = flag.toLowerCase();
    return !deferredMissingFlagMatchers.some((matcher) => normalized.includes(matcher));
  });
}

function getScoreLevel(score: number) {
  if (score >= 75) return "偏強";
  if (score >= 62) return "中性偏多";
  if (score >= 48) return "中性";
  if (score >= 34) return "偏弱";
  return "高風險";
}

function displayModuleName(module: ModuleScore) {
  return factorRules[module.id]?.label ?? module.label ?? module.name;
}

function watchLabelFromEvidence(item: ExplanationEvidence | undefined) {
  if (!item) return "綜合分數";
  if (item.source.includes(".health")) return "模組健康分數";
  if (item.source.includes(".risk")) return "模組風險分數";
  if (item.source.includes("open_close_return")) return "價格動能";
  if (item.source.includes("intraday_range")) return "波動風險";
  if (item.source.includes("compositeScore")) return "綜合分數";
  if (item.source.includes("riskScore")) return "風險分數";
  return item.source.replace(/_/g, " ");
}

function evidence(ruleId: string, source: string, value: number | string | boolean): ExplanationEvidence {
  return { ruleId, source, value };
}

function moduleEvidence(module: ModuleScore, direction: "positive" | "negative"): ExplanationEvidence[] {
  return (module.evidence ?? []).map((item) => ({
    ruleId: `${direction}-${module.id}-${item.ruleId}`,
    source: item.source,
    value: item.value
  }));
}

function sortByImpact(left: ExplanationItem, right: ExplanationItem) {
  return right.impact - left.impact;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
