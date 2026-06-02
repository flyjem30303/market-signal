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
  ["src/lib/runtime-product-summary.ts", "可檢視 mock 燈號與準備狀態"],
  ["src/lib/runtime-product-summary.ts", "真實資料模式尚未開放"],
  ["src/lib/runtime-product-summary.ts", "真實資料前先完成證據審核"],
  ["src/lib/runtime-product-summary.ts", "不能視為投資證據或真實市場判讀"],
  ["src/lib/runtime-product-summary.ts", "尚未啟用真實市場資料"],
  ["src/components/home-runtime-status-panel.tsx", "productSummary.useNow"],
  ["src/components/home-runtime-status-panel.tsx", "productSummary.notLiveYet"],
  ["src/components/home-runtime-status-panel.tsx", "productSummary.nextGate"],
  ["src/components/home-runtime-status-panel.tsx", "scoreSource=real are blocked"],
  ["src/components/stock-runtime-at-a-glance.tsx", "productSummary.useNow"],
  ["src/components/stock-runtime-at-a-glance.tsx", "productSummary.notLiveYet"],
  ["src/components/stock-runtime-at-a-glance.tsx", "productSummary.nextGate"],
  ["src/components/stock-runtime-at-a-glance.tsx", "scoreSource=real is not enabled"],
  ["src/lib/public-runtime-boundary-copy.ts", "Visible now: mock runtime"],
  ["src/lib/public-runtime-boundary-copy.ts", "Stop line: keep publicDataSource=mock and scoreSource=mock"],
  ["src/lib/post-readonly-runtime-state.ts", "publicDataSource: \"mock\""],
  ["src/lib/post-readonly-runtime-state.ts", "scoreSource: \"mock\""],
  ["package.json", "\"check:runtime-mock-disclosure-readability\""],
  ["scripts/check-review-gates.mjs", "scripts/check-runtime-mock-disclosure-readability.mjs"]
];

const forbidden = [
  ["src/lib/runtime-product-summary.ts", "scoreSource=real is enabled"],
  ["src/lib/runtime-product-summary.ts", "publicDataSource=supabase is enabled"],
  ["src/lib/runtime-product-summary.ts", "真實資料模式已開放"],
  ["src/lib/runtime-product-summary.ts", "可視為投資建議"],
  ["src/components/home-runtime-status-panel.tsx", "scoreSource: \"real\""],
  ["src/components/home-runtime-status-panel.tsx", "publicDataSource: \"supabase\""],
  ["src/components/stock-runtime-at-a-glance.tsx", "scoreSource: \"real\""],
  ["src/components/stock-runtime-at-a-glance.tsx", "publicDataSource: \"supabase\""],
  ["src/lib/post-readonly-runtime-state.ts", "scoreSource: \"real\""],
  ["src/lib/post-readonly-runtime-state.ts", "publicDataSource: \"supabase\""]
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
