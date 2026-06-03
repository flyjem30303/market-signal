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
        "下一關先判斷資料表結構、更新時間、覆蓋率、資料品質與來源深度；通過前不會把公開資料源或分數來源升級。",
      displayLabel: "下一關",
      displayTitle: "先完成 runtime 解讀決策",
      label: "Next gate",
      title: "Decide post-readonly runtime interpretation"
    },
    notLiveYet: {
      body:
        "Real market data, Supabase-backed public data, SQL scoring, publicDataSource=supabase, and scoreSource=real remain blocked until separate accepted gates.",
      displayBody:
        "真實市場資料、Supabase 公開資料、SQL 評分與 scoreSource=real 都還沒上線，必須等各自 gate accepted。",
      displayLabel: "尚未上線",
      displayTitle: "真實資料與真實分數仍封鎖",
      label: "Not live yet",
      title: "Real-data claims are not live"
    },
    readonlyDecision: {
      body: `${postReadonly.objectsReachable} Supabase objects are reachable in read-only validation. Public source remains ${postReadonly.publicDataSource}; score remains ${postReadonly.scoreSource}. ${postReadonly.stopLine}`,
      displayBody: `唯讀驗證已確認 ${postReadonly.objectsReachable} 個 Supabase 物件可讀；公開資料源仍是 ${postReadonly.publicDataSource}，分數來源仍是 ${postReadonly.scoreSource}。${postReadonly.stopLine}`,
      displayLabel: "唯讀結果",
      displayTitle: "後端可讀性已驗證",
      label: "Readonly result",
      title: "Object reachability is verified"
    },
    useNow: {
      body: `${symbol} can be used now for mock-only signal reading, risk sorting, and product-flow validation. It does not provide investment advice or real market-data evidence.`,
      displayBody: `${symbol} 現在可用來閱讀 mock 燈號、比較風險方向與驗證操作流程；它不是投資建議，也不是即時市場資料證據。`,
      displayLabel: "現在可用",
      displayTitle: "先用 mock 燈號理解產品流程",
      label: "Use now",
      title: "Use mock signals for reading only"
    }
  };
}
