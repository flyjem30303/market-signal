import type { SignalSnapshot } from "@/lib/signal-model";

type ActionTone = "active" | "hold" | "blocked";
type ActionTab = "today" | "trend" | "technical" | "fundamentals" | "backtest";

export type InvestorActionItem = {
  body: string;
  label: string;
  tab: ActionTab;
  title: string;
  tone: ActionTone;
};

export type InvestorActionSummary = {
  headline: string;
  observationFocus: InvestorActionItem;
  primaryRisk: InvestorActionItem;
  safetyLine: string;
  stopCondition: InvestorActionItem;
};

export function buildInvestorActionSummary(snapshot: SignalSnapshot): InvestorActionSummary {
  const hasDataWarnings = snapshot.missingModuleFlags.length > 0 || snapshot.staleDataFlags.length > 0;
  const riskiestModule = snapshot.modules.reduce((highest, module) => (module.risk > highest.risk ? module : highest));

  const observationFocus = getObservationFocus(snapshot, hasDataWarnings);
  const primaryRisk: InvestorActionItem = {
    body:
      snapshot.riskScore >= 60
        ? `${riskiestModule.name}風險最高，先看風險來源與分數是否連續升溫。`
        : `${riskiestModule.name}仍是主要觀察點，先確認它是否會拖累整體分數。`,
    label: "主要風險",
    tab: "technical",
    title: `${riskiestModule.name} ${riskiestModule.risk}/100`,
    tone: snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "hold" : "active"
  };
  const stopCondition: InvestorActionItem = {
    body: hasDataWarnings
      ? "資料缺口或過期旗標未清除前，停止把分數升級成投資判斷。"
      : "真實資料、來源深度與正式模型未核准前，停止產生買賣結論。",
    label: "停止條件",
    tab: hasDataWarnings ? "today" : "backtest",
    title: hasDataWarnings ? "先補資料旗標" : "不升級結論",
    tone: "blocked"
  };

  return {
    headline: getHeadline(snapshot, hasDataWarnings),
    observationFocus,
    primaryRisk,
    safetyLine: "目前仍是 mock-only 閱讀摘要，publicDataSource=mock、scoreSource=mock，不提供買賣建議。",
    stopCondition
  };
}

function getHeadline(snapshot: SignalSnapshot, hasDataWarnings: boolean) {
  if (hasDataWarnings) {
    return `${snapshot.asset.symbol} 先確認資料可靠度，再看分數`;
  }

  if (snapshot.riskScore >= 70) {
    return `${snapshot.asset.symbol} 風險升溫，先拆解風險來源`;
  }

  if (snapshot.healthScore >= 70) {
    return `${snapshot.asset.symbol} 健康度較高，觀察趨勢能否延續`;
  }

  return `${snapshot.asset.symbol} 維持觀察，先看分數是否連續`;
}

function getObservationFocus(snapshot: SignalSnapshot, hasDataWarnings: boolean): InvestorActionItem {
  if (hasDataWarnings) {
    return {
      body: "資料旗標未清前，今日摘要比任何分數更優先。",
      label: "觀察重點",
      tab: "today",
      title: "資料可靠度",
      tone: "blocked"
    };
  }

  if (snapshot.riskScore >= 60) {
    return {
      body: "風險分數偏高，先看波動、技術與估值壓力是否同步升溫。",
      label: "觀察重點",
      tab: "technical",
      title: "風險拆解",
      tone: "hold"
    };
  }

  if (snapshot.healthScore >= 70) {
    return {
      body: "健康度有支撐時，先看趨勢模組是否與相對位置一致。",
      label: "觀察重點",
      tab: "trend",
      title: "趨勢延續",
      tone: "active"
    };
  }

  return {
    body: "分數沒有明顯優勢時，先看基本面與回測模組是否支持觀察。",
    label: "觀察重點",
    tab: "fundamentals",
    title: "等待確認",
    tone: "hold"
  };
}
