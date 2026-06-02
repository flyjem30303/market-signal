import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [componentPath, "Market Signal Dashboard"],
  [componentPath, "今日燈號"],
  [componentPath, "多標的健康度與回檔風險燈號"],
  [componentPath, "mock-only runtime"],
  [componentPath, "正式分數來源尚未啟用"],
  [componentPath, "公開頁面先顯示可讀摘要"],
  [componentPath, "技術 runtime 細節（PM / 工程）"],
  [componentPath, "治理、角色與授權細節"],
  [componentPath, "儀表板頁籤"],
  [componentPath, "總覽"],
  [componentPath, "走勢"],
  [componentPath, "成交量"],
  [componentPath, "股利 / 基本"],
  [componentPath, "新聞信心"],
  [componentPath, "回測驗證"],
  [componentPath, "資料品質"],
  [componentPath, "資料限制"],
  [componentPath, "real score-source mode blocked"],
  [componentPath, "目前分數來源："],
  [componentPath, "真實資料上線"],
  [componentPath, "方法論"],
  [componentPath, "免責聲明"],
  [componentPath, "看完"],
  [componentPath, "回到市場層級交叉檢查"],
  [componentPath, "看每日晨報"],
  [componentPath, "看本週週報"],
  [componentPath, "確認方法論"],
  [componentPath, "確認免責聲明"],
  [packagePath, "\"check:stock-first-screen-readability\": \"node scripts/check-stock-first-screen-readability.mjs\""],
  [reviewGatePath, "scripts/check-stock-first-screen-readability.mjs"]
];

const forbidden = [
  [componentPath, "scoreSource=real approved"],
  [componentPath, "real score-source mode approved"],
  [componentPath, "publicDataSource=supabase approved"],
  [componentPath, "正式投資建議"],
  [componentPath, "隞??"],
  [componentPath, "甇???靘?"],
  [componentPath, "?銵?runtime 蝝啁?"],
  [componentPath, "瘝餌????脰??"],
  [componentPath, "鞈??釭"],
  [componentPath, "?寞?隢?"],
  [componentPath, "?痊?脫?"],
  [componentPath, "createClient"],
  [componentPath, "fetch("]
];

const mojibakePattern = /[\uFFFD\uF000-\uF8FF]/u;
const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (mojibakePattern.test(read(componentPath))) {
  blocked.push(`${componentPath}: contains replacement/private-use mojibake characters`);
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
