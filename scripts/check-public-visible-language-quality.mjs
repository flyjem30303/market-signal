import fs from "node:fs";
import { localhostContentHealthChecks, localhostStatusHealthPaths } from "./localhost-health-config.mjs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-public-visible-language-quality.mjs";
const briefingSummaryPath = "src/lib/briefing-market-action-summary.ts";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const coreRuntimeBoundaryRequired = [
  "Runtime",
  "mock",
  "publicDataSource=mock",
  "scoreSource=mock",
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
    required: ["PM project progress", "示範資料", "示範分數", "不是投資建議"]
  },
  {
    path: "/weekly",
    required: [...coreRuntimeBoundaryRequired, "Weekly boundary", "data freshness metadata"]
  },
  {
    path: "/methodology",
    required: [...coreRuntimeBoundaryRequired, "Methodology", "mock scores"]
  },
  {
    path: "/disclaimer",
    required: [...coreRuntimeBoundaryRequired, "Investment and data limits", "not investment advice", "data freshness metadata"]
  },
  {
    path: "/terms",
    required: [...coreRuntimeBoundaryRequired, "Terms of use", "mock-only", "data freshness metadata"]
  },
  {
    path: "/privacy",
    required: [...coreRuntimeBoundaryRequired, "Privacy and data boundary", "mock", "raw market payloads"]
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
const sourceReadabilityTargets = [
  {
    path: briefingSummaryPath,
    required: [
      "市場晨報：",
      "示範資料",
      "示範分數",
      "不構成投資建議",
      "決策輔助脈絡"
    ]
  }
];

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
const sourceReadability = sourceReadabilityTargets.map((target) => {
  const source = fs.readFileSync(target.path, "utf8");
  const markerHits = findMojibakeMarkers(source);
  const missing = target.required.filter((phrase) => !source.includes(phrase));

  return {
    markerHits,
    missing,
    pass: markerHits.length === 0 && missing.length === 0,
    path: target.path
  };
});
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
      checkerSource.includes('"Investment and data limits"') &&
      checkerSource.includes('"Terms of use"') &&
      checkerSource.includes('"Privacy and data boundary"')
  },
  {
    check: "checker source avoids private-use mojibake literals",
    pass: !hasPrivateUseCodePoint(checkerSource) && checkerSource.includes("findMojibakeMarkers")
  },
  {
    check: "aligns with localhost health paths",
    pass: checkerSource.includes("localhostStatusHealthPaths") && checkerSource.includes("localhostContentHealthChecks")
  },
  {
    check: "guards briefing action summary helper",
    pass: checkerSource.includes(briefingSummaryPath) && checkerSource.includes("sourceReadabilityTargets")
  }
];

const failed = results.filter((result) => !result.pass);
const registrationFailed = registration.filter((result) => !result.pass);
const routeAlignmentFailed = routeAlignment.filter((result) => !result.pass);
const selfContractFailed = selfContract.filter((result) => !result.pass);
const sourceReadabilityFailed = sourceReadability.filter((result) => !result.pass);

console.log(
  JSON.stringify(
    {
      registration,
      results,
      routeAlignment,
      selfContract,
      sourceReadability,
      status:
        failed.length === 0 &&
        registrationFailed.length === 0 &&
        routeAlignmentFailed.length === 0 &&
        selfContractFailed.length === 0 &&
        sourceReadabilityFailed.length === 0
          ? "ok"
          : "blocked"
    },
    null,
    2
  )
);

if (
  failed.length > 0 ||
  registrationFailed.length > 0 ||
  routeAlignmentFailed.length > 0 ||
  selfContractFailed.length > 0 ||
  sourceReadabilityFailed.length > 0
) {
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
  if (
    /(?:\u5697|\u929d|\u876d|\u619f|\u7485|\u9788|\u64a3|\u95ae|\u7625|\u6468|\u7508|\u96ff|\u8e50|\u8e53){2,}/u.test(
      text
    )
  ) {
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

function unique(values) {
  return [...new Set(values)];
}
