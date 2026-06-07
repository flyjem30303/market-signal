import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scanRoots = ["src/app", "src/components"];
const excludedPathParts = [
  `${path.sep}api${path.sep}`,
  `${path.sep}internal${path.sep}`
];
const publicFirstScreenFiles = new Set([
  "src/app/briefing/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/components/dashboard-shell.tsx",
  "src/app/layout.tsx",
  "src/components/site-nav.tsx"
]);
const forbiddenSourceTokens = [
  "@supabase/supabase-js",
  "createClient(",
  ".from(",
  "fetch(",
  "scoreSource=real approved",
  "publicDataSource=supabase approved"
];
const requiredReportSafety = {
  connectionAttempted: false,
  ingestionStarted: false,
  publicDataSource: "mock",
  rawPayloadPrinted: false,
  scoreSource: "mock",
  secretsPrinted: false,
  sqlExecuted: false,
  supabaseWritesEnabled: false
};
const internalTermRules = [
  { term: "PM", severity: "medium", reason: "public copy reads like internal coordination" },
  { term: "Engineering review", severity: "medium", reason: "engineering workflow leaks into public reading flow" },
  { term: "CEO", severity: "medium", reason: "executive workflow may distract public readers" },
  { term: "Chairman", severity: "medium", reason: "role-governance label may be non-public" },
  { term: "runtime hardening", severity: "high", reason: "implementation status phrasing is too internal" },
  { term: "runtime", severity: "medium", reason: "technical runtime term needs user-facing framing" },
  { term: "readiness", severity: "medium", reason: "project-gate term needs public translation" },
  { term: "gate", severity: "medium", reason: "governance term needs public translation" },
  { term: "blocker", severity: "medium", reason: "project status term needs public translation" },
  { term: "row coverage", severity: "high", reason: "data QA term is too internal for visible public copy" },
  { term: "Supabase", severity: "high", reason: "vendor/runtime detail should appear only as a clear boundary disclosure" },
  { term: "scoreSource", severity: "high", reason: "machine state token should be explained in public language" },
  { term: "publicDataSource", severity: "high", reason: "machine state token should be explained in public language" },
  { term: "raw market", severity: "high", reason: "raw data wording needs careful public boundary" },
  { term: "dry run", severity: "medium", reason: "test-run phrasing is too internal" },
  { term: "staging", severity: "high", reason: "data pipeline term should not be public-facing" },
  { term: "schema", severity: "medium", reason: "database shape term is too internal" },
  { term: "review queue", severity: "medium", reason: "internal workflow term may confuse readers" }
];
const boundaryTriggerTerms = [
  "投資",
  "模型",
  "分數",
  "訊號",
  "資料來源",
  "score",
  "signal",
  "runtime",
  "Supabase",
  "source"
];
const boundaryRequiredAny = [
  "mock",
  "scoreSource=mock",
  "publicDataSource=mock",
  "模擬",
  "示範資料",
  "示範分數",
  "尚未切換為正式市場資料",
  "尚未接真實資料"
];
const mojibakePatterns = [
  { name: "replacement_or_private_use", pattern: /[\uFFFD\uE000-\uF8FF]/u },
  { name: "c1_control", pattern: /[\u0080-\u009F]/u },
  { name: "ascii_question_run", pattern: /\?{3,}/u },
  { name: "common_mojibake_run", pattern: /(?:嚗|銝|蝭|憟|璅|鞈|撣|閮|瘥|摨|甈|雿|蹐|蹓||){2,}/u }
];

const files = scanRoots.flatMap((directory) => findTsxFiles(path.join(root, directory)))
  .map((absolutePath) => normalizeRelative(absolutePath))
  .filter((file) => !isExcluded(file))
  .sort();

