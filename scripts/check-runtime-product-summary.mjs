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
  [helperPath, "RuntimeProductSummaryItem"],
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
  [helperPath, "Readonly result"],
  [helperPath, "Use mock signals for reading only"],
  [helperPath, "Real-data claims are not live"],
  [helperPath, "Decide post-readonly runtime interpretation"],
  [helperPath, "mock-only signal reading, risk sorting, and product-flow validation"],
  [helperPath, "It does not provide investment advice or real market-data evidence"],
  [helperPath, "Real market data, Supabase-backed public data, SQL scoring"],
  [helperPath, "publicDataSource=supabase"],
  [helperPath, "scoreSource=real remain blocked"],
  [helperPath, "schema shape"],
  [helperPath, "data freshness"],
  [helperPath, "row coverage"],
  [helperPath, "data quality"],
  [helperPath, "source-depth"],
  [helperPath, "UI runtime interpretation"],
  [helperPath, "現在可用"],
  [helperPath, "用 mock 訊號做閱讀驗證"],
  [helperPath, "尚未開放"],
  [helperPath, "真實資料宣稱尚未上線"],
  [helperPath, "下一個 gate"],
  [helperPath, "先決定 readonly 後的 runtime 解讀"],
  [helperPath, "Readonly 結果"],
  [helperPath, "object reachability 已驗證"],
  [helperPath, "真實市場資料、Supabase 公開資料、SQL scoring"],
  [helperPath, "分數來源仍是"],
  [homePath, "getRuntimeProductSummary"],
  [homePath, "runtime-product-summary"],
  [homePath, "productSummary.useNow.displayLabel"],
  [homePath, "productSummary.notLiveYet.displayLabel"],
  [homePath, "productSummary.nextGate.displayLabel"],
  [homePath, "productSummary.readonlyDecision.displayLabel"],
  [stockPath, "getRuntimeProductSummary"],
  [stockPath, "runtime-product-summary"],
  [stockPath, "productSummary.useNow.displayLabel"],
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
  [helperPath, "撌脫"],
  [helperPath, "瘙箏"],
  [helperPath, "甇??"],
  [helperPath, "鞈"],
  [helperPath, "璅⊥"],
  [helperPath, "敺"],
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
