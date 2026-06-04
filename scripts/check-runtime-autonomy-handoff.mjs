import fs from "node:fs";

const docPath = "docs/RUNTIME_AUTONOMY_HANDOFF.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const problems = [];

const doc = read(docPath);
const roleDoc = read(rolePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const phrase of [
  "Runtime Autonomy Handoff",
  "CEO / PM / Runtime Engineering",
  "PM is the only integration owner",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Mainline readonly / row coverage integration is local-ready and remote-separate",
  "bounded readiness, packet bridge, row coverage preexecution packet, and attempt decision",
  "exactly one bounded readonly row coverage attempt as a separate action",
  "Latest verified state: full review gate is `ok`",
  "localhost content/full health is `ok`",
  "briefing / weekly row coverage panels plus the shared row coverage readiness panel",
  "Runtime guard summary readability",
  "Freshness / readonly / mock-boundary copy",
  "Use larger coherent slices",
  "report:mainline-readonly-row-coverage-integration",
  "check:mainline-readonly-row-coverage-integration",
  "No Git backup, staging, commit, or push",
  "No SQL execution",
  "No Supabase writes",
  "No raw market data fetch",
  "No secrets or raw payload printing",
  "No action likely to trigger a permission prompt",
  "No Supabase public source promotion",
  "No real score source activation",
  "A1 may prepare sanitized evidence packets",
  "A2 may prepare visible-copy and readability candidates",
  "I may prepare launch, environment, credential, DNS, monitoring, rollback",
  "full review gate",
  "pass: true",
  "stale thread paths",
  "mojibake",
  "Action summaries on home, stock, briefing, and weekly pages",
  "PM project progress panel",
  "sourcePacket",
  "display fields",
  "Row coverage panels and the shared row coverage readiness panel",
  "Mainline readonly / row coverage integration should stay local-only",
  "stale Next dev server on port 3000",
  "npm run dev:recover",
  "localhost content/full health",
  "public visible language checks",
  "expected `blocked` status"
]) {
  if (!doc.includes(phrase)) problems.push(`handoff missing: ${phrase}`);
}

for (const phrase of [
  "A1: Data / Supabase / Market Evidence",
  "A2: Frontend / UX Readability / Public Copy QA",
  "I: Cloud Deployment / DevOps / Launch Operations"
]) {
  if (!roleDoc.includes(phrase)) problems.push(`ROLE_WORKSTREAMS missing related role: ${phrase}`);
}

if (pkg.scripts?.["check:runtime-autonomy-handoff"] !== "node scripts/check-runtime-autonomy-handoff.mjs") {
  problems.push("package.json missing check:runtime-autonomy-handoff script");
}

if (!reviewGate.includes("scripts/check-runtime-autonomy-handoff.mjs")) {
  problems.push("review gate missing runtime autonomy handoff checker");
}

if (!status.includes("docs/RUNTIME_AUTONOMY_HANDOFF.md")) {
  problems.push("PROJECT_STATUS must point to RUNTIME_AUTONOMY_HANDOFF");
}

const forbidden = [
  /publicDataSource=supabase/i,
  /scoreSource=real/i,
  /SUPABASE_SERVICE_ROLE_KEY=.+/i,
  /sb_secret_/i,
  /sb_publishable_/i,
  /CEO Decision:\s*APPROVE/i
];

for (const pattern of forbidden) {
  if (pattern.test(doc)) problems.push(`handoff contains forbidden token: ${pattern}`);
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
