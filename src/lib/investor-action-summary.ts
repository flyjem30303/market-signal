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
        ? `${riskiestModule.name} 是目前最需要複核的風險來源。先看成因、更新時間與資料狀態，再決定是否加強觀察。`
        : `${riskiestModule.name} 暫時不是主要壓力來源，但仍應和市場溫度、趨勢方向與資料新鮮度一起閱讀。`,
    label: "主要風險",
    tab: "technical",
    title: `${riskiestModule.name} ${riskiestModule.risk}/100`,
    tone: snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "hold" : "active"
  };
  const stopCondition: InvestorActionItem = {
    body: hasDataWarnings
      ? "資料缺口或延遲仍存在時，應停止把分數當成正式判斷，只用來理解示範流程。"
      : "即使畫面可讀，正式資料與正式分數尚未啟用前，仍不應把本頁當成買賣依據。",
    label: "停止條件",
    tab: hasDataWarnings ? "today" : "backtest",
    title: hasDataWarnings ? "資料需複核" : "仍非正式訊號",
    tone: "blocked"
  };

  return {
    headline: getHeadline(snapshot, hasDataWarnings),
    observationFocus,
    primaryRisk,
    safetyLine: "目前為示範資料與示範分數；內容只做資訊閱讀與產品驗證，非投資建議。",
    stopCondition
  };
}

function getHeadline(snapshot: SignalSnapshot, hasDataWarnings: boolean) {
  if (hasDataWarnings) return `${snapshot.asset.symbol} 目前先看資料狀態，再看分數。`;
  if (snapshot.riskScore >= 70) return `${snapshot.asset.symbol} 風險偏高，先複核風險來源。`;
  if (snapshot.healthScore >= 70) return `${snapshot.asset.symbol} 狀態偏穩，持續觀察趨勢延續。`;
  return `${snapshot.asset.symbol} 狀態中性，建議按三步判讀確認。`;
}

function getObservationFocus(snapshot: SignalSnapshot, hasDataWarnings: boolean): InvestorActionItem {
  if (hasDataWarnings) {
    return {
      body: "先確認缺口與延遲來自哪個模組，避免把示範資料誤讀為正式市場訊號。",
      label: "先看資料",
      tab: "today",
      title: "資料狀態優先",
      tone: "blocked"
    };
  }

  if (snapshot.riskScore >= 60) {
    return {
      body: "風險分數已進入需要複核的區間，先看技術與風險模組是否同向升溫。",
      label: "先看風險",
      tab: "technical",
      title: "風險需複核",
      tone: "hold"
    };
  }

  if (snapshot.healthScore >= 70) {
    return {
      body: "健康分數偏高時，重點是確認趨勢是否延續，以及風險是否同步降溫。",
      label: "先看趨勢",
      tab: "trend",
      title: "趨勢延續",
      tone: "active"
    };
  }

  return {
    body: "狀態不極端時，先檢查基本面與新聞脈絡，再決定是否放入觀察清單。",
    label: "先看脈絡",
    tab: "fundamentals",
    title: "中性觀察",
    tone: "hold"
  };
}
