import fs from "node:fs";

const filesToRead = [
  "src/lib/runtime-product-summary.ts",
  "src/components/home-runtime-status-panel.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/lib/public-runtime-boundary-copy.ts",
  "src/lib/post-readonly-runtime-state.ts",
  "package.json",
  "scripts/check-review-gates.mjs"
];

const files = new Map(filesToRead.map((file) => [file, fs.readFileSync(file, "utf8")]));

const required = [
  ["src/lib/runtime-product-summary.ts", "Use mock signals for reading only"],
  ["src/lib/runtime-product-summary.ts", "Real-data claims are not live"],
  ["src/lib/runtime-product-summary.ts", "Decide post-readonly runtime interpretation"],
  ["src/lib/runtime-product-summary.ts", "mock-only signal reading, risk sorting, and product-flow validation"],
  ["src/lib/runtime-product-summary.ts", "Real market data, Supabase-backed public data, SQL scoring"],
  ["src/lib/runtime-product-summary.ts", "publicDataSource=supabase"],
  ["src/lib/runtime-product-summary.ts", "scoreSource=real remain blocked"],
  ["src/lib/runtime-product-summary.ts", "現在可用"],
  ["src/lib/runtime-product-summary.ts", "用 mock 訊號做閱讀驗證"],
  ["src/lib/runtime-product-summary.ts", "尚未開放"],
  ["src/lib/runtime-product-summary.ts", "真實資料宣稱尚未上線"],
  ["src/lib/runtime-product-summary.ts", "下一個 gate"],
  ["src/lib/runtime-product-summary.ts", "先決定 readonly 後的 runtime 解讀"],
  ["src/lib/runtime-product-summary.ts", "Readonly 結果"],
  ["src/lib/runtime-product-summary.ts", "object reachability 已驗證"],
  ["src/components/home-runtime-status-panel.tsx", "productSummary.useNow"],
  ["src/components/home-runtime-status-panel.tsx", "productSummary.notLiveYet"],
  ["src/components/home-runtime-status-panel.tsx", "productSummary.nextGate"],
  ["src/components/home-runtime-status-panel.tsx", "scoreSource=real remain blocked"],
  ["src/components/stock-runtime-at-a-glance.tsx", "productSummary.useNow"],
  ["src/components/stock-runtime-at-a-glance.tsx", "productSummary.notLiveYet"],
  ["src/components/stock-runtime-at-a-glance.tsx", "productSummary.nextGate"],
  ["src/components/stock-runtime-at-a-glance.tsx", "scoreSource=real is not enabled"],
  ["src/lib/public-runtime-boundary-copy.ts", "publicDataSource=mock"],
  ["src/lib/public-runtime-boundary-copy.ts", "scoreSource=mock"],
  ["src/lib/post-readonly-runtime-state.ts", "publicDataSource: \"mock\""],
  ["src/lib/post-readonly-runtime-state.ts", "scoreSource: \"mock\""],
  ["package.json", "\"check:runtime-mock-disclosure-readability\""],
  ["scripts/check-review-gates.mjs", "scripts/check-runtime-mock-disclosure-readability.mjs"]
];

const forbidden = [
  ["src/lib/runtime-product-summary.ts", "scoreSource=real is enabled"],
  ["src/lib/runtime-product-summary.ts", "publicDataSource=supabase is enabled"],
  ["src/lib/runtime-product-summary.ts", "璅⊥"],
  ["src/lib/runtime-product-summary.ts", "鞈"],
  ["src/lib/runtime-product-summary.ts", "撠"],
  ["src/lib/runtime-product-summary.ts", "甇??"],
  ["src/components/home-runtime-status-panel.tsx", "scoreSource: \"real\""],
  ["src/components/home-runtime-status-panel.tsx", "publicDataSource: \"supabase\""],
  ["src/components/stock-runtime-at-a-glance.tsx", "scoreSource: \"real\""],
  ["src/components/stock-runtime-at-a-glance.tsx", "publicDataSource: \"supabase\""],
  ["src/lib/post-readonly-runtime-state.ts", "scoreSource: \"real\""],
  ["src/lib/post-readonly-runtime-state.ts", "publicDataSource: \"supabase\""]
];

const mojibakePattern = /[\uE000-\uF8FF\uFFFD]/u;
const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (mojibakePattern.test(read("src/lib/runtime-product-summary.ts"))) {
  blocked.push("src/lib/runtime-product-summary.ts: mojibake runtime disclosure");
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
