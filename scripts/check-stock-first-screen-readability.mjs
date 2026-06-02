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
  [componentPath, "mock-only runtime"],
  [componentPath, "正式分數來源尚未啟用"],
  [componentPath, "技術 runtime 細節（PM / 工程）"],
  [componentPath, "治理、角色與授權細節"],
  [componentPath, "資料品質"],
  [componentPath, "real score-source mode blocked"],
  [componentPath, "目前分數來源："],
  [componentPath, "真實資料上線"],
  [componentPath, "方法論"],
  [componentPath, "免責聲明"],
  [packagePath, "\"check:stock-first-screen-readability\": \"node scripts/check-stock-first-screen-readability.mjs\""],
  [reviewGatePath, "scripts/check-stock-first-screen-readability.mjs"]
];

const forbidden = [
  [componentPath, "scoreSource=real approved"],
  [componentPath, "real score-source mode approved"],
  [componentPath, "publicDataSource=supabase approved"],
  [componentPath, "正式投資建議"],
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
