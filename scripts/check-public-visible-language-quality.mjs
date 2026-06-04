import fs from "node:fs";
import { localhostContentHealthChecks, localhostStatusHealthPaths } from "./localhost-health-config.mjs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-public-visible-language-quality.mjs";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const coreRuntimeBoundaryRequired = [
  "Runtime",
  "mock",
  "publicDataSource=mock",
  "scoreSource=mock",
  "資料新鮮度",
  "scoreSource"
];

const pages = [
  {
    path: "/",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/TWII",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap", "TWII Mock Disclosure"]
  },
  {
    path: "/stocks/2330",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/0050",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/006208",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/2382",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/2308",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/briefing",
    required: ["PM project progress", ...coreRuntimeBoundaryRequired]
  },
  {
    path: "/weekly",
    required: coreRuntimeBoundaryRequired
  },
  {
    path: "/methodology",
    required: coreRuntimeBoundaryRequired
  },
  {
    path: "/disclaimer",
    required: [...coreRuntimeBoundaryRequired, "免責聲明", "不構成投資建議", "非投資建議"]
  },
  {
    path: "/terms",
    required: [...coreRuntimeBoundaryRequired, "使用條款", "不得視為交易指示", "資料限制"]
  },
  {
    path: "/privacy",
    required: [...coreRuntimeBoundaryRequired, "隱私政策", "不收集交易帳戶資料", "localStorage"]
  }
];

const visiblePagePaths = pages.map((page) => page.path);
const expectedVisiblePaths = unique([
  ...localhostStatusHealthPaths.filter((path) => path !== "/robots.txt"),
  ...localhostContentHealthChecks.map((check) => check.path),
  "/methodology",
  "/disclaimer",
  "/terms",
  "/privacy"
]);

const forbiddenText = [
  "Internal Server Error",
  "ERR_CONNECTION_REFUSED",
  "Visible now: real",
  "Visible now: supabase",
  "scoreSource=real approved",
  "publicDataSource=supabase approved",
  "claimApproval=approved"
];

const results = [];

for (const page of pages) {
  const url = `${baseUrl}${page.path}`;
  const response = await fetch(url);
  const html = await response.text();
  const text = normalizeVisibleText(html);
  const markerHits = findMojibakeMarkers(text);
  const forbiddenHits = forbiddenText.filter((fragment) => text.includes(fragment));
  const missing = page.required.filter((phrase) => !text.includes(phrase));

  results.push({
    forbiddenHits,
    markerHits,
    missing,
    pass: response.status === 200 && markerHits.length === 0 && forbiddenHits.length === 0 && missing.length === 0,
    path: page.path,
    status: response.status
  });
}

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const checkerSource = fs.readFileSync(checkerPath, "utf8");
const registration = [
  {
    file: packagePath,
    pass: packageJson.includes('"check:public-visible-language-quality": "node scripts/check-public-visible-language-quality.mjs"')
  },
  {
    file: reviewGatePath,
    pass: reviewGate.includes("scripts/check-public-visible-language-quality.mjs")
  }
];
const routeAlignment = expectedVisiblePaths.map((path) => ({
  pass: visiblePagePaths.includes(path),
  path
}));
const selfContract = [
  {
    check: "requires publicDataSource mock",
    pass: checkerSource.includes('"publicDataSource=mock"')
  },
  {
    check: "requires scoreSource mock",
    pass: checkerSource.includes('"scoreSource=mock"')
  },
  {
    check: "blocks approved scoreSource real claims",
    pass: checkerSource.includes('"scoreSource=real approved"')
  },
  {
    check: "blocks approved publicDataSource supabase claims",
    pass: checkerSource.includes('"publicDataSource=supabase approved"')
  },
  {
    check: "requires readable legal pages",
    pass:
      checkerSource.includes('"免責聲明"') &&
      checkerSource.includes('"使用條款"') &&
      checkerSource.includes('"隱私政策"')
  },
  {
    check: "checker source avoids private-use mojibake literals",
    pass: !hasPrivateUseCodePoint(checkerSource) && checkerSource.includes("findMojibakeMarkers")
  },
  {
    check: "aligns with localhost health paths",
    pass: checkerSource.includes("localhostStatusHealthPaths") && checkerSource.includes("localhostContentHealthChecks")
  }
];

const failed = results.filter((result) => !result.pass);
const registrationFailed = registration.filter((result) => !result.pass);
const routeAlignmentFailed = routeAlignment.filter((result) => !result.pass);
const selfContractFailed = selfContract.filter((result) => !result.pass);

console.log(
  JSON.stringify(
    {
      registration,
      results,
      routeAlignment,
      selfContract,
      status:
        failed.length === 0 && registrationFailed.length === 0 && routeAlignmentFailed.length === 0 && selfContractFailed.length === 0
          ? "ok"
          : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0 || registrationFailed.length > 0 || routeAlignmentFailed.length > 0 || selfContractFailed.length > 0) {
  process.exitCode = 1;
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (text.includes("\uFFFD")) markers.push("replacement-char");
  if (/\?{2,}/u.test(text)) markers.push("question-mark-run");
  if (hasPrivateUseCodePoint(text)) markers.push("private-use-code-point");
  if (/(?:嚗|銝|蝭|憟|璅|鞈|撣|閮|瘥|摨|甈|雿|蹐|蹓){2,}/u.test(text)) {
    markers.push("common-mojibake-run");
  }
  if (/嚙|稽/u.test(text)) markers.push("known-mojibake-char");
  return markers;
}

function hasPrivateUseCodePoint(text) {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint >= 0xe000 && codePoint <= 0xf8ff) return true;
  }
  return false;
}

function unique(values) {
  return [...new Set(values)];
}
