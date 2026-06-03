import fs from "node:fs";

const helperPath = "src/lib/runtime-product-summary.ts";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, homePath, stockPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "RuntimeProductSummary"],
  [helperPath, "getRuntimeProductSummary"],
  [helperPath, "displayLabel"],
  [helperPath, "displayTitle"],
  [helperPath, "displayBody"],
  [helperPath, "readonlyDecision"],
  [helperPath, "Object reachability is verified"],
  [helperPath, "postReadonly.objectsReachable"],
  [helperPath, "Use now"],
  [helperPath, "Not live yet"],
  [helperPath, "Next gate"],
  [helperPath, "Use mock signals for reading only"],
  [helperPath, "Real-data claims are not live"],
  [helperPath, "Decide post-readonly runtime interpretation"],
  [helperPath, "mock-only signal reading, risk sorting, and product-flow validation"],
  [helperPath, "It does not provide investment advice or real market-data evidence"],
  [helperPath, "Real market data, Supabase-backed public data, SQL scoring"],
  [helperPath, "publicDataSource=supabase"],
  [helperPath, "scoreSource=real remain blocked"],
  [helperPath, "accepted object reachability"],
  [helperPath, "schema shape"],
  [helperPath, "data freshness"],
  [helperPath, "row coverage"],
  [helperPath, "data quality"],
  [helperPath, "source-depth"],
  [helperPath, "UI runtime interpretation"],
  [helperPath, "objectsReachable"],
  [helperPath, "現在可用"],
  [helperPath, "先用 mock 燈號理解產品流程"],
  [helperPath, "尚未上線"],
  [helperPath, "真實資料與真實分數仍封鎖"],
  [helperPath, "下一關"],
  [helperPath, "先完成 runtime 解讀決策"],
  [helperPath, "唯讀結果"],
  [helperPath, "後端可讀性已驗證"],
  [helperPath, "不是投資建議"],
  [helperPath, "公開資料源仍是"],
  [helperPath, "分數來源仍是"],
  [homePath, "getRuntimeProductSummary"],
  [homePath, "TrackedLink"],
  [homePath, "runtime-product-summary"],
  [homePath, "runtime-next-links"],
  [homePath, "Runtime next steps"],
  [homePath, "查看目前選取標的"],
  [homePath, "看 CEO/PM 推進狀態"],
  [homePath, "確認 mock 與真實資料邊界"],
  [homePath, "runtime_next_stock"],
  [homePath, "runtime_next_briefing"],
  [homePath, "productSummary.useNow.displayLabel"],
  [homePath, "productSummary.useNow.displayTitle"],
  [homePath, "productSummary.useNow.displayBody"],
  [homePath, "productSummary.notLiveYet.displayLabel"],
  [homePath, "productSummary.nextGate.displayLabel"],
  [homePath, "productSummary.readonlyDecision.displayLabel"],
  [stockPath, "getRuntimeProductSummary"],
  [stockPath, "TrackedLink"],
  [stockPath, "runtime-product-summary"],
  [stockPath, "runtime-next-links"],
  [stockPath, "Stock runtime next steps"],
  [stockPath, "看市場與專案推進狀態"],
  [stockPath, "確認 mock 評分方法"],
  [stockPath, "回首頁比較其他標的"],
  [stockPath, "stock_runtime_next_links"],
  [stockPath, "productSummary.useNow.displayLabel"],
  [stockPath, "productSummary.useNow.displayTitle"],
  [stockPath, "productSummary.useNow.displayBody"],
  [stockPath, "productSummary.notLiveYet.displayLabel"],
  [stockPath, "productSummary.nextGate.displayLabel"],
  [stockPath, "productSummary.readonlyDecision.displayLabel"],
  [cssPath, ".runtime-product-summary"],
  [cssPath, ".runtime-next-links"],
  [cssPath, "repeat(4, minmax(0, 1fr))"],
  [packagePath, "\"check:runtime-product-summary\": \"node scripts/check-runtime-product-summary.mjs\""],
  [reviewGatePath, "scripts/check-runtime-product-summary.mjs"]
];

const forbidden = [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, ".insert("],
  [helperPath, ".update("],
  [helperPath, ".delete("],
  [helperPath, "process.env"],
  [helperPath, "node:fs"],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "publicDataSource: \"supabase\""],
  [homePath, "productSummary.networkBlocker"],
  [stockPath, "productSummary.networkBlocker"],
  [homePath, "scoreSource: \"real\""],
  [stockPath, "scoreSource: \"real\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
