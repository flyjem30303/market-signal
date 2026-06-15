import type { SignalSnapshot } from "@/lib/signal-model";

type ActionTone = "active" | "hold" | "blocked";
export type ActionTab = "today" | "trend" | "technical" | "fundamentals" | "backtest";

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

  return {
    headline: getHeadline(snapshot, hasDataWarnings),
    observationFocus: getObservationFocus(snapshot, hasDataWarnings),
    primaryRisk: {
      body:
        snapshot.riskScore >= 60
          ? `${riskiestModule.name} 的風險分數偏高，建議先觀察是否有趨勢轉弱或資料延遲。`
          : `${riskiestModule.name} 目前不是主要壓力來源，但仍應和整體市場狀態一起判讀。`,
      label: "主要風險",
      tab: "technical",
      title: `${riskiestModule.name} ${riskiestModule.risk}/100`,
      tone: snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "hold" : "active"
    },
    safetyLine: "本頁提供市場狀態整理與觀察輔助，不提供個別買賣建議，也不保證任何報酬。",
    stopCondition: {
      body: hasDataWarnings
        ? "資料仍為示範或覆蓋率未完整時，請先把燈號當作閱讀介面，不要當成真實交易依據。"
        : "若風險分數快速升高或資料更新時間異常，應先暫停解讀並等待下一次更新。",
      label: "暫停條件",
      tab: hasDataWarnings ? "today" : "backtest",
      title: hasDataWarnings ? "資料仍在補齊" : "風險升高時先停看",
      tone: "blocked"
    }
  };
}

function getHeadline(snapshot: SignalSnapshot, hasDataWarnings: boolean) {
  if (hasDataWarnings) return `${snapshot.asset.symbol} 目前可閱讀，但資料仍在補齊。`;
  if (snapshot.riskScore >= 70) return `${snapshot.asset.symbol} 風險偏高，建議保守觀察。`;
  if (snapshot.healthScore >= 70) return `${snapshot.asset.symbol} 狀態偏強，但仍需留意風險。`;
  return `${snapshot.asset.symbol} 處於觀察區間，適合追蹤後續變化。`;
}

function getObservationFocus(snapshot: SignalSnapshot, hasDataWarnings: boolean): InvestorActionItem {
  if (hasDataWarnings) {
    return {
      body: "優先確認資料來源、更新時間與覆蓋率，再解讀燈號分數。",
      label: "資料狀態",
      tab: "today",
      title: "先看資料是否可靠",
      tone: "blocked"
    };
  }

  if (snapshot.riskScore >= 60) {
    return {
      body: "風險分數偏高時，先觀察市場是否轉弱，而不是急著做單一方向判斷。",
      label: "風險觀察",
      tab: "technical",
      title: "提高警覺",
      tone: "hold"
    };
  }

  if (snapshot.healthScore >= 70) {
    return {
      body: "趨勢與健康分數較佳時，可以追蹤是否延續，但仍需搭配風險分數。",
      label: "趨勢觀察",
      tab: "trend",
      title: "追蹤延續性",
      tone: "active"
    };
  }

  return {
    body: "訊號尚未明確時，適合把重點放在下一次更新與關鍵風險變化。",
    label: "觀望重點",
    tab: "fundamentals",
    title: "等待更明確訊號",
    tone: "hold"
  };
}
