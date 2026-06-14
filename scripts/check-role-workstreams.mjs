import fs from "node:fs";

const docPath = "docs/ROLE_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const problems = [];

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const phrase of [
  "Mainline PM",
  "CEO / PM / Runtime Engineering",
  "A1: Data / Source / Coverage",
  "A2: Public Copy / Product Safety",
  "A3: Launch / Production Engineering",
  "A4: Membership MVP Planning",
  "PM remains the only integration owner",
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
  "A3 must not deploy, change DNS, change cloud settings, enter secrets",
  "A4 must not implement Phase 2 runtime features during Phase 1",
  "A1/A2/A3/A4 do not commit independently"
]) {
  if (!doc.includes(phrase)) problems.push(`ROLE_WORKSTREAMS missing: ${phrase}`);
}

for (const phrase of [
  "## Current Blocker-Closure Assignments",
  "PM mainline: integrate blocker closure into runtime decision surfaces",
  "A1: prepare data-quality evidence, row-coverage readiness, field-validity QA, and downgrade-rule handoff material",
  "A2: review whether blocker closure is understandable to users",
  "mock-only status, source-rights limits, model-credibility limits, and real-score stop lines",
  "A3: stay guard-only unless work becomes production-affecting",
  "A4: keep Phase 2 membership planning ready",
  "PM may run mainline, A1, A2, A3, and A4 in parallel"
]) {
  if (!doc.includes(phrase)) problems.push(`ROLE_WORKSTREAMS missing blocker-closure assignment: ${phrase}`);
}

const expectedScript = "node scripts/check-role-workstreams.mjs";
if (pkg.scripts?.["check:role-workstreams"] !== expectedScript) {
  problems.push("package.json missing check:role-workstreams script");
}

if (!reviewGate.includes("scripts/check-role-workstreams.mjs")) {
  problems.push("review gate missing role-workstreams checker");
}

if (!status.includes("docs/ROLE_WORKSTREAMS.md")) {
  problems.push("PROJECT_STATUS must point to ROLE_WORKSTREAMS");
}

for (const marker of findBadEncodingMarkers(doc)) {
  problems.push(`${docPath} contains ${marker}`);
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
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}

function findBadEncodingMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-character");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱", "擗", "", "", "芷"]) {
    if (source.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
  return markers;
}
