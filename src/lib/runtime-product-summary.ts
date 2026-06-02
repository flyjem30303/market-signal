import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

export type RuntimeProductSummary = {
  nextGate: {
    body: string;
    label: "Next gate";
    title: string;
  };
  notLiveYet: {
    body: string;
    label: "Not live yet";
    title: string;
  };
  useNow: {
    body: string;
    label: "Use now";
    title: string;
  };
};

export function getRuntimeProductSummary(symbol: string): RuntimeProductSummary {
  const postReadonly = getPostReadonlyRuntimeState();

  return {
    nextGate: {
      body: `已確認 ${postReadonly.objectsReachable} 個 Supabase 物件可讀，但還需要 schema、freshness 與 UI 狀態被正式接受，才可以談真實資料呈現。`,
      label: "Next gate",
      title: "真實資料前先完成證據審核"
    },
    notLiveYet: {
      body:
        "目前尚未啟用真實市場資料、Supabase 公開資料、publicDataSource=supabase 或 scoreSource=real。",
      label: "Not live yet",
      title: "真實資料模式尚未開放"
    },
    useNow: {
      body: `${symbol} 目前可作為 mock-only 燈號與產品流程驗證使用，不能視為投資證據或真實市場判讀。`,
      label: "Use now",
      title: "可檢視 mock 燈號與準備狀態"
    }
  };
}
