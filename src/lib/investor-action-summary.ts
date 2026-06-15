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

  const observationFocus = getObservationFocus(snapshot, hasDataWarnings);
  const primaryRisk: InvestorActionItem = {
    body:
      snapshot.riskScore >= 60
        ? `${riskiestModule.name} 是目前較需要複核的風險來源，先看風險提示，再決定是否加強觀察。`
        : `${riskiestModule.name} 目前不是主要阻斷點，仍建議搭配資料時間與市場氣氛一起看。`,
    label: "主要風險",
    tab: "technical",
    title: `${riskiestModule.name} ${riskiestModule.risk}/100`,
    tone: snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "hold" : "active"
  };
  const stopCondition: InvestorActionItem = {
    body: hasDataWarnings
      ? "若資料缺漏或延遲，先停止把分數當成正式判斷，只能作為示範資料閱讀。"
      : "若後續風險分數快速升高，先回到晨報與週報複核市場結構，再決定下一步觀察。",
    label: "停止條件",
    tab: hasDataWarnings ? "today" : "backtest",
    title: hasDataWarnings ? "資料需先複核" : "風險升高再停看",
    tone: "blocked"
  };

  return {
    headline: getHeadline(snapshot, hasDataWarnings),
    observationFocus,
    primaryRisk,
    safetyLine: "示範資料僅供理解流程；本網站為非投資建議，不提供買賣指令。",
    stopCondition
  };
}

function getHeadline(snapshot: SignalSnapshot, hasDataWarnings: boolean) {
  if (hasDataWarnings) return `${snapshot.asset.symbol} 先看資料邊界，再看燈號。`;
  if (snapshot.riskScore >= 70) return `${snapshot.asset.symbol} 風險偏高，先加強觀察。`;
  if (snapshot.healthScore >= 70) return `${snapshot.asset.symbol} 狀態偏穩，仍需複核風險。`;
  return `${snapshot.asset.symbol} 維持觀望，先看市場氣氛與資料時間。`;
}

function getObservationFocus(snapshot: SignalSnapshot, hasDataWarnings: boolean): InvestorActionItem {
  if (hasDataWarnings) {
    return {
      body: "資料品質有提醒時，先確認缺漏或延遲，不要只看分數。",
      label: "資料提醒",
      tab: "today",
      title: "先看資料信任",
      tone: "blocked"
    };
  }

  if (snapshot.riskScore >= 60) {
    return {
      body: "風險分數偏高時，優先看技術與市場結構是否同步轉弱。",
      label: "風險觀察",
      tab: "technical",
      title: "先複核風險",
      tone: "hold"
    };
  }

  if (snapshot.healthScore >= 70) {
    return {
      body: "健康分數偏高時，仍要確認是否只是短線反彈或單一模組拉高。",
      label: "趨勢觀察",
      tab: "trend",
      title: "看趨勢延續",
      tone: "active"
    };
  }

  return {
    body: "訊號不明顯時，先保留觀察，回到晨報看市場廣度與風險提示。",
    label: "觀望提醒",
    tab: "fundamentals",
    title: "維持觀察",
    tone: "hold"
  };
}
