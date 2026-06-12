import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const cssPath = "src/app/globals.css";

const pages = [
  {
    path: "src/app/weekly/page.tsx",
    route: "/weekly",
    required: [
      "className=\"hero\"",
      "runtime-boundary-line",
      "DataFreshnessStrip",
      "TrustRuntimeBoundaryNotice",
      "RouteLocalTrustCopyPanel",
      "weekly-quick-read",
      "weekly-market-action-summary",
      "WeeklyRowCoverageStatus",
      "publicDataSource=mock",
      "scoreSource=mock",
      "非投資建議"
    ]
  },
  {
    path: "src/app/methodology/page.tsx",
    route: "/methodology",
    required: [
      "className=\"hero\"",
      "runtime-boundary-line",
      "DataFreshnessStrip",
      "TrustRuntimeBoundaryNotice",
      "RouteLocalTrustCopyPanel",
      "method-quick-read",
      "method-table",
      "quality-grid",
      "不把分數當指令",
      "非投資建議"
    ]
  },
  {
    path: "src/app/disclaimer/page.tsx",
    route: "/disclaimer",
    required: [
      "className=\"hero\"",
      "runtime-boundary-line",
      "TrustRuntimeBoundaryNotice",
      "RouteLocalTrustCopyPanel",
      "legal-quick-read",
      "legal-section",
      "legal-links",
      "示範資料",
      "非投資建議",
      "請自行查證並評估風險"
    ]
  },
  {
    path: "src/app/terms/page.tsx",
    route: "/terms",
    required: [
      "className=\"hero\"",
      "runtime-boundary-line",
      "TrustRuntimeBoundaryNotice",
      "RouteLocalTrustCopyPanel",
      "legal-quick-read",
      "legal-section",
      "legal-links",
      "示範資料",
      "非投資建議",
      "請自行評估風險"
    ]
  },
  {
    path: "src/app/privacy/page.tsx",
    route: "/privacy",
    required: [
      "className=\"hero\"",
      "runtime-boundary-line",
      "TrustRuntimeBoundaryNotice",
      "RouteLocalTrustCopyPanel",
      "legal-quick-read",
      "legal-section",
      "legal-links",
      "不需要輸入 API key",
      "不顯示 secrets",
      "不公開原始市場資料內容"
    ]
  }
];

const sharedFiles = [
  {
    path: "src/components/route-local-trust-copy-panel.tsx",
    required: [
      "route-local-trust-copy panel",
      "route-local-trust-copy-grid",
      "Launch Boundary",
      "publicDataSource=mock",
      "scoreSource=mock",
      "不構成投資建議",
      "mock-only"
    ]
  },
  {
    path: "src/components/trust-runtime-boundary-notice.tsx",
    required: [
      "trust-runtime-boundary-notice",
      "PublicRuntimeStateStrip",
      "publicDataSource=mock; scoreSource=mock",
      "Do not describe mock signals as real data",
      "formal investment advice"
    ]
  },
  {
    path: cssPath,
    required: [
      ".route-local-trust-copy",
      ".route-local-trust-copy-grid",
      ".legal-quick-read",
      ".method-quick-read",
      ".weekly-quick-read",
      ".trust-runtime-boundary-notice"
    ]
  }
];

const forbiddenPublicSurfaceTokens = [
  "PUBLIC_BETA_EXTERNAL_REPLY",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "cmd.exe /c npm",
  "operator packet",
  "execution packet",
  "post-run review",
  "SQL execution is approved",
  "Supabase writes are approved",
  "publicDataSource=supabase is approved",
  "scoreSource=real is approved",
  "real market data is live",
  "complete coverage is approved",
  "investment advice is allowed"
];

const missing = [];
const blocked = [];

for (const page of pages) {
  const source = read(page.path);

  for (const phrase of page.required) {
    if (!source.includes(phrase)) missing.push(`${page.path}: ${phrase}`);
  }

  const articleCount = countOccurrences(source, "<article");
  if (articleCount < 3) missing.push(`${page.path}: at least three route-local cards/articles`);

  for (const marker of findMojibakeMarkers(source)) {
    blocked.push(`${page.path}: mojibake marker ${marker}`);
  }

  for (const token of forbiddenPublicSurfaceTokens) {
    if (source.includes(token)) blocked.push(`${page.path}: forbidden public-surface token ${token}`);
  }
}

for (const item of sharedFiles) {
  const source = read(item.path);
  for (const phrase of item.required) {
    if (!source.includes(phrase)) missing.push(`${item.path}: ${phrase}`);
  }

  for (const marker of findMojibakeMarkers(source)) {
    blocked.push(`${item.path}: mojibake marker ${marker}`);
  }
}

const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

if (
  packageJson.scripts?.["check:public-beta-route-local-trust-visual-consistency"] !==
  "node scripts/check-public-beta-route-local-trust-visual-consistency.mjs"
) {
  missing.push(`${packagePath}: check:public-beta-route-local-trust-visual-consistency`);
}

for (const phrase of [
  "scripts/check-public-beta-route-local-trust-visual-consistency.mjs",
  "public-beta-route-local-trust-visual-consistency"
]) {
  if (!reviewGate.includes(phrase)) missing.push(`${reviewGatePath}: ${phrase}`);
}

const result = {
  blocked,
  checked: {
    forbiddenPublicSurfaceTokens: forbiddenPublicSurfaceTokens.length,
    pages: pages.map((page) => page.route),
    sharedFiles: sharedFiles.length
  },
  missing,
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

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

function countOccurrences(text, needle) {
  return text.split(needle).length - 1;
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
