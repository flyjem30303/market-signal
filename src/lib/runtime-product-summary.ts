import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

export type RuntimeProductSummary = {
  nextGate: {
    body: string;
    displayBody: string;
    displayLabel: string;
    displayTitle: string;
    label: "Next gate";
    title: string;
  };
  notLiveYet: {
    body: string;
    displayBody: string;
    displayLabel: string;
    displayTitle: string;
    label: "Not live yet";
    title: string;
  };
  readonlyDecision: {
    body: string;
    displayBody: string;
    displayLabel: string;
    displayTitle: string;
    label: "Readonly result";
    title: string;
  };
  useNow: {
    body: string;
    displayBody: string;
    displayLabel: string;
    displayTitle: string;
    label: "Use now";
    title: string;
  };
};

export function getRuntimeProductSummary(symbol: string): RuntimeProductSummary {
  const postReadonly = getPostReadonlyRuntimeState();

  return {
    nextGate: {
      body:
        "Use accepted object reachability as backend evidence only. The next gate must decide schema shape, data freshness, row coverage, data quality, source-depth, and UI runtime interpretation before any public source or score promotion.",
      displayBody:
        "目前只確認後端資料表可被唯讀檢查碰到，還不能代表正式資料已上線。下一步要確認資料新鮮度、資料完整度、品質與來源權利，才可能討論正式資料來源或正式評分。",
      displayLabel: "下一步",
      displayTitle: "確認資料能否升級",
      label: "Next gate",
      title: "Decide post-readonly runtime interpretation"
    },
    notLiveYet: {
      body:
        "Real market data, Supabase-backed public data, SQL scoring, publicDataSource=supabase, and scoreSource=real remain blocked until separate accepted gates.",
      displayBody:
        "真實市場資料、資料庫公開來源、正式 SQL 評分與真實評分來源都尚未開放，必須等後續檢查被接受後才能升級。",
      displayLabel: "尚未開放",
      displayTitle: "真實資料尚未上線",
      label: "Not live yet",
      title: "Real-data claims are not live"
    },
    readonlyDecision: {
      body: `${postReadonly.objectsReachable} Supabase objects are reachable in read-only validation. Public source remains ${postReadonly.publicDataSource}; score remains ${postReadonly.scoreSource}. ${postReadonly.stopLine}`,
      displayBody: `唯讀檢查已確認 ${postReadonly.objectsReachable} 個後端資料物件可被讀取。公開資料來源仍是 ${postReadonly.publicDataSource}，評分來源仍是 ${postReadonly.scoreSource}。${postReadonly.stopLine}`,
      displayLabel: "唯讀檢查",
      displayTitle: "資料表可讀性已確認",
      label: "Readonly result",
      title: "Object reachability is verified"
    },
    useNow: {
      body: `${symbol} can be used now for mock-only signal reading, risk sorting, and product-flow validation. It does not provide investment advice or real market-data evidence.`,
      displayBody: `${symbol} 目前可用於模擬訊號閱讀、風險排序與產品流程驗證；不提供投資建議，也不代表真實市場資料證據。`,
      displayLabel: "現在可用",
      displayTitle: "用模擬訊號做閱讀",
      label: "Use now",
      title: "Use mock signals for reading only"
    }
  };
}
