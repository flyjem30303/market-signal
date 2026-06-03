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
  [helperPath, "現在可用"],
  [helperPath, "用 mock 訊號做閱讀"],
  [helperPath, "尚未上線"],
  [helperPath, "真實資料宣稱仍 blocked"],
  [helperPath, "下一關"],
  [helperPath, "決定 post-readonly runtime 解讀"],
  [helperPath, "唯讀驗證"],
  [helperPath, "Object reachability 已確認"],
  [helperPath, "正式資料來源或正式評分"],
  [helperPath, "不提供投資建議"],
  [homePath, "getRuntimeProductSummary"],
  [homePath, "TrackedLink"],
  [homePath, "runtime-product-summary"],
  [homePath, "runtime-next-links"],
  [homePath, "Runtime next steps"],
  [homePath, "查看個股頁"],
  [homePath, "查看市場簡報"],
  [homePath, "了解 mock 方法"],
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
  [stockPath, "查看市場簡報"],
  [stockPath, "了解 mock 方法"],
  [stockPath, "回到首頁"],
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

const mojibakePatterns = [
  /[嚙稽]/u,
  /\?[^\n"'<>]{0,8}[賹芯漲]/u,
  /[哨霄]/u
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [helperPath, homePath, stockPath]) {
  for (const pattern of mojibakePatterns) {
    if (pattern.test(read(file))) {
      blocked.push(`${file}: mojibake runtime copy ${String(pattern)}`);
    }
  }
}

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
