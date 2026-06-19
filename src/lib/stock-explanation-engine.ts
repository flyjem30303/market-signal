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
  positive: (module: ModuleScore) => string;
  negative: (module: ModuleScore) => string;
  watch: (module: ModuleScore) => string;
};

const factorRules: Record<string, FactorRule> = {
  trend: {
    label: "趨勢",
    positive: () => "趨勢分數仍有支撐，代表價格與綜合分數尚未同步轉弱。",
    negative: () => "趨勢分數偏弱，代表價格結構或綜合分數已開始失去延續力。",
    watch: () => "下一次更新先看趨勢分數是否回升，避免只用單日漲跌判斷方向。"
  },
  momentum: {
    label: "動能",
    positive: () => "收盤相對開盤仍有推升力，短線買盤沒有明顯退潮。",
    negative: () => "收盤相對開盤缺乏推升力，短線動能是目前主要拖累。",
    watch: () => "下一次更新先看收盤是否能重新站回開盤之上，確認動能是否修復。"
  },
  volatility: {
    label: "波動",
    positive: () => "盤中震盪幅度受控，代表短線風險沒有明顯放大。",
    negative: () => "盤中震盪幅度偏大，代表價格波動正在拉低判讀穩定度。",
    watch: () => "下一次更新先看盤中高低差是否收斂，確認風險是否降溫。"
  },
  valuation: {
    label: "估值",
    positive: () => "估值壓力未明顯升高，分數沒有被過熱條件明顯拖累。",
    negative: () => "估值壓力偏高，分數受到評價風險拖累。",
    watch: () => "若後續補上估值資料，應優先確認分數是否被過熱或低估條件影響。"
  },
  breadth: {
    label: "市場廣度",
    positive: () => "市場廣度較佳，代表支撐不只集中在少數標的。",
    negative: () => "市場廣度不足，代表分數可能由少數標的撐住，延續性較需要確認。",
    watch: () => "下一次更新先看上漲擴散是否改善，確認支撐是否變廣。"
  },
  flow: {
    label: "資金",
    positive: () => "資金條件偏正向，代表追價或承接意願仍有支撐。",
    negative: () => "資金條件偏弱，代表分數受到買盤延續性不足拖累。",
    watch: () => "後續若補上資金資料，應優先確認買盤是否連續改善。"
  },
  macro: {
    label: "總體",
    positive: () => "總體風險沒有明顯壓低分數，市場背景相對穩定。",
    negative: () => "總體風險偏高，市場背景正在壓低分數穩定度。",
    watch: () => "下一次更新需同步看總體風險是否延續升高。"
  }
};

const nonMarketModuleIds = new Set(["quality", "dataQuality", "dataFreshness"]);

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
          ? "風險分數沒有明顯升高，代表目前並非高壓力狀態。"
          : "綜合分數仍保留部分支撐，但需要更多模組確認原因。",
      impact: Math.max(1, snapshot.riskScore <= 45 ? 100 - snapshot.riskScore : snapshot.compositeScore),
      evidence: [evidence("fallback-positive-from-score", snapshot.riskScore <= 45 ? "riskScore" : "compositeScore", snapshot.riskScore <= 45 ? snapshot.riskScore : snapshot.compositeScore)]
    }
  ];
}

function buildNegativeItems(snapshot: SignalSnapshot, modules: ModuleScore[]) {
  const candidates = selectNegativeModules(modules).map((module) => buildNegativeFactor(module));
  if (candidates.length > 0) return candidates;

  return [
    {
      text: "目前缺少足夠模組拆解分數，應先把本次分數視為方向參考。",
      impact: Math.max(1, 100 - snapshot.compositeScore),
      evidence: [evidence("fallback-negative-from-composite-score", "compositeScore", snapshot.compositeScore)]
    }
  ];
}

