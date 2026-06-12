import fs from "node:fs";

const docPath = "docs/A2_HOME_FIRST_SCREEN_PUBLIC_COPY_HANDOFF.md";
const dashboardPath = "src/components/dashboard-shell.tsx";
const checkerPath = "scripts/check-a2-home-first-screen-public-copy-handoff.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const scriptName = "check:a2-home-first-screen-public-copy-handoff";
const gateName = "a2-home-first-screen-public-copy-handoff";

const missing = [];
const blocked = [];

const doc = read(docPath);
const dashboard = read(dashboardPath);
const checker = read(checkerPath);
const packageJson = JSON.parse(read(packagePath) || "{}");
const reviewGate = read(reviewGatePath);

const requiredDocTokens = [
  "A2 Home First Screen Public Copy Handoff",
  "30 second market atmosphere",
  "3 minute action judgment",
  "Three-layer view",
  "market atmosphere, action judgment, and evidence/runtime boundary",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Non-investment advice",
  "not investment advice",
  "hard blockers",
  "cmd.exe",
  "packet proof",
  "pre-launch executable",
  "Do not run SQL.",
  "Do not connect to Supabase.",
  "Do not write Supabase.",
  "Do not create staging rows.",
  "Do not modify `daily_prices`.",
  "Do not fetch, store, print, or submit raw market data.",
  "Do not print secrets or raw payloads.",
  "Do not set `publicDataSource=supabase`.",
  "Do not set `scoreSource=real`."
];

for (const token of requiredDocTokens) {
  if (!doc.includes(token)) missing.push(`${docPath}: ${token}`);
}

if (packageJson.scripts?.[scriptName] !== `node ${checkerPath}`) {
  missing.push(`${packagePath}: ${scriptName}`);
}

for (const [sourcePath, source, token] of [
  [reviewGatePath, reviewGate, checkerPath],
  [reviewGatePath, reviewGate, `name: "${gateName}"`],
  [reviewGatePath, reviewGate, `"${gateName}"`],
  [checkerPath, checker, "firstScreenPublicCopy"],
  [checkerPath, checker, "forbiddenFirstScreenPublicCopyPatterns"]
]) {
  if (!source.includes(token)) missing.push(`${sourcePath}: ${token}`);
}

const firstScreenPublicCopy = extractFirstScreenPublicCopy(dashboard);
if (!firstScreenPublicCopy.trim()) {
  blocked.push(`${dashboardPath}: first screen public copy slice could not be located`);
}

for (const pattern of forbiddenFirstScreenPublicCopyPatterns()) {
  if (pattern.test(firstScreenPublicCopy)) {
    blocked.push(`${dashboardPath}: first screen public copy contains engineering string ${String(pattern)}`);
  }
}

console.log(
  JSON.stringify(
    {
      blocked,
      checked: {
        dashboardFirstScreenSliceLength: firstScreenPublicCopy.length,
        docPath,
        packageScript: scriptName,
        reviewGate: gateName
      },
      missing,
      publicDataSource: "mock",
      scoreSource: "mock",
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
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function extractFirstScreenPublicCopy(source) {
  const heroStart = source.indexOf('<section className="hero">');
  const firstHomePanelStart = source.indexOf("{!includeSeoContent && <HomeProductOverview", heroStart);

  if (heroStart === -1) return "";

  const end = firstHomePanelStart === -1 ? source.indexOf("</main>", heroStart) : firstHomePanelStart;
  return source.slice(heroStart, end === -1 ? undefined : end);
}

function forbiddenFirstScreenPublicCopyPatterns() {
  return [
    /\bhard blockers?\b/iu,
    /\bcmd\.exe\b/iu,
    /\bpacket proof\b/iu,
    /\bpre-launch executable\b/iu
  ];
}
