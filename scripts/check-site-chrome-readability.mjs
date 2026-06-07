import fs from "node:fs";

const layoutPath = "src/app/layout.tsx";
const navPath = "src/components/site-nav.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [layoutPath, navPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const navLabels = ["首頁", "今日簡報", "週報", "個股", "方法說明", "隱私權", "使用條款", "風險揭露"];

const required = [
  [layoutPath, "指數燈號 | Taiwan Market Signal"],
  [layoutPath, "Market Signal"],
  [layoutPath, "公開 Beta"],
  [layoutPath, "mock-only"],
  [layoutPath, "資料來源狀態"],
  [layoutPath, "分數來源狀態"],
  [layoutPath, "非投資建議"],
  [layoutPath, "正式上線審核"],
  [layoutPath, "信任與風險連結"],
  [layoutPath, "資料來源：mock-only Beta"],
  [layoutPath, "分數來源：mock-only Beta"],
  [layoutPath, "頁尾導覽"],
  [navPath, "主要導覽"],
  [packagePath, "\"check:site-chrome-readability\": \"node scripts/check-site-chrome-readability.mjs\""],
  [reviewGatePath, "scripts/check-site-chrome-readability.mjs"]
];

for (const label of navLabels) {
  required.push([layoutPath, label]);
  required.push([navPath, label]);
}

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
    if (findMojibakeMarkers(value).length > 0) {
      mojibakeHits.push(`${file}: ${value}`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      blocked,
      checked: {
        navLabels: navLabels.length,
        requiredPhrases: required.length
      },
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

function findMojibakeMarkers(text) {
  const markers = [];
  if (text.includes("\uFFFD")) markers.push("replacement-char");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  if (hasPrivateUseCodePoint(text)) markers.push("private-use-code-point");
  if (/[嚗]{2,}/u.test(text)) markers.push("common-mojibake-run");
  return markers;
}

function hasPrivateUseCodePoint(text) {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint >= 0xe000 && codePoint <= 0xf8ff) return true;
  }
  return false;
}
