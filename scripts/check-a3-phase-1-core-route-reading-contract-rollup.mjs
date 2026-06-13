import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_CORE_ROUTE_READING_CONTRACT_ROLLUP.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const releaseCandidatePath = "docs/A3_PHASE_1_RELEASE_CANDIDATE_PUBLIC_SMOKE_REPORT.md";
const goNoGoPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_GO_NO_GO_PACKET.md";
const homeStockPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const stockAtAGlancePath = "src/components/stock-runtime-at-a-glance.tsx";
const decisionLoopCheckerPath = "scripts/check-public-beta-decision-loop-bridge.mjs";
const briefAlignmentCheckerPath = "scripts/check-public-beta-production-brief-alignment.mjs";

const problems = [];

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const releaseCandidate = read(releaseCandidatePath);
const goNoGo = read(goNoGoPath);
const homeStock = read(homeStockPath);
const briefing = read(briefingPath);
const stockAtAGlance = read(stockAtAGlancePath);
const decisionLoopChecker = read(decisionLoopCheckerPath);
const briefAlignmentChecker = read(briefAlignmentCheckerPath);

const scriptName = "check:a3-phase-1-core-route-reading-contract-rollup";
const scriptTarget = "node scripts/check-a3-phase-1-core-route-reading-contract-rollup.mjs";
const gateName = "a3-phase-1-core-route-reading-contract-rollup";

for (const phrase of [
  "a3_phase_1_core_route_reading_contract_rollup_ready",
  "Core Public Reading Contract",
  "Home",
  "Briefing",
  "Stock",
  "30 秒快讀",
  "3 分鐘複核",
  "資料時間",
  "下一步觀察",
  "Home, Briefing, and Stock routes share one public reading contract",
  "Phase 1 public free index-lighting site",
  "Phase 2 membership remains deferred",
  "Data posture remains mock",
  "Score posture remains mock",
  "No SQL execution occurred",
  "No Supabase read/write occurred",
  "No raw market-data fetch, ingest, storage, logging, or commit occurred",
  "check:public-beta-decision-loop-bridge",
  "check:public-beta-production-brief-alignment"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const row of ["| Home | / |", "| Briefing | /briefing |", "| Stock | /stocks/2330 |"]) {
  if (!doc.includes(row)) problems.push(`${docPath} missing route row: ${row}`);
}

for (const phrase of ["首頁快速判讀", "30 秒看懂", "3 分鐘複核", "資料時間", "下一步"]) {
  if (!homeStock.includes(phrase)) problems.push(`${homeStockPath} missing Home reading phrase: ${phrase}`);
}

for (const phrase of ["晨報快速判讀", "30 秒看懂今日市場氣氛", "3 分鐘行動判斷", "資料更新時間", "下一步觀察"]) {
  if (!briefing.includes(phrase)) problems.push(`${briefingPath} missing Briefing reading phrase: ${phrase}`);
}

for (const phrase of ["標的快速判讀", "30 秒看懂標的狀態", "3 分鐘複核風險", "資料時間", "下一步觀察"]) {
  if (!homeStock.includes(phrase)) problems.push(`${homeStockPath} missing Stock reading phrase: ${phrase}`);
}

for (const phrase of ["公開 Beta 狀態", "示範資料", "30 秒內看懂標的狀態", "3 分鐘內確認風險"]) {
  if (!stockAtAGlance.includes(phrase)) problems.push(`${stockAtAGlancePath} missing public stock boundary phrase: ${phrase}`);
}

for (const phrase of ["/", "/briefing", "/stocks/2330", "30 秒看懂標的狀態", "3 分鐘複核風險"]) {
  if (!decisionLoopChecker.includes(phrase)) problems.push(`${decisionLoopCheckerPath} missing decision loop phrase: ${phrase}`);
}

for (const phrase of ["首頁快速判讀", "晨報快速判讀", "標的快速判讀", "公開 Beta 狀態", "/stocks/2330"]) {
  if (!briefAlignmentChecker.includes(phrase)) problems.push(`${briefAlignmentCheckerPath} missing BRIEF alignment phrase: ${phrase}`);
}

if (pkg.scripts?.[scriptName] !== scriptTarget) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

for (const phrase of [`scripts/check-a3-phase-1-core-route-reading-contract-rollup.mjs`, `"${gateName}"`]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing review-gate registration phrase: ${phrase}`);
}

for (const phrase of [
  "cmd.exe /c npm run check:a3-phase-1-core-route-reading-contract-rollup",
  "Home, Briefing, and Stock routes share one public reading contract"
]) {
  if (!releaseCandidate.includes(phrase)) problems.push(`${releaseCandidatePath} missing launch linkage: ${phrase}`);
}

for (const phrase of [
  "Core route reading contract rollup is ok",
  "cmd.exe /c npm run check:a3-phase-1-core-route-reading-contract-rollup"
]) {
  if (!goNoGo.includes(phrase)) problems.push(`${goNoGoPath} missing go/no-go linkage: ${phrase}`);
}

for (const [filePath, content] of [
  [docPath, doc],
  [releaseCandidatePath, releaseCandidate],
  [goNoGoPath, goNoGo]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(content)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a3_phase_1_core_route_reading_contract_rollup_ready",
      routes: ["/", "/briefing", "/stocks/2330"],
      phase: "Phase 1 public free index-lighting site",
      publicDataSource: "mock",
      scoreSource: "mock",
      phase2MembershipDeferred: true,
      productionDeployAuthorized: false
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /production deployment is approved/u,
    /production env mutation is approved/u,
    /raw market data fetch is approved/u,
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /real-time official market data is provided/u,
    /official endorsement is provided/u,
    /guaranteed return is provided/u,
    /investment advice is provided/u,
    /buy\/sell recommendation is provided/u
  ];
}
