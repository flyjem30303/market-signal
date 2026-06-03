import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const files = [
  "src/lib/home-market-action-summary.ts",
  "src/lib/investor-action-summary.ts",
  "src/lib/briefing-market-action-summary.ts",
  "src/lib/weekly-market-action-summary.ts"
];

const requiredTokens = ["publicDataSource=mock", "scoreSource=mock"];
const requiredReadableTokens = ["資料", "風險", "mock"];
const forbiddenTokens = [
  "@supabase/supabase-js",
  "createClient",
  "fetch(",
  ".from(\"",
  ".from('",
  "process.env",
  "scoreSource=real",
  "publicDataSource=supabase"
];
const replacementOrPrivateUse = /[\uFFFD\uF000-\uF8FF]/u;
const mojibakePattern = /[嚗]{2,}/u;
const asciiQuestionRun = /\?{3,}/u;

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");

  for (const token of requiredTokens) {
    if (!content.includes(token)) missing.push(`${file}: ${token}`);
  }

  for (const token of requiredReadableTokens) {
    if (!content.includes(token)) missing.push(`${file}: readable token ${token}`);
  }

  for (const token of forbiddenTokens) {
    if (content.includes(token)) blocked.push(`${file}: ${token}`);
  }

  if (replacementOrPrivateUse.test(content)) {
    blocked.push(`${file}: replacement/private-use character`);
  }

  if (mojibakePattern.test(content)) {
    blocked.push(`${file}: possible mojibake character run`);
  }

  if (asciiQuestionRun.test(content)) {
    blocked.push(`${file}: possible mojibake question-mark run`);
  }
}

if (!packageJson.includes('"check:action-summary-language-quality"')) {
  missing.push(`${packagePath}: check:action-summary-language-quality`);
}

if (!reviewGate.includes("check-action-summary-language-quality.mjs")) {
  missing.push(`${reviewGatePath}: check-action-summary-language-quality.mjs`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      checkedFiles: files,
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
