import fs from "node:fs";
import path from "node:path";

const allowedLoaderImporters = [
  "src/app/api/internal/raw-market/route.ts",
  "src/app/internal/raw-market-preview/page.tsx"
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
const loaderPath = "src/lib/raw-market-loader.ts";

const findings = [];

for (const requiredPath of [routePath, previewPath, loaderPath]) {
  if (!fs.existsSync(requiredPath)) {
    findings.push({ file: requiredPath, issue: "required file is missing" });
  }
}

for (const file of walkFiles("src")) {
  const normalized = path.normalize(file).replaceAll("\\", "/");
  const content = fs.readFileSync(file, "utf8");
  const importsLoader =
    content.includes("@/lib/raw-market-loader") || content.includes('"src/lib/raw-market-loader"');

  if (importsLoader && !allowedLoaderImporters.includes(normalized)) {
    findings.push({
      file: normalized,
      issue: "raw-market-loader may only be imported by internal raw market routes"
    });
  }
}

for (const file of publicFiles) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, "utf8");

  if (content.includes("raw-market-loader") || content.includes("getServerRawMarket")) {
    findings.push({
      file,
      issue: "public UI must not import or call raw market runtime loader"
    });
  }
}

if (fs.existsSync(routePath)) {
  const route = fs.readFileSync(routePath, "utf8");
  const requiredRoutePhrases = [
    'process.env.INTERNAL_DIAGNOSTICS_ENABLED !== "true"',
    'NextResponse.json({ status: "disabled" }, { status: 404 })',
    "if (!isAuthorized(request))",
    'NextResponse.json({ status: "unauthorized" }, { status: 401 })',
    "const overview = await getServerRawMarketOverview(symbol, market);",
    "mockMarketSignalRepository.getSnapshot",
    "buildPublicReleaseGate"
  ];

  for (const phrase of requiredRoutePhrases) {
    if (!route.includes(phrase)) {
      findings.push({ file: routePath, issue: `missing route boundary phrase: ${phrase}` });
    }
  }

  const disabledIndex = route.indexOf('process.env.INTERNAL_DIAGNOSTICS_ENABLED !== "true"');
  const authIndex = route.indexOf("if (!isAuthorized(request))");
  const loaderIndex = route.indexOf("const overview = await getServerRawMarketOverview(symbol, market);");

  if (!(disabledIndex >= 0 && authIndex > disabledIndex && loaderIndex > authIndex)) {
    findings.push({
      file: routePath,
      issue: "raw market API must check disabled state and authorization before loading raw market data"
    });
  }
}

if (fs.existsSync(previewPath)) {
  const preview = fs.readFileSync(previewPath, "utf8");
  const requiredPreviewPhrases = [
    "assertInternalDiagnosticsAccess(searchParams.token);",
    "index: false",
    "const overview = await getServerRawMarketOverview(symbol, market);",
    "mockMarketSignalRepository.getSnapshot",
    "buildPublicReleaseGate"
  ];

  for (const phrase of requiredPreviewPhrases) {
    if (!preview.includes(phrase)) {
      findings.push({ file: previewPath, issue: `missing preview boundary phrase: ${phrase}` });
    }
  }

  const authIndex = preview.indexOf("assertInternalDiagnosticsAccess(searchParams.token);");
  const loaderIndex = preview.indexOf("const overview = await getServerRawMarketOverview(symbol, market);");

  if (!(authIndex >= 0 && loaderIndex > authIndex)) {
    findings.push({
      file: previewPath,
      issue: "raw market preview must authorize before loading raw market data"
    });
  }
}

if (fs.existsSync(loaderPath)) {
  const loader = fs.readFileSync(loaderPath, "utf8");
  const requiredLoaderPhrases = [
    "unstable_noStore as noStore",
    "createServerSupabaseClient()",
    "createSupabaseRawMarketRepository(client)",
    "noStore();"
  ];
  const forbiddenLoaderPhrases = ["NEXT_PUBLIC_DATA_SOURCE", "scoreSource", "insert(", "update(", "delete(", "upsert("];

  for (const phrase of requiredLoaderPhrases) {
    if (!loader.includes(phrase)) {
      findings.push({ file: loaderPath, issue: `missing loader boundary phrase: ${phrase}` });
    }
  }

  for (const phrase of forbiddenLoaderPhrases) {
    if (loader.includes(phrase)) {
      findings.push({ file: loaderPath, issue: `forbidden loader phrase: ${phrase}` });
    }
  }
}

console.log(
  JSON.stringify(
    {
      allowedLoaderImporters,
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

function walkFiles(root) {
  const files = [];

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}