const fileReports = files.map((file) => analyzeFile(file));
const firstScreenCandidates = buildFirstScreenCandidates(fileReports);
const urgentFirstScreenCandidates = firstScreenCandidates.filter((candidate) => candidate.priority !== "P2");
const worklist = buildWorklist(fileReports, firstScreenCandidates);
const topWorklistItem = worklist[0] ?? null;
const report = {
  mode: "a2_public_copy_readability_candidates",
  generatedAt: new Date().toISOString(),
  safety: requiredReportSafety,
  scope: {
    excludedPathParts: ["src/app/api", "src/app/internal"],
    filesScanned: files.length,
    roots: scanRoots
  },
  summary: {
    boundaryInsufficientFiles: fileReports.filter((item) => item.boundary.status === "candidate").length,
    firstScreenCandidates: firstScreenCandidates.length,
    internalTermHits: fileReports.reduce((sum, item) => sum + item.internalTerms.length, 0),
    mojibakeCandidates: fileReports.reduce((sum, item) => sum + item.mojibake.length, 0),
    priorityCounts: countByPriority(firstScreenCandidates),
    publicDataSource: "mock",
    scoreSource: "mock",
    urgentFirstScreenCandidates: urgentFirstScreenCandidates.length
  },
  pmDecisionSupport: {
    nextRecommendedSlice: topWorklistItem?.id ?? "a2-public-copy-stability-watch",
    nextRecommendedPriority: topWorklistItem?.priority ?? "P2",
    nextRecommendedAction:
      topWorklistItem?.nextAction ??
      "Keep public copy stable and patch only launch-blocking readability regressions.",
    topFiles: topWorklistItem?.files ?? [],
    routeReason:
      urgentFirstScreenCandidates.length > 0
        ? "urgent_first_screen_public_copy_candidates_exist"
        : "no_urgent_first_screen_candidates_keep_checker_hardened_and_public_copy_stable"
  },
  candidates: {
    mojibakeOrPrivateUse: fileReports.flatMap((item) => item.mojibake.map((hit) => ({ file: item.file, ...hit }))),
    internalTerms: fileReports.flatMap((item) => item.internalTerms.map((hit) => ({ file: item.file, ...hit }))),
    boundaryInsufficient: fileReports
      .filter((item) => item.boundary.status === "candidate")
      .map((item) => ({ file: item.file, ...item.boundary })),
    firstScreen: firstScreenCandidates
  },
  worklist
};

console.log(JSON.stringify(report, null, 2));

function analyzeFile(file) {
  const absolutePath = path.join(root, file);
  const content = fs.readFileSync(absolutePath, "utf8");
  const lines = content.split(/\r?\n/);
  const visible = extractVisibleStrings(content).join(" ");
  const firstScreen = extractFirstScreenSource(content);
  const firstScreenVisible = extractVisibleStrings(firstScreen).join(" ");
  const mojibake = findMojibake(lines);
  const internalTerms = findInternalTerms(file, visible, firstScreenVisible);
  const forbiddenSourceHits = forbiddenSourceTokens.filter((token) => content.includes(token));
  const boundary = assessBoundary(file, visible, firstScreenVisible);

  return {
    boundary,
    file,
    firstScreenSignal: {
      hasFirstScreenRange: firstScreen.length > 0,
      internalTermHits: internalTerms.filter((hit) => hit.firstScreen).length,
      visibleLength: firstScreenVisible.length
    },
    forbiddenSourceHits,
    internalTerms,
    mojibake,
    visibleStringCount: extractVisibleStrings(content).length
  };
}

function findTsxFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findTsxFiles(absolutePath);
    return entry.isFile() && entry.name.endsWith(".tsx") ? [absolutePath] : [];
  });
}

function normalizeRelative(absolutePath) {
  return path.relative(root, absolutePath).replaceAll(path.sep, "/");
}

function isExcluded(file) {
  const nativeFile = file.replaceAll("/", path.sep);
  return excludedPathParts.some((part) => nativeFile.includes(part));
}

