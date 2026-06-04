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
        ? `${riskiestModule.name} 風險偏高，先看風險來源與是否需要降低曝險，再看分數機會。`
        : `${riskiestModule.name} 目前是主要觀察風險，仍可搭配趨勢與基本面確認是否一致。`,
    label: "查看主要風險",
    tab: "technical",
    title: `${riskiestModule.name} ${riskiestModule.risk}/100`,
    tone: snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "hold" : "active"
  };
  const stopCondition: InvestorActionItem = {
    body: hasDataWarnings
      ? "資料缺口尚未解除，暫停把 mock 分數當成任何正式判斷，只能先做資料品質確認。"
      : "若風險分數快速升高、資料品質下降或來源仍未通過 gate，應先停止放大解讀。",
    label: "停看條件",
    tab: hasDataWarnings ? "today" : "backtest",
    title: hasDataWarnings ? "資料未完整" : "風險邊界",
    tone: "blocked"
  };

  return {
    headline: getHeadline(snapshot, hasDataWarnings),
    observationFocus,
    primaryRisk,
    safetyLine:
      "目前所有行動摘要都只是 mock-only runtime 輔助解讀；publicDataSource=mock，scoreSource=mock，不構成投資建議。",
    stopCondition
  };
}

function getHeadline(snapshot: SignalSnapshot, hasDataWarnings: boolean) {
  if (hasDataWarnings) {
    return `${snapshot.asset.symbol} 資料仍不完整，先處理品質與來源邊界。`;
  }

  if (snapshot.riskScore >= 70) {
    return `${snapshot.asset.symbol} 風險明顯偏高，先檢查回撤壓力。`;
  }

  if (snapshot.healthScore >= 70) {
    return `${snapshot.asset.symbol} 健康度偏強，但仍要同步檢查風險。`;
  }

  return `${snapshot.asset.symbol} 處於觀察區，先看趨勢與風險是否收斂。`;
}

function getObservationFocus(snapshot: SignalSnapshot, hasDataWarnings: boolean): InvestorActionItem {
  if (hasDataWarnings) {
    return {
      body: "資料品質或來源狀態仍有缺口，先查看今日摘要中的 freshness、missing modules 與 mock 邊界。",
      label: "查看資料品質",
      tab: "today",
      title: "資料品質檢查",
      tone: "blocked"
    };
  }

  if (snapshot.riskScore >= 60) {
    return {
      body: "風險分數已升高，優先查看技術面與風險模組，確認是否有回撤壓力擴散。",
      label: "查看風險",
      tab: "technical",
      title: "風險升溫",
      tone: "hold"
    };
  }

  if (snapshot.healthScore >= 70) {
    return {
      body: "健康度偏強，可先看趨勢是否延續，再比對基本面與資料品質是否支持。",
      label: "查看趨勢",
      tab: "trend",
      title: "趨勢確認",
      tone: "active"
    };
  }

  return {
    body: "分數尚未形成明確方向，先比較趨勢、基本面與風險模組，避免只看單一指標。",
    label: "查看模組",
    tab: "fundamentals",
    title: "等待確認",
    tone: "hold"
  };
}
