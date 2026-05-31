import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const allowedImporters = [
  "src/app/api/internal/raw-market/route.ts",
  "src/app/internal/raw-market-preview/page.tsx",
  "scripts/check-public-release-gate-behavior.mjs",
  "scripts/check-public-release-gate-runtime-wiring.mjs",
  "scripts/check-raw-market-runtime-boundary.mjs"
];

const publicFiles = [
  "src/app/page.tsx",
  "src/app/briefing/page.tsx",
  "src/app/stocks/[symbol]/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx",
  "src/components/dashboard-shell.tsx",
  "src/components/data-freshness-strip.tsx"
];

const routePath = "src/app/api/internal/raw-market/route.ts";
const previewPath = "src/app/internal/raw-market-preview/page.tsx";
const gatePath = "src/lib/public-release-gate.ts";
const findings = [];

for (const file of [routePath, previewPath, gatePath]) {
  if (!fs.existsSync(path.join(root, file))) {
    findings.push({ file, issue: "required public release gate wiring file is missing" });
  }
}

for (const file of walkFiles(["src", "scripts"])) {
  const normalized = normalize(file);
  const content = fs.readFileSync(file, "utf8");
  const importsGate = content.includes("@/lib/public-release-gate") || content.includes("src/lib/public-release-gate.ts");

  if (importsGate && !allowedImporters.includes(normalized)) {
    findings.push({
      file: normalized,
      issue: "public-release-gate may only be imported by internal diagnostics routes and dedicated gate checks"
    });
  }
}

for (const file of publicFiles) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const content = fs.readFileSync(path.join(root, file), "utf8");

  for (const forbidden of ["buildPublicReleaseGate", "PublicReleaseGate", "publicGate", "mixed-data-quality", "mixed-market-adapter"]) {
    if (content.includes(forbidden)) {
      findings.push({
        file,
        issue: `public UI must not wire mixed raw data release gate directly: ${forbidden}`
      });
    }
  }
}

if (fs.existsSync(path.join(root, gatePath))) {
  const gate = fs.readFileSync(path.join(root, gatePath), "utf8");
  const requiredGateTokens = [
    "approved: false;",
    'label: "blocked";',
    'approved: false',
    'label: "blocked"',
    "score-is-mock",
    "score-source-not-approved",
    "score-not-approved-for-public-use",
    "raw-market-data-not-real",
    "mixed-snapshot-unavailable"
  ];
  const forbiddenGateTokens = ['approved: true', 'label: "approved"', "scoreCanBeShownPublicly: true"];

  for (const token of requiredGateTokens) {
    if (!gate.includes(token)) {
      findings.push({ file: gatePath, issue: `missing gate invariant token: ${token}` });
    }
  }

  for (const token of forbiddenGateTokens) {
    if (gate.includes(token)) {
      findings.push({ file: gatePath, issue: `forbidden gate approval token: ${token}` });
    }
  }
}

if (fs.existsSync(path.join(root, routePath))) {
  const route = fs.readFileSync(path.join(root, routePath), "utf8");
  const requiredRouteTokens = [
    "buildMixedMarketSnapshot",
    "buildMixedDataQualitySummary",
    "buildPublicReleaseGate",
    "const publicGate = buildPublicReleaseGate({ mixed, quality });",
    "publicGate,",
    "mockMarketSignalRepository.getSnapshot"
  ];

  for (const token of requiredRouteTokens) {
    if (!route.includes(token)) {
      findings.push({ file: routePath, issue: `missing API gate wiring token: ${token}` });
    }
  }

  assertOrder(routePath, route, "const quality = buildMixedDataQualitySummary(mixed);", "const publicGate = buildPublicReleaseGate({ mixed, quality });");
  assertOrder(routePath, route, "const publicGate = buildPublicReleaseGate({ mixed, quality });", "publicGate,");
}

if (fs.existsSync(path.join(root, previewPath))) {
  const preview = fs.readFileSync(path.join(root, previewPath), "utf8");
  const requiredPreviewTokens = [
    "assertInternalDiagnosticsAccess(searchParams.token);",
    "buildMixedMarketSnapshot",
    "buildMixedDataQualitySummary",
    "buildPublicReleaseGate",
    "const publicGate = buildPublicReleaseGate({ mixed, quality });",
    "Public gate",
    "value={publicGate.label}",
    "publicGate.blockers.map",
    "quality.legalCaveat",
    "mockMarketSignalRepository.getSnapshot",
    "index: false"
  ];

  for (const token of requiredPreviewTokens) {
    if (!preview.includes(token)) {
      findings.push({ file: previewPath, issue: `missing preview gate wiring token: ${token}` });
    }
  }

  assertOrder(previewPath, preview, "assertInternalDiagnosticsAccess(searchParams.token);", "const overview = await getServerRawMarketOverview(symbol, market);");
  assertOrder(previewPath, preview, "const quality = buildMixedDataQualitySummary(mixed);", "const publicGate = buildPublicReleaseGate({ mixed, quality });");
}

console.log(
  JSON.stringify(
    {
      allowedImporters,
      findings,
      status: findings.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (findings.length > 0) {
  process.exit(1);
}

function assertOrder(file, content, before, after) {
  const beforeIndex = content.indexOf(before);
  const afterIndex = content.indexOf(after);

  if (!(beforeIndex >= 0 && afterIndex > beforeIndex)) {
    findings.push({ file, issue: `expected "${before}" before "${after}"` });
  }
}

function walkFiles(directories) {
  const files = [];

  for (const directory of directories) {
    files.push(...walkDirectory(path.join(root, directory)));
  }

  return files;
}

function walkDirectory(directory) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkDirectory(fullPath));
    } else if (/\.(mjs|ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalize(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}
