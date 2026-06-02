import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const component = read(componentPath);
const start = component.indexOf("function StockDecisionBoundary");
const end = component.indexOf("function AssetSelector");
const governance = start >= 0 && end > start ? component.slice(start, end) : "";

const required = [
  ["governance", "function StockDecisionBoundary"],
  ["governance", "目前能做與不能做"],
  ["governance", "可以做"],
  ["governance", "不能做"],
  ["governance", "宣稱真實訊號"],
  ["governance", "直接產生買賣建議"],
  ["governance", "下一輪覆核問題"],
  ["governance", "不代表已排會或已授權"],
  ["governance", "角色責任分工"],
  ["governance", "資料角色"],
  ["governance", "投資角色"],
  ["governance", "法遵角色"],
  ["governance", "CEO / PM"],
  ["governance", "Mock 邊界圖例"],
  ["governance", "不能被解讀為真實市場訊號"],
  ["governance", "local-only"],
  ["governance", "安全解讀流程"],
  ["governance", "停止解讀條件"],
  ["governance", "覆核前禁止事項"],
  ["governance", "不排正式會議"],
  ["governance", "不建立授權 packet"],
  ["governance", "不碰真實資料"],
  ["governance", "董事長審核準備度"],
  ["governance", "只審核 local-only 說明"],
  ["governance", "董事長窄問題候選"],
  ["governance", "董事長答案接受條件"],
  ["governance", "董事長回答分流"],
  ["governance", "授權前停止線"],
  ["governance", "CEO 目前主導路線"],
  ["governance", "D 主線、E 護欄、B 支援、A/C 暫緩"],
  ["governance", "授權範圍準備摘要"],
  ["governance", "不代表已授權"],
  ["package.json", "\"check:stock-governance-details-readability\""],
  ["scripts/check-review-gates.mjs", "scripts/check-stock-governance-details-readability.mjs"]
];

const forbidden = [
  ["governance", "scoreSource=real approved"],
  ["governance", "publicDataSource=supabase approved"],
  ["governance", "authorization approved"],
  ["governance", "createClient"],
  ["governance", "fetch("]
];
const sources = new Map([["governance", governance], ...files]);
const mojibakePattern = /[\uFFFD\uF000-\uF8FF]/u;
const missing = required.filter(([file, phrase]) => !source(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => source(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (start < 0 || end < 0 || end <= start) {
  missing.push(`${componentPath}: StockDecisionBoundary to AssetSelector range`);
}

if (mojibakePattern.test(governance)) {
  blocked.push(`${componentPath}: governance details contain replacement/private-use mojibake characters`);
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

function source(file) {
  return sources.get(file) ?? "";
}
