import fs from "node:fs";

const docPath = "docs/ROLE_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const abPath = "docs/AB_COLLABORATION.md";
const statusPath = "PROJECT_STATUS.md";

const problems = [];

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const ab = read(abPath);
const status = read(statusPath);

for (const phrase of [
  "Mainline PM",
  "CEO / PM / Runtime Engineering",
  "A1: Data / Supabase / Market Evidence",
  "A2: Frontend / UX Readability / Public Copy QA",
  "I: Cloud Deployment / DevOps / Launch Operations",
  "PM remains the only integration owner",
  "I is not a new implementation lane yet",
  "I is a launch-readiness guard",
  "deployment, environment, credential, DNS, monitoring, rollback, and operations risk",
  "No SQL execution",
  "No Supabase writes",
  "No staging rows",
  "No daily_prices writes",
  "No raw market data fetch",
  "No secrets or raw payload printing",
  "Keep publicDataSource=mock",
  "Keep scoreSource=mock",
  "No chairman credentials, OTP, payment-card, or identity-verification input",
  "A1 must not edit A2-owned UI copy surfaces",
  "A2 must not edit A1-owned data evidence",
  "A1 and A2 do not commit independently",
  "I must not deploy, change DNS, change cloud settings, enter secrets",
  "I may block a production-affecting move",
  "one launch guard",
  "A3 is not recommended yet"
]) {
  if (!doc.includes(phrase)) problems.push(`ROLE_WORKSTREAMS missing: ${phrase}`);
}

const expectedScript = "node scripts/check-role-workstreams.mjs";
if (pkg.scripts?.["check:role-workstreams"] !== expectedScript) {
  problems.push("package.json missing check:role-workstreams script");
}

if (!reviewGate.includes("scripts/check-role-workstreams.mjs")) {
  problems.push("review gate missing role-workstreams checker");
}

if (!ab.includes("docs/ROLE_WORKSTREAMS.md")) {
  problems.push("AB collaboration doc must point to ROLE_WORKSTREAMS");
}

if (!status.includes("docs/ROLE_WORKSTREAMS.md")) {
  problems.push("PROJECT_STATUS must point to ROLE_WORKSTREAMS");
}

for (const phrase of [
  "A/B/C/D/E/F/I Collaboration Model",
  "## I：雲端部署 / DevOps / 上線營運負責人",
  "I 不得代替董事長輸入信用卡、帳號密碼、OTP",
  "B/C/D/E/F/I"
]) {
  if (!ab.includes(phrase)) problems.push(`AB_COLLABORATION missing: ${phrase}`);
}

for (const phrase of [
  "PM/A1/A2/I role ownership",
  "A/B/C/D/E/F/I"
]) {
  if (!status.includes(phrase)) problems.push(`PROJECT_STATUS missing: ${phrase}`);
}

const forbidden = [
  /scoreSource=real/i,
  /publicDataSource=supabase/i,
  /SUPABASE_SERVICE_ROLE_KEY=.+/i,
  /sb_secret_/i,
  /sb_publishable_/i
];

for (const pattern of forbidden) {
  if (pattern.test(doc)) problems.push(`ROLE_WORKSTREAMS contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}