function buildPositiveFactor(module: ModuleScore): ExplanationItem {
  const impact = Math.round(module.health * (module.weight / 100) + Math.max(0, 45 - module.risk) * 0.16);
  const rule = factorRules[module.id];

  return {
    text: rule?.positive(module) ?? `${displayModuleName(module)}相對支撐分數，仍需搭配其他模組確認。`,
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
    text: rule?.negative(module) ?? `${displayModuleName(module)}目前拉低分數，應先確認其資料來源與變化方向。`,
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
      ? "目前分數仍偏正向"
      : snapshot.compositeScore >= 48
        ? "目前分數落在中間區間"
        : "目前分數偏弱";
  const riskTone = snapshot.riskScore >= 60 ? "風險分數偏高" : snapshot.riskScore >= 45 ? "風險需要同步觀察" : "風險分數尚未明顯升高";
  const confidenceTone = confidence.score < 65 ? "但判讀信心偏低" : "且判讀信心可作為方向參考";

  return `${scoreTone}，燈號屬於「${scoreLevel}」；${riskTone}，${confidenceTone}。`;
}

function buildLongTermView(snapshot: SignalSnapshot, confidence: StockExplanation["confidence"]) {
  if (confidence.score < 65) {
    return "長期或定期定額投資人可以把本頁當成市場溫度參考，但不宜只依這次分數改變原本節奏。";
  }
  if (snapshot.riskScore >= 60) {
    return "長期或定期定額投資人應先確認自身風險承受度，因為目前風險分數已經偏高。";
  }
  return "長期或定期定額投資人可維持原本觀察節奏，並持續追蹤分數是否連續改善或轉弱。";
}

function buildShortTermView(snapshot: SignalSnapshot, weakest: ExplanationItem) {
  if (snapshot.compositeScore >= 62 && snapshot.riskScore < 45) {
    return "短線想加碼的投資人仍應等待下一次資料確認，避免只因單日分數偏強就追價。";
  }

  return `短線想加碼的投資人應先看主要拖累是否改善；目前最需要確認的是：${weakest.text}`;
}

function buildDecisionContext(
  snapshot: SignalSnapshot,
  strongest: ExplanationItem,
  weakest: ExplanationItem,
  confidence: StockExplanation["confidence"]
): ExplanationItem[] {
  return [
    {
      text: `下一次更新先看「${watchLabelFromEvidence(weakest.evidence[0])}」是否改善，這會決定分數能否脫離目前區間。`,
      impact: weakest.impact,
      evidence: [evidence("decision-context-top-negative", weakest.evidence[0]?.source ?? "compositeScore", weakest.evidence[0]?.value ?? snapshot.compositeScore)]
    },
    {
      text: `同時保留「${watchLabelFromEvidence(strongest.evidence[0])}」作為支撐檢查，確認加分因素是否延續。`,
      impact: strongest.impact,
      evidence: [evidence("decision-context-top-positive", strongest.evidence[0]?.source ?? "compositeScore", strongest.evidence[0]?.value ?? snapshot.compositeScore)]
    },
    {
      text:
        confidence.score < 65
          ? "因為資料完整度或缺漏因子限制，本次判讀只能作為方向參考，不能當成單一決策依據。"
          : "若分數與主要因素連續改善，下一步再看是否形成更穩定的市場狀態。",
      impact: confidence.score,
      evidence: confidence.evidence
    }
  ];
}

function buildConfidence(snapshot: SignalSnapshot, seriesLength: number): StockExplanation["confidence"] {
  const stalePenalty = snapshot.staleDataFlags.length * 10;
  const missingPenalty = snapshot.missingModuleFlags.length * 8;
  const samplePenalty = seriesLength >= 60 ? 0 : seriesLength >= 30 ? 5 : 12;
  const score = clamp(Math.round(snapshot.dataQualityScore - stalePenalty - missingPenalty - samplePenalty), 30, 95);
  const sampleDepth = seriesLength >= 60 ? "充足" : seriesLength >= 30 ? "中等" : "不足";
  const missingText =
    snapshot.missingModuleFlags.length > 0 ? `缺漏因子 ${snapshot.missingModuleFlags.length} 項` : "沒有缺漏因子";
  const staleText =
    snapshot.staleDataFlags.length > 0 ? `資料延遲旗標 ${snapshot.staleDataFlags.length} 項` : "目前未標記資料延遲";

  return {
    score,
    level: score >= 80 ? "高" : score >= 65 ? "中" : "低",
    dataQuality: snapshot.dataQualityScore,
    sampleDepth,
    missingInputs: snapshot.missingModuleFlags,
    staleInputs: snapshot.staleDataFlags,
    note: `資料日期 ${snapshot.date}；${missingText}；${staleText}；樣本深度${sampleDepth}。這些項目會影響判讀信心，但不會被當成市場漲跌原因。`,
    evidence: [
      evidence("confidence-from-data-quality", "dataQualityScore", snapshot.dataQualityScore),
      evidence("confidence-from-stale-flags", "staleDataFlags.length", snapshot.staleDataFlags.length),
      evidence("confidence-from-missing-flags", "missingModuleFlags.length", snapshot.missingModuleFlags.length),
      evidence("confidence-from-series-length", "series.length", seriesLength)
    ]
  };
}

function getScoreLevel(score: number) {
  if (score >= 75) return "偏強";
  if (score >= 62) return "中性偏多";
  if (score >= 48) return "觀望";
  if (score >= 34) return "轉弱";
  return "高風險";
}

function displayModuleName(module: ModuleScore) {
  return factorRules[module.id]?.label ?? module.label ?? module.name;
}

function watchLabelFromEvidence(item: ExplanationEvidence | undefined) {
  if (!item) return "綜合分數";
  if (item.source.includes(".health")) return "模組健康分數";
  if (item.source.includes(".risk")) return "模組風險分數";
  if (item.source.includes("open_close_return")) return "收盤相對開盤動能";
  if (item.source.includes("intraday_range")) return "盤中波動幅度";
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
