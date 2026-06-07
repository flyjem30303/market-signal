import fs from "node:fs";

const docPath = "docs/A2_BOUNDED_ROUTE_LOCAL_TRUST_COPY_PATCH.md";
const componentPath = "src/components/route-local-trust-copy-panel.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeContexts = [
  ["src/app/weekly/page.tsx", "weekly"],
  ["src/app/methodology/page.tsx", "methodology"],
  ["src/app/disclaimer/page.tsx", "disclaimer"],
  ["src/app/terms/page.tsx", "terms"],
  ["src/app/privacy/page.tsx", "privacy"]
];

const missing = [];
const blocked = [];

function read(path) {
  if (!fs.existsSync(path)) {
    missing.push(`${path}: file exists`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}

const doc = read(docPath);
const component = read(componentPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const routeFiles = Object.fromEntries(routeContexts.map(([path]) => [path, read(path)]));
const globalCss = read("src/app/globals.css");
const allChangedCopy = [doc, component, globalCss, ...Object.values(routeFiles)].join("\n");

const requiredDocTokens = [
  "a2_bounded_route_local_trust_copy_patch_applied_mock_boundary_preserved",
  "bounded_local_only_copy_patch",
  "CEO decision: `apply_route_local_trust_copy_patch_before_visual_polish`.",
  "PM route: `bounded_weekly_methodology_legal_copy_patch_then_route_health`.",
  "## Changed Public Surfaces",
  "## Copy Coverage",
  "## Boundary",
  "## Acceptance",
  "## PM Result",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Formal launch impact"
];

const requiredComponentTokens = [
  "RouteLocalTrustCopyPanel",
  "disclaimer",
  "methodology",
  "privacy",
  "terms",
  "weekly",
  "publicDataSource=mock",
  "scoreSource=mock",
  "mock-only Beta",
  "freshness metadata",
  "partial coverage",
  "missing/delayed",
  "mock score",
  "non-investment advice",
  "raw market payload",
  "post-run review"
];

for (const token of requiredDocTokens) {
  if (!doc.includes(token)) missing.push(`${docPath}: ${token}`);
}

for (const token of requiredComponentTokens) {
  if (!component.includes(token)) missing.push(`${componentPath}: ${token}`);
}

for (const [path, context] of routeContexts) {
  const text = routeFiles[path] ?? "";
  if (!text.includes('import { RouteLocalTrustCopyPanel } from "@/components/route-local-trust-copy-panel";')) {
    missing.push(`${path}: RouteLocalTrustCopyPanel import`);
  }

  if (!text.includes(`<RouteLocalTrustCopyPanel context="${context}" />`)) {
    missing.push(`${path}: RouteLocalTrustCopyPanel context="${context}"`);
  }

  if (!text.includes(`TrustRuntimeBoundaryNotice context="${context}"`)) {
    missing.push(`${path}: TrustRuntimeBoundaryNotice context="${context}" preserved`);
  }
}

for (const token of [
  ".route-local-trust-copy",
  ".route-local-trust-copy-grid",
  "grid-template-columns: repeat(3, minmax(0, 1fr));"
]) {
  if (!globalCss.includes(token)) missing.push(`src/app/globals.css: ${token}`);
}

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

for (const token of forbiddenClaims) {
  if (allChangedCopy.includes(token)) blocked.push(`forbidden claim: ${token}`);
}

if (packageJson.scripts?.["check:a2-bounded-route-local-trust-copy-patch"] !== "node scripts/check-a2-bounded-route-local-trust-copy-patch.mjs") {
  missing.push(`${packagePath}: check:a2-bounded-route-local-trust-copy-patch`);
}

if (!reviewGate.includes("scripts/check-a2-bounded-route-local-trust-copy-patch.mjs")) {
  missing.push(`${reviewGatePath}: checker registered`);
}

if (!reviewGate.includes('"a2-bounded-route-local-trust-copy-patch"')) {
  missing.push(`${reviewGatePath}: core review gate name`);
}

const result = {
  blocked,
  missing,
  checked: {
    componentTokens: requiredComponentTokens.length,
    docTokens: requiredDocTokens.length,
    forbiddenClaims: forbiddenClaims.length,
    routeContexts: routeContexts.length
  },
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
