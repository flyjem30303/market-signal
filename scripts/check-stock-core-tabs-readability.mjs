import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const component = read(componentPath);
const todayStart = component.indexOf("function TodayTab");
const newsEnd = component.indexOf("function BacktestTab");
const coreTabs = todayStart >= 0 && newsEnd > todayStart ? component.slice(todayStart, newsEnd) : "";

const required = [
  ["coreTabs", "function TodayTab"],
  ["coreTabs", "多頭健康度"],
  ["coreTabs", "回檔風險度"],
  ["coreTabs", "綜合燈號"],
  ["coreTabs", "資料品質"],
  ["coreTabs", "目前分數來源："],
  ["coreTabs", "正式上線前"],
  ["coreTabs", "六大研究模組"],
  ["coreTabs", "股票頁內容方向"],
  ["coreTabs", "function TechnicalTab"],
  ["coreTabs", "技術分析摘要"],
  ["coreTabs", "價格趨勢健康度"],
  ["coreTabs", "20 日均線"],
  ["coreTabs", "60 日均線"],
  ["coreTabs", "相對強弱"],
  ["coreTabs", "趨勢風險"],
  ["coreTabs", "技術面判讀"],
  ["coreTabs", "不做買賣指令"],
  ["coreTabs", "function VolumeTab"],
  ["coreTabs", "成交量與資金熱度"],
  ["coreTabs", "今日成交量"],
  ["coreTabs", "20 日均量"],
  ["coreTabs", "籌碼健康"],
  ["coreTabs", "籌碼風險"],
  ["coreTabs", "近 12 日量能示意"],
  ["coreTabs", "真實交易環境"],
  ["coreTabs", "function FundamentalsTab"],
  ["coreTabs", "股利 / 基本資料"],
  ["coreTabs", "本益比"],
  ["coreTabs", "股價淨值比"],
  ["coreTabs", "殖利率"],
  ["coreTabs", "function NewsTab"],
  ["coreTabs", "新聞信心儀表"],
  ["coreTabs", "相關新聞彙整"],
  [packagePath, "\"check:stock-core-tabs-readability\""],
  [reviewGatePath, "scripts/check-stock-core-tabs-readability.mjs"]
];

const forbidden = [
  ["coreTabs", "scoreSource=real approved"],
  ["coreTabs", "publicDataSource=supabase approved"],
  ["coreTabs", "正式投資建議"],
  ["coreTabs", "createClient"],
  ["coreTabs", "fetch("],
  ["coreTabs", "隞"],
  ["coreTabs", "?銵"],
  ["coreTabs", "瘝餌"],
  ["coreTabs", "鞈"],
  ["coreTabs", "蝮質"],
  ["coreTabs", "韏啣"],
  ["coreTabs", "蝬"],
  ["coreTabs", ""],
  ["coreTabs", ""]
];

const sources = new Map([["coreTabs", coreTabs], ...files]);
const mojibakePattern = /[\uFFFD\uF000-\uF8FF]/u;
const missing = required.filter(([file, phrase]) => !source(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => source(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (todayStart < 0 || newsEnd < 0 || newsEnd <= todayStart) {
  missing.push(`${componentPath}: TodayTab to NewsTab range`);
}

if (mojibakePattern.test(coreTabs)) {
  blocked.push(`${componentPath}: core tabs contain replacement/private-use mojibake characters`);
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
