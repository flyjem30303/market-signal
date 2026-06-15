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
          ? `${riskiestModule.name} 風險較高，建議先確認這個風險是否正在擴大。`
          : `${riskiestModule.name} 目前不是主要壓力，但仍適合持續追蹤。`,
      label: "主要風險",
      tab: "technical",
      title: `${riskiestModule.name} ${riskiestModule.risk}/100`,
      tone: snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "hold" : "active"
    },
    safetyLine: "這是市場觀察摘要，不是買賣建議；請搭配自身風險承受度判斷。",
    stopCondition: {
      body: hasDataWarnings
        ? "資料仍為示範或尚未完整，請先看資料時間與來源狀態，不要只看分數。"
        : "若風險分數快速升高或資料更新異常，應暫停用單一燈號做判斷。",
      label: "停止條件",
      tab: hasDataWarnings ? "today" : "backtest",
      title: hasDataWarnings ? "先確認資料狀態" : "風險升高時暫停判斷",
      tone: "blocked"
    }
  };
}

function getHeadline(snapshot: SignalSnapshot, hasDataWarnings: boolean) {
  if (hasDataWarnings) return `${snapshot.asset.symbol} 可先閱讀燈號，但資料仍需確認。`;
  if (snapshot.riskScore >= 70) return `${snapshot.asset.symbol} 風險偏高，優先觀察壓力來源。`;
  if (snapshot.healthScore >= 70) return `${snapshot.asset.symbol} 狀態偏強，但仍需看風險。`;
  return `${snapshot.asset.symbol} 處於觀察區，建議等待更多確認。`;
}

function getObservationFocus(snapshot: SignalSnapshot, hasDataWarnings: boolean): InvestorActionItem {
  if (hasDataWarnings) {
    return {
      body: "先確認資料是否為示範、是否延遲，以及是否有缺漏提示。",
      label: "資料狀態",
      tab: "today",
      title: "先看資料是否可靠",
      tone: "blocked"
    };
  }

  if (snapshot.riskScore >= 60) {
    return {
      body: "風險分數偏高，請優先觀察是否擴散到趨勢、資金或市場廣度。",
      label: "風險觀察",
      tab: "technical",
      title: "確認壓力來源",
      tone: "hold"
    };
  }

  if (snapshot.healthScore >= 70) {
    return {
      body: "狀態偏強時仍需確認資料時間與主要風險，避免只看正向燈號。",
      label: "趨勢觀察",
      tab: "trend",
      title: "確認強勢是否延續",
      tone: "active"
    };
  }

  return {
    body: "訊號尚未明確，適合用觀察清單追蹤下一次更新與風險變化。",
    label: "觀望重點",
    tab: "fundamentals",
    title: "等待更多確認",
    tone: "hold"
  };
}
