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
        ? `${riskiestModule.name} 風險偏高，先確認風險來源、資料狀態與是否應停止閱讀。`
        : `${riskiestModule.name} 是目前相對需要留意的模組，可作為第二層檢查，不宜單看總分。`,
    label: "主要風險",
    tab: "technical",
    title: `${riskiestModule.name} ${riskiestModule.risk}/100`,
    tone: snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "hold" : "active"
  };
  const stopCondition: InvestorActionItem = {
    body: hasDataWarnings
      ? "資料缺口或過期旗標存在時，先停止投資解讀，只保留產品流程與揭露測試。"
      : "若風險、回測或資料新鮮度互相衝突，應回到模組明細確認，不直接採用燈號。",
    label: "停止條件",
    tab: hasDataWarnings ? "today" : "backtest",
    title: hasDataWarnings ? "資料不足" : "需要交叉驗證",
    tone: "blocked"
  };

  return {
    headline: getHeadline(snapshot, hasDataWarnings),
    observationFocus,
    primaryRisk,
    safetyLine:
      "目前所有行動摘要皆為 mock-only 決策輔助；publicDataSource=mock，scoreSource=mock，不能視為投資建議。",
    stopCondition
  };
}

function getHeadline(snapshot: SignalSnapshot, hasDataWarnings: boolean) {
  if (hasDataWarnings) {
    return `${snapshot.asset.symbol} 先處理資料缺口，再閱讀燈號。`;
  }

  if (snapshot.riskScore >= 70) {
    return `${snapshot.asset.symbol} 風險偏高，先看風險模組與停用條件。`;
  }

  if (snapshot.healthScore >= 70) {
    return `${snapshot.asset.symbol} 模組健康度較佳，可先看趨勢再回看風險。`;
  }

  return `${snapshot.asset.symbol} 訊號中性，建議用模組交叉檢查。`;
}

function getObservationFocus(snapshot: SignalSnapshot, hasDataWarnings: boolean): InvestorActionItem {
  if (hasDataWarnings) {
    return {
      body: "資料品質尚未完整，先閱讀今日摘要中的缺口與過期旗標，再決定是否繼續看其他模組。",
      label: "先看資料品質",
      tab: "today",
      title: "資料缺口檢查",
      tone: "blocked"
    };
  }

  if (snapshot.riskScore >= 60) {
    return {
      body: "風險分數已經需要優先處理，先切到技術與風險模組，看壓力來源是否集中。",
      label: "先看風險",
      tab: "technical",
      title: "風險優先",
      tone: "hold"
    };
  }

  if (snapshot.healthScore >= 70) {
    return {
      body: "健康度較佳時，先看趨勢延續性，再用成交量與回測確認訊號是否穩定。",
      label: "先看趨勢",
      tab: "trend",
      title: "趨勢確認",
      tone: "active"
    };
  }

  return {
    body: "分數沒有明顯方向時，先比較基本面、趨勢與回測，不用急著下結論。",
    label: "先做交叉檢查",
    tab: "fundamentals",
    title: "中性觀察",
    tone: "hold"
  };
}
