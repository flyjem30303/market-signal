import fs from "node:fs";

const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [cssPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const css = read(cssPath);
const runtimeStart = css.indexOf(".stock-runtime-at-a-glance {");
const runtimeEnd = css.indexOf(".twii-mock-disclosure-status", runtimeStart);
const scoreStart = css.indexOf(".score-grid,");
const scoreEnd = css.indexOf(".content-grid {", scoreStart);
const scoreCardStart = css.indexOf(".score-card {");
const scoreCardEnd = css.indexOf(".score-source-note", scoreCardStart);
const runtimeCss = runtimeStart >= 0 && runtimeEnd > runtimeStart ? css.slice(runtimeStart, runtimeEnd) : "";
const scoreCss = scoreStart >= 0 && scoreEnd > scoreStart ? css.slice(scoreStart, scoreEnd) : "";
const scoreCardCss = scoreCardStart >= 0 && scoreCardEnd > scoreCardStart ? css.slice(scoreCardStart, scoreCardEnd) : "";

const required = [
  ["runtimeCss", "grid-template-columns: minmax(300px, 1.18fr) repeat(auto-fit, minmax(160px, 0.52fr))"],
  ["runtimeCss", ".stock-runtime-at-a-glance > div:first-child"],
  ["runtimeCss", "border-right: 1px solid rgba(15, 118, 110, 0.14)"],
  ["runtimeCss", "background: #fbfdfb"],
  ["runtimeCss", ".stock-runtime-at-a-glance article.active"],
  ["runtimeCss", "border-color: rgba(15, 118, 110, 0.3)"],
  ["runtimeCss", "overflow-wrap: anywhere"],
  ["scoreCss", ".score-grid > .score-card:nth-child(-n + 2)"],
  ["scoreCss", ".score-grid > .panel:not(.score-card)"],
  ["scoreCardCss", "min-height: 176px"],
  ["scoreCardCss", ".score-card > div:last-child"],
  [packagePath, "\"check:stock-visual-hierarchy\""],
  [reviewGatePath, "scripts/check-stock-visual-hierarchy.mjs"]
];

const forbidden = [
  ["runtimeCss", "grid-template-columns: minmax(280px, 1.05fr) repeat(auto-fit, minmax(150px, 0.5fr))"],
  ["runtimeCss", "border-radius: 16px"],
  ["runtimeCss", "letter-spacing: -"],
  ["runtimeCss", "font-size: clamp("],
  ["scoreCss", "grid-template-columns: repeat(4, minmax(0, 1fr));\n  margin-bottom: 16px;\n}\n\n.content-grid"],
  ["scoreCardCss", "border-radius: 16px"],
  ["scoreCardCss", "font-size: clamp("]
];

const sources = new Map([
  ["runtimeCss", runtimeCss],
  ["scoreCss", scoreCss],
  ["scoreCardCss", scoreCardCss],
  ...files
]);

const missing = required.filter(([file, phrase]) => !source(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => source(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (runtimeStart < 0 || runtimeEnd < 0 || runtimeEnd <= runtimeStart) {
  missing.push(`${cssPath}: stock runtime hierarchy range`);
}

if (scoreStart < 0 || scoreEnd < 0 || scoreEnd <= scoreStart) {
  missing.push(`${cssPath}: score grid hierarchy range`);
}

if (scoreCardStart < 0 || scoreCardEnd < 0 || scoreCardEnd <= scoreCardStart) {
  missing.push(`${cssPath}: score card hierarchy range`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}

function source(file) {
  return sources.get(file) ?? "";
}
