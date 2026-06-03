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
        "目前只把 object reachability 當作後端證據。下一關要確認 schema shape、data freshness、row coverage、data quality、source-depth 與 UI runtime interpretation，才可能討論正式資料來源或正式評分。",
      displayLabel: "下一關",
      displayTitle: "決定 post-readonly runtime 解讀",
      label: "Next gate",
      title: "Decide post-readonly runtime interpretation"
    },
    notLiveYet: {
      body:
        "Real market data, Supabase-backed public data, SQL scoring, publicDataSource=supabase, and scoreSource=real remain blocked until separate accepted gates.",
      displayBody:
        "真實市場資料、Supabase-backed public data、SQL scoring、publicDataSource=supabase 與 scoreSource=real 都尚未上線，必須等後續 gate 接受後才能升級。",
      displayLabel: "尚未上線",
      displayTitle: "真實資料宣稱仍 blocked",
      label: "Not live yet",
      title: "Real-data claims are not live"
    },
    readonlyDecision: {
      body: `${postReadonly.objectsReachable} Supabase objects are reachable in read-only validation. Public source remains ${postReadonly.publicDataSource}; score remains ${postReadonly.scoreSource}. ${postReadonly.stopLine}`,
      displayBody: `唯讀驗證已確認 ${postReadonly.objectsReachable} 個 Supabase objects 可達。公開資料來源仍是 ${postReadonly.publicDataSource}，評分來源仍是 ${postReadonly.scoreSource}。${postReadonly.stopLine}`,
      displayLabel: "唯讀驗證",
      displayTitle: "Object reachability 已確認",
      label: "Readonly result",
      title: "Object reachability is verified"
    },
    useNow: {
      body: `${symbol} can be used now for mock-only signal reading, risk sorting, and product-flow validation. It does not provide investment advice or real market-data evidence.`,
      displayBody: `${symbol} 目前可用於 mock-only signal reading、risk sorting 與 product-flow validation；不提供投資建議，也不代表真實市場資料證據。`,
      displayLabel: "現在可用",
      displayTitle: "用 mock 訊號做閱讀",
      label: "Use now",
      title: "Use mock signals for reading only"
    }
  };
}
