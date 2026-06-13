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
        ? `${riskiestModule.name} 是目前最需要確認的風險來源，請搭配資料品質與市場總覽一起看。`
        : `${riskiestModule.name} 目前不是主要警訊，但仍建議在下一次資料更新後複核。`,
    label: "主要風險",
    tab: "technical",
    title: `${riskiestModule.name} ${riskiestModule.risk}/100`,
    tone: snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "hold" : "active"
  };
  const stopCondition: InvestorActionItem = {
    body: hasDataWarnings
      ? "資料仍有缺口或示範模型提示，請不要把目前分數當成正式行情判斷。"
      : "若後續資料時間延遲、風險分數升高或市場廣度轉弱，應重新檢查。",
    label: "停止條件",
    tab: hasDataWarnings ? "today" : "backtest",
    title: hasDataWarnings ? "資料需複核" : "等待下次確認",
    tone: "blocked"
  };

  return {
    headline: getHeadline(snapshot, hasDataWarnings),
    observationFocus,
    primaryRisk,
    safetyLine: "本摘要只協助整理觀察順序，不提供個股買進、賣出、持有或個人化投資建議。",
    stopCondition
  };
}

function getHeadline(snapshot: SignalSnapshot, hasDataWarnings: boolean) {
  if (hasDataWarnings) return `${snapshot.asset.symbol} 目前可讀，但仍需注意資料邊界。`;
  if (snapshot.riskScore >= 70) return `${snapshot.asset.symbol} 風險偏高，先看風險來源。`;
  if (snapshot.healthScore >= 70) return `${snapshot.asset.symbol} 狀態相對穩定，仍需追蹤資料時間。`;
  return `${snapshot.asset.symbol} 處於觀望區，建議等待下一次資料確認。`;
}

function getObservationFocus(snapshot: SignalSnapshot, hasDataWarnings: boolean): InvestorActionItem {
  if (hasDataWarnings) {
    return {
      body: "先看資料品質、資料時間與缺口提示；正式資料尚未啟用前，分數只適合示範閱讀流程。",
      label: "資料優先",
      tab: "today",
      title: "資料邊界優先",
      tone: "blocked"
    };
  }

  if (snapshot.riskScore >= 60) {
    return {
      body: "風險分數偏高，請先檢查風險模組，而不是只看燈號顏色。",
      label: "風險優先",
      tab: "technical",
      title: "風險來源",
      tone: "hold"
    };
  }

  if (snapshot.healthScore >= 70) {
    return {
      body: "健康分數偏高，適合持續觀察趨勢是否延續。",
      label: "趨勢優先",
      tab: "trend",
      title: "趨勢支撐",
      tone: "active"
    };
  }

  return {
    body: "狀態未明顯偏多或偏空，建議搭配市場簡報與資料時間一起判斷。",
    label: "脈絡優先",
    tab: "fundamentals",
    title: "市場脈絡",
    tone: "hold"
  };
}
