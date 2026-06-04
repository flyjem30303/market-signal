import fs from "node:fs";

const layoutPath = "src/app/layout.tsx";
const navPath = "src/components/site-nav.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [layoutPath, navPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [layoutPath, "台股健康度與回檔風險燈號"],
  [layoutPath, "Market Signal"],
  [layoutPath, "全站資料與責任邊界"],
  [layoutPath, "資料來源：mock"],
  [layoutPath, "分數來源：模擬評分"],
  [layoutPath, "用多頭健康度、回檔風險度、新聞信心與回測摘要追蹤台股標的。"],
  [layoutPath, "這個網站目前仍是 mock 閱讀體驗"],
  [layoutPath, "首頁"],
  [layoutPath, "每日晨報"],
  [layoutPath, "週報"],
  [layoutPath, "個股"],
  [layoutPath, "方法論"],
  [layoutPath, "隱私權"],
  [layoutPath, "使用條款"],
  [layoutPath, "免責聲明"],
  [navPath, "首頁"],
  [navPath, "晨報"],
  [navPath, "週報"],
  [navPath, "個股"],
  [navPath, "方法論"],
  [navPath, "隱私權"],
  [navPath, "使用條款"],
  [navPath, "免責聲明"],
  [navPath, "aria-label=\"主導覽\""],
  [packagePath, "\"check:site-chrome-readability\": \"node scripts/check-site-chrome-readability.mjs\""],
  [reviewGatePath, "scripts/check-site-chrome-readability.mjs"]
];

const forbidden = [
  [layoutPath, "publicDataSource=supabase"],
  [layoutPath, "scoreSource=real"],
  [layoutPath, "sb_secret_"],
  [layoutPath, "SUPABASE_SERVICE_ROLE_KEY"],
  [navPath, "publicDataSource=supabase"],
  [navPath, "scoreSource=real"],
  [navPath, "sb_secret_"],
  [navPath, "SUPABASE_SERVICE_ROLE_KEY"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const mojibakeHits = [];

for (const file of [layoutPath, navPath]) {
  const content = read(file);
  const visibleStringMatches = [...content.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)];
  for (const match of visibleStringMatches) {
    const value = match[1] ?? match[2] ?? match[3] ?? "";
    if (/[嚗銝蝭憟璅鞈撣閮瘥摨甈雿蹐蹓]{2,}|\uFFFD|[\uE000-\uF8FF]/u.test(value)) {
      mojibakeHits.push(`${file}: ${value}`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      mojibakeHits,
      status: blocked.length === 0 && missing.length === 0 && mojibakeHits.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (blocked.length > 0 || missing.length > 0 || mojibakeHits.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
