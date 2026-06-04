import fs from "node:fs";
import path from "node:path";

const forbiddenPublicReferences = ["/internal", "internal/"];
const publicFiles = [
  "src/app/sitemap.xml/route.ts",
  "src/app/robots.txt/route.ts",
  "src/components/dashboard-shell.tsx",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/briefing/page.tsx",
  "src/app/stocks/[symbol]/page.tsx",
  "src/app/weekly/page.tsx"
];
const requiredInternalFiles = [
  "src/app/internal/page.tsx",
  "src/app/internal/cp3-dry-run/page.tsx",
  "src/app/internal/raw-market-preview/page.tsx",
  "src/app/internal/etf-source-readiness/page.tsx"
];

function read(pathname) {
  return fs.readFileSync(pathname, "utf8");
}

function assertFileExists(pathname) {
  if (!fs.existsSync(pathname)) {
    throw new Error(`Missing required internal file: ${pathname}`);
  }
}

const findings = [];

for (const file of requiredInternalFiles) {
  assertFileExists(file);
}

for (const file of publicFiles) {
  if (!fs.existsSync(file)) continue;
  const content = read(file);

  if (file === "src/app/robots.txt/route.ts") {
    if (!content.includes('"Disallow: /internal"') || !content.includes('"Disallow: /api/internal"')) {
      findings.push({
        file,
        issue: "robots must explicitly disallow internal routes"
      });
    }
    continue;
  }

  for (const forbidden of forbiddenPublicReferences) {
    if (content.includes(forbidden)) {
      findings.push({
        file,
        issue: `public reference to ${forbidden}`
      });
    }
  }
}

for (const file of requiredInternalFiles) {
  const content = read(file);

  if (!content.includes("assertInternalDiagnosticsAccess")) {
    findings.push({
      file,
      issue: "missing assertInternalDiagnosticsAccess"
    });
  }

  if (!content.includes("index: false")) {
    findings.push({
      file,
      issue: "missing noindex metadata"
    });
  }
}

console.log(
  JSON.stringify(
    {
      checked_internal_files: requiredInternalFiles.map((file) => path.normalize(file)),
      checked_public_files: publicFiles.map((file) => path.normalize(file)),
      findings,
      status: findings.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (findings.length > 0) {
  process.exitCode = 1;
}
