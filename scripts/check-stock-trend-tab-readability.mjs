import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const component = fs.readFileSync(componentPath, "utf8");
const files = new Map(
  [componentPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const trendTabStart = component.indexOf("function TrendTab");
const trendTabEnd = component.indexOf("function TechnicalTab", trendTabStart);
const trendTab = trendTabStart >= 0 && trendTabEnd > trendTabStart ? component.slice(trendTabStart, trendTabEnd) : "";

const required = [
  [componentPath, "function TrendTab"],
  [componentPath, "Score Timeline"],
  [componentPath, "分數時間線"],
  [componentPath, "[\"health\", \"健康分數\"]"],
  [componentPath, "[\"risk\", \"風險分數\"]"],
  [componentPath, "[\"composite\", \"綜合分數\"]"],
  [componentPath, "起始日期"],
  [componentPath, "結束日期"],
  [componentPath, "區間最高"],
  [componentPath, "區間最低"],
  [componentPath, "區間平均"],
  [componentPath, "最新燈號"],
  [componentPath, "ScoreChart mode={chartMode} rows={visible}"],
  [packagePath, "\"check:stock-trend-tab-readability\": \"node scripts/check-stock-trend-tab-readability.mjs\""],
  [reviewGatePath, "scripts/check-stock-trend-tab-readability.mjs"]
];

const forbidden = [
  [componentPath, "scoreSource=real approved"],
  [componentPath, "real score-source mode approved"],
  [componentPath, "publicDataSource=supabase approved"],
  [componentPath, "createClient"],
  [componentPath, "fetch("]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (!trendTab) {
  blocked.push(`${componentPath}: TrendTab block not found`);
}

if (/[\uFFFD\uF000-\uF8FF]/u.test(trendTab)) {
  blocked.push(`${componentPath}: TrendTab contains replacement/private-use mojibake characters`);
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
