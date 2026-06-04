import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

export type RuntimeProductSummaryItem = {
  body: string;
  displayBody: string;
  displayLabel: string;
  displayTitle: string;
  label: "Use now" | "Not live yet" | "Next gate" | "Readonly result";
  title: string;
};

export type RuntimeProductSummary = {
  nextGate: RuntimeProductSummaryItem;
  notLiveYet: RuntimeProductSummaryItem;
  readonlyDecision: RuntimeProductSummaryItem;
  useNow: RuntimeProductSummaryItem;
};

export function getRuntimeProductSummary(symbol: string): RuntimeProductSummary {
  const postReadonly = getPostReadonlyRuntimeState();

  return {
    nextGate: {
      body:
        "Use accepted object reachability as backend evidence only. The next gate must decide schema shape, data freshness, row coverage, data quality, source-depth, and UI runtime interpretation before any public source or score promotion.",
      displayBody:
        "已接受的 readonly reachability 只能當作後端證據。下一個 gate 必須再判斷 schema shape、freshness、row coverage、data quality、source-depth 與 UI runtime interpretation，才可能討論公開來源或分數升級。",
      displayLabel: "下一個 gate",
      displayTitle: "先決定 readonly 後的 runtime 解讀",
      label: "Next gate",
      title: "Decide post-readonly runtime interpretation"
    },
    notLiveYet: {
      body:
        "Real market data, Supabase-backed public data, SQL scoring, publicDataSource=supabase, and scoreSource=real remain blocked until separate accepted gates.",
      displayBody:
        "真實市場資料、Supabase 公開資料、SQL scoring、publicDataSource=supabase 與 scoreSource=real 仍被擋住；必須等各自 gate 被接受後才可升級。",
      displayLabel: "尚未開放",
      displayTitle: "真實資料宣稱尚未上線",
      label: "Not live yet",
      title: "Real-data claims are not live"
    },
    readonlyDecision: {
      body: `${postReadonly.objectsReachable} Supabase objects are reachable in read-only validation. Public source remains ${postReadonly.publicDataSource}; score remains ${postReadonly.scoreSource}. ${postReadonly.stopLine}`,
      displayBody: `readonly 驗證已確認 ${postReadonly.objectsReachable} 個 Supabase object 可讀；公開來源仍是 ${postReadonly.publicDataSource}，分數來源仍是 ${postReadonly.scoreSource}。${postReadonly.stopLine}`,
      displayLabel: "Readonly 結果",
      displayTitle: "object reachability 已驗證",
      label: "Readonly result",
      title: "Object reachability is verified"
    },
    useNow: {
      body: `${symbol} can be used now for mock-only signal reading, risk sorting, and product-flow validation. It does not provide investment advice or real market-data evidence.`,
      displayBody: `${symbol} 目前可用來閱讀 mock-only 訊號、風險排序與產品流程；它不是投資建議，也不是即時市場資料證據。`,
      displayLabel: "現在可用",
      displayTitle: "用 mock 訊號做閱讀驗證",
      label: "Use now",
      title: "Use mock signals for reading only"
    }
  };
}