function extractVisibleStrings(content) {
  const strings = [];
  const stringPattern = /(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`)/gsu;
  for (const match of content.matchAll(stringPattern)) {
    const value = match[1] ?? match[2] ?? match[3] ?? "";
    if (isLikelyVisibleText(value)) strings.push(value.replace(/\s+/g, " ").trim());
  }

  const jsxTextPattern = />\s*([^<>{}\n][^<>{}]*)\s*</gu;
  for (const match of content.matchAll(jsxTextPattern)) {
    const value = match[1].replace(/\s+/g, " ").trim();
    if (isLikelyVisibleText(value)) strings.push(value);
  }

  return [...new Set(strings)];
}

function isLikelyVisibleText(value) {
  const text = value.trim();
  if (text.length < 2) return false;
  if (/^[./@#\w-]+$/u.test(text) && !/[A-Z][a-z]|\p{Script=Han}/u.test(text)) return false;
  if (/^(className|eventName|payload|href|key|type|button|section|article)$/u.test(text)) return false;
  return /[\p{Script=Han}A-Za-z]/u.test(text);
}

function extractFirstScreenSource(content) {
  const markers = [
    "<section className=\"hero",
    "function HomeProductOverview",
    "function StockPageFollowUpLinks",
    "<nav className=\"site-nav",
    "<header"
  ];
  const starts = markers.map((marker) => content.indexOf(marker)).filter((index) => index >= 0);
  if (starts.length === 0) return "";
  const start = Math.min(...starts);
  const afterStart = content.slice(start);
  const nextSection = afterStart.indexOf("\n      <section", 1);
  const nextFunction = afterStart.indexOf("\nfunction ", 1);
  const candidates = [nextSection, nextFunction].filter((index) => index > 0);
  const end = candidates.length ? start + Math.min(...candidates) : Math.min(content.length, start + 5000);
  return content.slice(start, end);
}

function findMojibake(lines) {
  const hits = [];
  lines.forEach((line, index) => {
    for (const rule of mojibakePatterns) {
      if (rule.pattern.test(line)) {
        hits.push({
          line: index + 1,
          pattern: rule.name,
          severity: rule.name === "ascii_question_run" ? "medium" : "high",
          snippet: compact(line)
        });
      }
    }
  });
  return hits.slice(0, 40);
}

function findInternalTerms(file, visible, firstScreenVisible) {
  return internalTermRules.flatMap((rule) => {
    const pattern = new RegExp(escapeRegExp(rule.term), "iu");
    if (!pattern.test(visible)) return [];

    return [{
      firstScreen: pattern.test(firstScreenVisible),
      reason: rule.reason,
      severity: rule.severity,
      term: rule.term
    }];
  });
}

function assessBoundary(file, visible, firstScreenVisible) {
  const isPublicRoutePage = file.startsWith("src/app/") && file.endsWith("/page.tsx");
  const isFirstScreenFile = publicFirstScreenFiles.has(file);
  const shouldCheck = isPublicRoutePage || isFirstScreenFile;
  const hasTrigger = boundaryTriggerTerms.some((term) => visible.toLowerCase().includes(term.toLowerCase()));
  const hasBoundary = boundaryRequiredAny.some((term) => visible.toLowerCase().includes(term.toLowerCase()));
  const firstScreenHasBoundary = boundaryRequiredAny.some((term) => firstScreenVisible.toLowerCase().includes(term.toLowerCase()));

  if (!shouldCheck || !hasTrigger) {
    return { status: "not_applicable" };
  }

  if (hasBoundary && (firstScreenHasBoundary || !isFirstScreenFile)) {
    return { firstScreenHasBoundary, hasBoundary, status: "covered" };
  }

  return {
    firstScreenHasBoundary,
    hasBoundary,
    reason: "visible investment/model/signal copy should carry a nearby mock or scoreSource boundary",
    severity: isFirstScreenFile ? "high" : "medium",
    status: "candidate"
  };
}

function buildFirstScreenCandidates(reports) {
  return reports
    .filter((report) => publicFirstScreenFiles.has(report.file))
    .map((report) => {
      const reasons = [];
      if (report.mojibake.length > 0) reasons.push("mojibake/private-use candidates");
      if (report.firstScreenSignal.internalTermHits > 0) reasons.push("internal terms appear in first screen");
      if (report.boundary.status === "candidate") reasons.push("mock/scoreSource boundary may be too far from first screen");
      if (report.file.includes("briefing")) reasons.push("briefing non-executive sections shape daily first impression");
      if (report.file.includes("weekly")) reasons.push("weekly page should read like public weekly report, not runtime status");
      if (report.file.includes("dashboard-shell")) reasons.push("home and stock first screen are the highest-traffic copy surfaces");

      return {
        file: report.file,
        priority: priorityFor(report),
        reasons: reasons.length ? reasons : ["public first impression surface"],
        suggestedSlice: suggestedSliceFor(report.file)
      };
    })
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}

function buildWorklist(reports, firstScreenCandidates) {
  const items = [];
  const checkerIssues = reports.filter((report) => report.file.includes("check-public"));
  const highMojibake = reports.filter((report) => report.mojibake.some((hit) => hit.severity === "high"));
  const boundaryCandidates = reports.filter((report) => report.boundary.status === "candidate");
  const firstScreenHigh = firstScreenCandidates.filter((candidate) => candidate.priority !== "P2");

  if (checkerIssues.length > 0 || highMojibake.length > 0) {
    items.push({
      id: "a2-mojibake-candidate-triage",
      priority: "P0",
      files: highMojibake.slice(0, 12).map((item) => item.file),
      nextAction: "Review high-confidence private-use/replacement candidates and separate terminal-encoding false positives from actual source text."
    });
  }

  if (boundaryCandidates.length > 0) {
    items.push({
      id: "a2-public-boundary-nearby-copy",
      priority: "P1",
      files: boundaryCandidates.slice(0, 12).map((item) => item.file),
      nextAction: "Move or add plain-language mock and score-source boundary copy near public investment/model claims."
    });
  }

  if (firstScreenHigh.length > 0) {
    items.push({
      id: "a2-first-screen-readability",
      priority: "P1",
      files: firstScreenHigh.map((item) => item.file),
      nextAction: "Rewrite only visible public copy in first-screen or immediate follow-up sections; keep runtime state mock."
    });
  }

  items.push({
    id: "a2-checker-hardening",
    priority: "P1",
    files: [
      "scripts/report-a2-public-copy-readability-candidates.mjs",
      "scripts/check-a2-public-copy-readability-candidates.mjs"
    ],
    nextAction: "Keep this local-only scanner independent from localhost, SQL, Supabase, and raw market payloads."
  });

  return items;
}

function priorityFor(report) {
  if (report.mojibake.length > 0 || report.boundary.status === "candidate") return "P0";
  if (report.firstScreenSignal.internalTermHits > 0) return "P1";
  return "P2";
}

function priorityRank(priority) {
  return { P0: 0, P1: 1, P2: 2 }[priority] ?? 9;
}

function countByPriority(candidates) {
  return candidates.reduce(
    (counts, candidate) => {
      counts[candidate.priority] = (counts[candidate.priority] ?? 0) + 1;
      return counts;
    },
    { P0: 0, P1: 0, P2: 0 }
  );
}

function suggestedSliceFor(file) {
  if (file.includes("briefing")) return "copy-only pass on non-executive summary sections: runtime plan, reading bridge, model boundary, next steps";
  if (file.includes("disclaimer")) return "verify first-screen disclaimer states non-advice, mock-data, and score-boundary in plain language";
  if (file.includes("methodology")) return "verify first-screen methodology explains limits before technical model details";
  if (file.includes("privacy")) return "verify first-screen privacy copy keeps data-collection and mock-data boundaries readable";
  if (file.includes("terms")) return "verify first-screen terms copy states beta limitations and non-trading-service boundary";
  if (file.includes("weekly")) return "copy-only pass on hero, weekly runtime/action summary, cadence, and next-step links";
  if (file.includes("dashboard-shell")) return "copy-only pass on home hero, quick start, decision compass, and stock follow-up links";
  if (file.includes("layout")) return "verify site-wide metadata, footer trust copy, and nav labels";
  return "verify public nav labels and active-route wording";
}

function compact(line) {
  return line.trim().replace(/\s+/g, " ").slice(0, 180);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
