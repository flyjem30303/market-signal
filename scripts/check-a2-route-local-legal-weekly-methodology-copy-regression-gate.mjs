import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const docPath = "docs/A2_ROUTE_LOCAL_LEGAL_WEEKLY_METHODOLOGY_COPY_REGRESSION_GATE.md";

const routeContracts = [
  {
    path: "src/app/weekly/page.tsx",
    required: ["市場週報", "30 秒", "3 分鐘", "正式資料尚未啟用", "示範資料", "示範分數", "不提供買賣建議", "資料更新時間"]
  },
  {
    path: "src/app/methodology/page.tsx",
    required: ["方法說明", "燈號方法", "市場氣氛", "核心指標", "資料品質", "資料狀態", "覆蓋率", "更新時間", "不是交易指令", "不提供買賣建議"]
  },
  {
    path: "src/app/disclaimer/page.tsx",
    required: ["風險聲明", "公開 Beta", "示範資料", "正式市場資料尚未啟用", "不是投資建議", "不提供買賣建議", "市場風險自負"]
  },
  {
    path: "src/app/terms/page.tsx",
    required: ["使用條款", "市場資訊整理", "風險辨識", "不是投資建議", "資料來源", "更新時間", "自行承擔風險"]
  },
  {
    path: "src/app/privacy/page.tsx",
    required: ["隱私權與資料說明", "公開 Beta", "資料來源", "不要在任何表單", "交易帳戶", "會員功能資料邊界"]
  },
  {
    path: "src/app/layout.tsx",
    required: ["/methodology", "/disclaimer", "/privacy", "/terms"]
  },
  {
    path: "src/components/route-local-trust-copy-panel.tsx",
    required: ["揭露摘要", "方法摘要", "隱私摘要", "條款摘要", "週報摘要", "不是個別投資建議"]
  }
];

const docRequiredTokens = [
  "a2_route_local_legal_weekly_methodology_copy_regression_gate_ready",
  "bounded_local_only_route_copy_regression",
  "## Boundary",
  "## Regression Scope",
  "## Required Public Trust Topics",
  "## Accepted Evidence",
  "## A2 Next Assignment",
  "## PM Record"
];

const boundaryTokens = [
  "Keep `publicDataSource=mock`.",
  "Keep `scoreSource=mock`.",
  "Do not set `publicDataSource=supabase`.",
  "Do not set `scoreSource=real`.",
  "Do not run SQL.",
  "Do not write Supabase.",
  "Do not modify `daily_prices`.",
  "Do not fetch, ingest, store, or commit raw market data."
];

const forbiddenPublicResidue = [
  "cmd.exe",
  "npm run",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "Supabase",
  "SQL",
  "daily_prices",
  "raw market data",
  "raw market payloads",
  "raw payload",
  "row payloads",
  "stock id payloads",
  "secrets",
  "Runtime Status",
  "promotion gate",
  "Phase 1",
  "Phase 2",
  "Membership MVP"
];

const forbiddenClaims = [
  "publicDataSource=supabase is approved",
  "scoreSource=real is approved",
  "real market data is live",
  "complete coverage is approved",
  "investment advice is allowed",
  "validated forecast is approved",
  "provider redistribution is approved",
  "SQL execution is allowed",
  "Supabase writes are allowed",
  "raw market data was fetched",
  "secrets were printed",
  "row payloads were printed",
  "stock id payloads were printed"
];

const missing = [];
const blocked = [];

const doc = read(docPath);
const packageJson = JSON.parse(read(packagePath) || "{}");
const reviewGate = read(reviewGatePath);

for (const token of [...docRequiredTokens, ...boundaryTokens]) {
  if (!doc.includes(token)) missing.push(`${docPath}: ${token}`);
}

for (const route of routeContracts) {
  const source = read(route.path);
  for (const token of route.required) {
    if (!source.includes(token)) missing.push(`${route.path}: ${token}`);
  }

  for (const residue of forbiddenPublicResidue) {
    if (source.includes(residue)) blocked.push(`${route.path}: public residue ${residue}`);
  }

  for (const claim of forbiddenClaims) {
    if (source.includes(claim)) blocked.push(`${route.path}: forbidden claim ${claim}`);
  }

  for (const marker of findMojibakeMarkers(source)) {
    blocked.push(`${route.path}: mojibake marker ${marker}`);
  }
}

if (packageJson.scripts?.["check:a2-route-local-legal-weekly-methodology-copy-regression-gate"] !== "node scripts/check-a2-route-local-legal-weekly-methodology-copy-regression-gate.mjs") {
  missing.push(`${packagePath}: check:a2-route-local-legal-weekly-methodology-copy-regression-gate`);
}

if (!reviewGate.includes("scripts/check-a2-route-local-legal-weekly-methodology-copy-regression-gate.mjs")) {
  missing.push(`${reviewGatePath}: checker registered`);
}

if (!reviewGate.includes('"a2-route-local-legal-weekly-methodology-copy-regression-gate"')) {
  missing.push(`${reviewGatePath}: core review gate name`);
}

const sectionOrder = [
  "## Boundary",
  "## Regression Scope",
  "## Required Public Trust Topics",
  "## Accepted Evidence",
  "## A2 Next Assignment",
  "## PM Record"
].map((section) => doc.indexOf(section));

if (sectionOrder.some((index) => index < 0) || !sectionOrder.every((index, i) => i === 0 || index > sectionOrder[i - 1])) {
  blocked.push(`${docPath}: required sections out of order`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      checked: {
        boundaryTokens: boundaryTokens.length,
        docTokens: docRequiredTokens.length,
        forbiddenClaims: forbiddenClaims.length,
        forbiddenPublicResidue: forbiddenPublicResidue.length,
        routeContracts: routeContracts.length
      },
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    missing.push(`${filePath}: file exists`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (text.includes("\uFFFD")) markers.push("replacement-char");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  if (hasPrivateUseCodePoint(text)) markers.push("private-use-code-point");
  if (/(?:嚗|銝|蝭|憟|璅|鞈|撣|閮|瘥|摨|甈|雿|蹐|蹓||){2,}/u.test(text)) {
    markers.push("common-mojibake-run");
  }
  return markers;
}

function hasPrivateUseCodePoint(text) {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint >= 0xe000 && codePoint <= 0xf8ff) return true;
  }
  return false;
}
