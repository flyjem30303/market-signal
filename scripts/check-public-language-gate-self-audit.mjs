import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const auditedCheckers = [
  "scripts/check-public-visible-language-quality.mjs",
  "scripts/check-action-summary-language-quality.mjs"
];

const highRiskFragments = [
  "\uFFFD",
  "?",
  "?梁",
  "?",
  "?桀",
  "?",
  "?",
  "蝣箄",
  "撱箄",
  "雿輻",
  "璇",
  "甈",
  "銝",
  "嚗",
  "",
  "",
  ""
];

const requiredGoodTokens = [
  "免責聲明",
  "使用條款",
  "隱私權政策",
  "publicDataSource=mock",
  "scoreSource=mock"
];

const missing = [];
const blocked = [];

for (const file of auditedCheckers) {
  const source = fs.readFileSync(file, "utf8");
  const passConditionSource = removeAllowedNegativeSamples(source);

  for (const fragment of highRiskFragments) {
    if (passConditionSource.includes(fragment)) {
      blocked.push(`${file}: high-risk mojibake fragment appears outside allowed negative samples: ${fragment}`);
    }
  }
}

const publicVisibleSource = fs.readFileSync("scripts/check-public-visible-language-quality.mjs", "utf8");
for (const token of requiredGoodTokens) {
  if (!publicVisibleSource.includes(token)) {
    missing.push(`scripts/check-public-visible-language-quality.mjs: ${token}`);
  }
}

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
if (!packageJson.includes('"check:public-language-gate-self-audit"')) {
  missing.push(`${packagePath}: check:public-language-gate-self-audit`);
}
if (!reviewGate.includes("scripts/check-public-language-gate-self-audit.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-public-language-gate-self-audit.mjs`);
}

console.log(
  JSON.stringify(
    {
      auditedCheckers,
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

function removeAllowedNegativeSamples(source) {
  return source
    .replace(/const mojibakeFragments = \[[\s\S]*?\];/g, "")
    .replace(/const forbiddenTokens = \[[\s\S]*?\];/g, "")
    .replace(/const forbiddenText = \[[\s\S]*?\];/g, "")
    .replace(/const mojibakePattern = .*?;/g, "")
    .replace(/const replacementOrPrivateUse = .*?;/g, "");
}
