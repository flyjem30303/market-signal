import fs from "node:fs";

const docPath = "docs/A2_PUBLIC_BETA_RUNTIME_UX_SAFETY_HANDOFF.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A2 Public Beta Runtime UX Safety Handoff",
  "30 秒 BRIEF",
  "3 分鐘 BRIEF",
  "Home User Understandability",
  "Briefing User Understandability",
  "Trust And Legal Boundaries To Keep",
  "Development Process Information To Move Or Remove",
  "Next Runtime UX Slice",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "not investment advice",
  "does not recommend buying, selling, or timing the market",
  "Do not combine it with A1 data work"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

const forbiddenPatterns = [
  /publicDataSource\s*=\s*supabase/u,
  /publicDataSource\s*=\s*["'`]supabase["'`]/u,
  /scoreSource\s*=\s*real/u,
  /scoreSource\s*=\s*["'`]real["'`]/u,
  /SQL was executed/u,
  /Supabase writes were performed/u,
  /staging rows were created/u,
  /daily_prices (?:was|were) (?:modified|updated|written|repaired)/u,
  /raw market data was (?:fetched|stored|ingested|committed)/u,
  /investment advice is provided/u,
  /buy\/sell recommendation is provided/u,
  /\bsb_(?:publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${String(pattern)}`);
}

for (const marker of findMojibakeMarkers(doc)) {
  problems.push(`${docPath}: ${marker}`);
}

if (
  pkg.scripts?.["check:a2-public-beta-runtime-ux-safety-handoff"] !==
  "node scripts/check-a2-public-beta-runtime-ux-safety-handoff.mjs"
) {
  problems.push(`${packagePath} missing check:a2-public-beta-runtime-ux-safety-handoff script`);
}

for (const phrase of [
  "scripts/check-a2-public-beta-runtime-ux-safety-handoff.mjs",
  "a2-public-beta-runtime-ux-safety-handoff"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

const result = {
  checked: {
    docPath,
    requiredPhrases: requiredPhrases.length,
    forbiddenPatterns: forbiddenPatterns.length
  },
  guardedStatus: "a2_public_beta_runtime_ux_safety_handoff_ready",
  publicDataSource: "mock",
  scoreSource: "mock",
  status: problems.length === 0 ? "ok" : "blocked",
  problems
};

console.log(JSON.stringify(result, null, 2));

if (problems.length > 0) {
  process.exitCode = 1;
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
