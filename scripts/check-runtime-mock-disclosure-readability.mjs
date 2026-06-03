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
  ["src/lib/runtime-product-summary.ts", "用模擬訊號做閱讀"],
  ["src/lib/runtime-product-summary.ts", "尚未開放"],
  ["src/lib/runtime-product-summary.ts", "真實資料尚未上線"],
  ["src/lib/runtime-product-summary.ts", "確認資料能否升級"],
  ["src/lib/runtime-product-summary.ts", "唯讀檢查已確認"],
  ["src/components/home-runtime-status-panel.tsx", "productSummary.useNow"],
  ["src/components/home-runtime-status-panel.tsx", "productSummary.notLiveYet"],
  ["src/components/home-runtime-status-panel.tsx", "productSummary.nextGate"],
  ["src/components/home-runtime-status-panel.tsx", "scoreSource=real remain blocked"],
  ["src/components/home-runtime-status-panel.tsx", "查看個股頁"],
  ["src/components/home-runtime-status-panel.tsx", "查看市場簡報"],
  ["src/components/home-runtime-status-panel.tsx", "了解 mock 方法"],
  ["src/components/stock-runtime-at-a-glance.tsx", "productSummary.useNow"],
  ["src/components/stock-runtime-at-a-glance.tsx", "productSummary.notLiveYet"],
  ["src/components/stock-runtime-at-a-glance.tsx", "productSummary.nextGate"],
  ["src/components/stock-runtime-at-a-glance.tsx", "scoreSource=real is not enabled"],
  ["src/components/stock-runtime-at-a-glance.tsx", "查看市場簡報"],
  ["src/components/stock-runtime-at-a-glance.tsx", "回到首頁"],
  ["src/components/stock-runtime-at-a-glance.tsx", "了解 mock 方法"],
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
  ["src/components/home-runtime-status-panel.tsx", "scoreSource: \"real\""],
  ["src/components/home-runtime-status-panel.tsx", "publicDataSource: \"supabase\""],
  ["src/components/stock-runtime-at-a-glance.tsx", "scoreSource: \"real\""],
  ["src/components/stock-runtime-at-a-glance.tsx", "publicDataSource: \"supabase\""],
  ["src/lib/post-readonly-runtime-state.ts", "scoreSource: \"real\""],
  ["src/lib/post-readonly-runtime-state.ts", "publicDataSource: \"supabase\""]
];

const mojibakePatterns = [
  /[嚙稽]/u,
  /\?[^\n"'<>]{0,8}[賹芯漲]/u,
  /[哨霄]/u
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [
  "src/lib/runtime-product-summary.ts",
  "src/components/home-runtime-status-panel.tsx",
  "src/components/stock-runtime-at-a-glance.tsx"
]) {
  for (const pattern of mojibakePatterns) {
    if (pattern.test(read(file))) {
      blocked.push(`${file}: mojibake runtime disclosure ${String(pattern)}`);
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
