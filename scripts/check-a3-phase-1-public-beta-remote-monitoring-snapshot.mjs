import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_REMOTE_MONITORING_SNAPSHOT.md";
const releaseOpsPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const baseUrl = (process.env.PUBLIC_BETA_MONITORING_BASE_URL ?? "https://market-signal-two.vercel.app").replace(/\/+$/u, "");
const timeoutMs = Number.parseInt(process.env.PUBLIC_BETA_MONITORING_TIMEOUT_MS ?? "20000", 10);

const problems = [];
const doc = read(docPath);
const releaseOps = read(releaseOpsPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const routeContracts = [
  {
    route: "/",
    tokens: ["指數狀態儀表站", "30 秒", "3 分鐘", "示範資料", "非投資建議"]
  },
  {
    route: "/briefing",
    tokens: ["市場簡報", "30 秒", "3 分鐘", "示範資料", "非投資建議"]
  },
  {
    route: "/weekly",
    tokens: ["市場週報", "30 秒", "3 分鐘", "示範資料", "非投資建議"]
  },
  {
    route: "/membership",
    tokens: ["會員功能預覽", "市場三層解讀", "自選追蹤", "盤後複盤", "非投資建議"]
  },
  {
    route: "/stocks/2330",
    tokens: ["2330", "台積電", "30 秒", "3 分鐘", "非投資建議"]
  },
  {
    route: "/stocks/TWII",
    tokens: ["TWII", "台灣加權指數", "30 秒", "3 分鐘", "非投資建議"]
  },
  {
    route: "/methodology",
    tokens: ["燈號", "方法", "示範資料", "非投資建議"]
  },
  {
    route: "/disclaimer",
    tokens: ["風險聲明", "非投資建議", "資料", "投資決策"]
  },
  {
    route: "/terms",
    tokens: ["使用條款", "非投資建議", "資料", "服務"]
  },
  {
    route: "/privacy",
    tokens: ["隱私", "資料", "會員", "個人化"]
  },
  {
    route: "/robots.txt",
    tokens: []
  },
  {
    route: "/sitemap.xml",
    tokens: ["/membership"]
  }
];

const forbiddenVisibleFragments = [
  "cmd.exe",
  "npm run",
  "PUBLIC_BETA_",
  "BETA_",
  "hard blocker",
  "Hard Blocker",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "workflow proof",
  "daily_prices",
  "raw market data",
  "raw payload",
  "publicDataSource",
  "scoreSource",
  "Supabase",
  "SQL",
  "commit ",
  "Git",
  "operator-only"
];

for (const phrase of [
  "a3_phase_1_public_beta_remote_monitoring_snapshot_ready",
  "Default Remote Target",
  "Remote Route Contract",
  "Public Residue Stop Lines",
  "Runtime Boundary",
  "Workstream Ownership",
  "Stop Lines",
  "CEO Recommendation",
  "https://market-signal-two.vercel.app",
  "PUBLIC_BETA_MONITORING_BASE_URL",
  "publicDataSource=mock",
  "scoreSource=mock",
  "publicDataSource=supabase",
  "scoreSource=real"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const contract of routeContracts) {
  if (!doc.includes(`| \`${contract.route}\` |`)) problems.push(`${docPath} missing route contract: ${contract.route}`);
}

for (const lane of ["PM mainline", "A1", "A2", "A3", "A4"]) {
  if (!doc.includes(`| ${lane} |`)) problems.push(`${docPath} missing workstream lane: ${lane}`);
}

for (const stopLine of [
  "production deploy",
  "DNS change",
  "production env mutation",
  "SQL execution",
  "Supabase read/write",
  "staging-row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "Phase 2 login"
]) {
  if (!doc.includes(stopLine)) problems.push(`${docPath} missing stop line: ${stopLine}`);
}

if (!releaseOps.includes("A3_PHASE_1_PUBLIC_BETA_REMOTE_MONITORING_SNAPSHOT.md")) {
  problems.push(`${releaseOpsPath} missing remote monitoring snapshot linkage`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-remote-monitoring-snapshot"] !==
  "node scripts/check-a3-phase-1-public-beta-remote-monitoring-snapshot.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-remote-monitoring-snapshot script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-remote-monitoring-snapshot.mjs")) {
  problems.push(`${reviewGatePath} missing a3 remote monitoring snapshot checker`);
}

const routeResults = [];
for (const contract of routeContracts) {
  routeResults.push(await checkRemoteRoute(contract));
}

for (const result of routeResults) {
  if (!result.pass) {
    problems.push(`${result.route} remote monitor failed: ${JSON.stringify(result)}`);
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ baseUrl, problems, routeResults, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      baseUrl,
      checkedRoutes: routeResults.length,
      guardedStatus: "a3_phase_1_public_beta_remote_monitoring_snapshot_ready",
      marketDataFetched: false,
      phase: "Phase 1 public free index-lighting site",
      platformMutationExecuted: false,
      publicDataSource: "mock",
      routeResults,
      scoreSource: "mock",
      sqlExecuted: false,
      status: "ok",
      supabaseReadOrWriteExecuted: false
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

async function checkRemoteRoute(contract) {
  const routeUrl = `${baseUrl}${contract.route}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(routeUrl, { signal: controller.signal });
    const text = await response.text();
    clearTimeout(timeout);

    const visibleText = contract.route.endsWith(".xml") || contract.route.endsWith(".txt")
      ? text
      : normalizeVisibleText(text);
    const missingTokens = contract.tokens.filter((token) => !visibleText.includes(token));
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const mojibakeHits = findMojibakeMarkers(visibleText);

    return {
      forbiddenHits,
      missingTokens,
      mojibakeHits,
      pass: response.status === 200 && missingTokens.length === 0 && forbiddenHits.length === 0 && mojibakeHits.length === 0,
      route: contract.route,
      statusCode: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      forbiddenHits: [],
      missingTokens: contract.tokens,
      mojibakeHits: [],
      pass: false,
      route: contract.route,
      statusCode: 0
    };
  }
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/giu, " ")
    .replace(/<style[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/&nbsp;/gu, " ")
    .replace(/&amp;/gu, "&")
    .replace(/\s+/gu, " ")
    .trim();
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/[\u0080-\u009f]/u.test(text)) markers.push("c1-control-character");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱", "擗", "", "", "芷"]) {
    if (text.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
  return [...new Set(markers)];
}

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /production deployment is approved/u,
    /production env mutation is approved/u,
    /raw market data fetch is approved/u,
    /scoreSource=real is approved/u,
    /publicDataSource=supabase is approved/u
  ];
}
