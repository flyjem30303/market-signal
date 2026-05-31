import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const internalPageRoot = "src/app/internal";
const internalApiRoot = "src/app/api/internal";
const sitemapPath = "src/app/sitemap.ts";
const robotsPath = "src/app/robots.ts";
const publicEntryFiles = [
  "src/app/page.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/stocks/[symbol]/page.tsx",
  "src/components/dashboard-shell.tsx"
];

const findings = [];
const internalPages = walkFiles(path.join(root, internalPageRoot), ".tsx");
const internalApiRoutes = walkFiles(path.join(root, internalApiRoot), ".ts");

for (const file of internalPages) {
  const normalized = normalize(file);
  const source = fs.readFileSync(file, "utf8");
  const requiredTokens = [
    "assertInternalDiagnosticsAccess",
    'dynamic = "force-dynamic"',
    "robots:",
    "index: false",
    "follow: false"
  ];

  for (const token of requiredTokens) {
    if (!source.includes(token)) {
      findings.push({ file: normalized, issue: `missing internal page policy token: ${token}` });
    }
  }

  assertOrder(normalized, source, "assertInternalDiagnosticsAccess", "getServerRawMarketOverview");
  assertOrder(normalized, source, "assertInternalDiagnosticsAccess", "runDryRunReport");
  assertOrder(normalized, source, "assertInternalDiagnosticsAccess", "readJson");
}

for (const file of internalApiRoutes) {
  const normalized = normalize(file);
  const source = fs.readFileSync(file, "utf8");
  const requiredTokens = [
    'dynamic = "force-dynamic"',
    'process.env.INTERNAL_DIAGNOSTICS_ENABLED !== "true"',
    "isAuthorized(request)",
    'NextResponse.json({ status: "disabled" }, { status: 404 })',
    'NextResponse.json({ status: "unauthorized" }, { status: 401 })'
  ];

  for (const token of requiredTokens) {
    if (!source.includes(token)) {
      findings.push({ file: normalized, issue: `missing internal API policy token: ${token}` });
    }
  }

  assertOrder(normalized, source, 'process.env.INTERNAL_DIAGNOSTICS_ENABLED !== "true"', "if (!isAuthorized(request))");
  assertOrder(normalized, source, "if (!isAuthorized(request))", "const overview = await getServerRawMarketOverview");
}

if (fs.existsSync(path.join(root, robotsPath))) {
  const robots = fs.readFileSync(path.join(root, robotsPath), "utf8");
  for (const token of ['disallow: ["/internal", "/api/internal"]', 'allow: "/"']) {
    if (!robots.includes(token)) {
      findings.push({ file: robotsPath, issue: `missing robots policy token: ${token}` });
    }
  }
}

if (fs.existsSync(path.join(root, sitemapPath))) {
  const sitemap = fs.readFileSync(path.join(root, sitemapPath), "utf8");
  for (const forbidden of ["/internal", "/api/internal"]) {
    if (sitemap.includes(forbidden)) {
      findings.push({ file: sitemapPath, issue: `sitemap must not include ${forbidden}` });
    }
  }
}

for (const file of publicEntryFiles) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) continue;
  const source = fs.readFileSync(absolute, "utf8");

  for (const forbidden of ["/internal", "/api/internal", "Internal Diagnostics", "raw-market-preview"]) {
    if (source.includes(forbidden)) {
      findings.push({ file, issue: `public entry must not reference internal diagnostics: ${forbidden}` });
    }
  }
}

console.log(
  JSON.stringify(
    {
      checked_internal_api_routes: internalApiRoutes.map(normalize),
      checked_internal_pages: internalPages.map(normalize),
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

function walkFiles(directory, extension) {
  if (!fs.existsSync(directory)) return [];
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath, extension));
    } else if (entry.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

function assertOrder(file, source, before, after) {
  if (!source.includes(after)) return;

  const beforeIndex = source.indexOf(before);
  const afterIndex = source.indexOf(after);

  if (!(beforeIndex >= 0 && afterIndex > beforeIndex)) {
    findings.push({ file, issue: `expected ${before} before ${after}` });
  }
}

function normalize(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}
