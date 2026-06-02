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
  ["coreTabs", "健康分數"],
  ["coreTabs", "風險分數"],
  ["coreTabs", "今日燈號"],
  ["coreTabs", "資料品質"],
  ["coreTabs", "real score-source mode blocked"],
  ["coreTabs", "分數來源說明"],
  ["coreTabs", "目前分數來源："],
  ["coreTabs", "方法論"],
  ["coreTabs", "免責聲明"],
  ["coreTabs", "模組分數"],
  ["coreTabs", "股票頁公開摘要"],
  ["coreTabs", "function TrendTab"],
  ["coreTabs", "分數時間線"],
  ["coreTabs", "起始日期"],
  ["coreTabs", "結束日期"],
  ["coreTabs", "區間最高"],
  ["coreTabs", "區間最低"],
  ["coreTabs", "區間平均"],
  ["coreTabs", "最新燈號"],
  ["coreTabs", "function TechnicalTab"],
  ["coreTabs", "技術快照"],
  ["coreTabs", "趨勢模組健康分數"],
  ["coreTabs", "20 日均線"],
  ["coreTabs", "60 日均線"],
  ["coreTabs", "相對強弱"],
  ["coreTabs", "技術判讀邊界"],
  ["coreTabs", "function VolumeTab"],
  ["coreTabs", "量能輪廓"],
  ["coreTabs", "今日量能"],
  ["coreTabs", "20 日均量"],
  ["coreTabs", "資金流健康"],
  ["coreTabs", "資金流風險"],
  ["coreTabs", "近 12 期量能示意"],
  ["coreTabs", "function FundamentalsTab"],
  ["coreTabs", "基本面 / 籌碼資料"],
  ["coreTabs", "本益比"],
  ["coreTabs", "股價淨值比"],
  ["coreTabs", "現金殖利率"],
  ["coreTabs", "基本面參考分數"],
  ["coreTabs", "產品判讀層"],
  ["coreTabs", "function NewsTab"],
  ["coreTabs", "新聞信心檢查"],
  ["coreTabs", "新聞日期"],
  ["coreTabs", "新聞信心分數"],
  ["coreTabs", "正向事件"],
  ["coreTabs", "負向事件"],
  ["coreTabs", "新聞影響"],
  ["coreTabs", "相關新聞摘要"],
  [packagePath, "\"check:stock-core-tabs-readability\""],
  [reviewGatePath, "scripts/check-stock-core-tabs-readability.mjs"]
];

const forbidden = [
  ["coreTabs", "scoreSource=real approved"],
  ["coreTabs", "publicDataSource=supabase approved"],
  ["coreTabs", "createClient"],
  ["coreTabs", "fetch("]
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
