import fs from "node:fs";

const files = {
  dashboardShell: "src/components/dashboard-shell.tsx",
  briefing: "src/app/briefing/page.tsx",
  packageJson: "package.json",
  reviewGates: "scripts/check-review-gates.mjs",
  projectStatus: "PROJECT_STATUS.md"
};

function read(path) {
  return fs.readFileSync(path, "utf8");
}

const dashboardShell = read(files.dashboardShell);
const briefing = read(files.briefing);
const packageJson = read(files.packageJson);
const reviewGates = read(files.reviewGates);
const projectStatus = read(files.projectStatus);

const requiredDashboardFragments = [
  "市場總覽",
  "30 秒看懂市場狀態",
  "3 分鐘決定下一步觀察",
  "燈號代表風險與趨勢的整理，不是買賣建議。",
  "觀察標的",
  "切換指數、ETF 與核心台股"
];

const requiredBriefingFragments = [
  "今日市場簡報",
  "3 分鐘整理市場氣氛與後續觀察重點",
  "先看市場方向，再看風險來源，最後決定是否需要加強觀察。",
  "30 秒重點",
  "下一步",
  "加強觀察",
  "降低風險"
];

const forbiddenFirstScreenFragments = [
  "?",
  "蝘",
  "銵",
  "嚗",
  "瘞",
  "撣",
  "",
  "",
  "",
  "",
  "",
  ""
];

const failures = [];

for (const fragment of requiredDashboardFragments) {
  if (!dashboardShell.includes(fragment)) {
    failures.push(`dashboard first-screen copy missing: ${fragment}`);
  }
}

for (const fragment of requiredBriefingFragments) {
  if (!briefing.includes(fragment)) {
    failures.push(`briefing first-screen copy missing: ${fragment}`);
  }
}

const dashboardFirstScreen = dashboardShell.slice(
  dashboardShell.indexOf('<section className="hero dashboard-hero">'),
  dashboardShell.indexOf("<DataFreshnessStrip")
);

const briefingFirstScreen = briefing.slice(
  briefing.indexOf('<section className="hero briefing-public-summary"'),
  briefing.indexOf("<DataFreshnessStrip")
);

for (const fragment of forbiddenFirstScreenFragments) {
  if (dashboardFirstScreen.includes(fragment)) {
    failures.push(`dashboard first-screen copy still contains garbled fragment: ${fragment}`);
  }
  if (briefingFirstScreen.includes(fragment)) {
    failures.push(`briefing first-screen copy still contains garbled fragment: ${fragment}`);
  }
}

if (!packageJson.includes('"check:public-first-screen-copy-readability"')) {
  failures.push("package.json missing check:public-first-screen-copy-readability");
}

if (!reviewGates.includes("public-first-screen-copy-readability")) {
  failures.push("review gate registry missing public-first-screen-copy-readability");
}

if (!projectStatus.includes("public_first_screen_copy_readability_ready")) {
  failures.push("PROJECT_STATUS missing public_first_screen_copy_readability_ready slice record");
}

console.log(
  JSON.stringify(
    {
      status: failures.length === 0 ? "ok" : "blocked",
      checkedFiles: files,
      failures
    },
    null,
    2
  )
);

process.exit(failures.length === 0 ? 0 : 1);
