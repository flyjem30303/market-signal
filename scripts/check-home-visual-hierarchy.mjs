import fs from "node:fs";

const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [cssPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const css = read(cssPath);
const start = css.indexOf(".home-decision-strip {");
const end = css.indexOf(".home-market-breadth", start);
const hierarchyCss = start >= 0 && end > start ? css.slice(start, end) : "";

const required = [
  [cssPath, ".home-decision-strip"],
  [cssPath, "grid-template-columns: minmax(280px, 1.25fr) minmax(220px, 1.05fr) repeat(2, minmax(0, 0.82fr))"],
  [cssPath, ".home-decision-strip > div"],
  [cssPath, "border-right: 1px solid rgba(15, 118, 110, 0.14)"],
  [cssPath, ".home-decision-strip a:first-of-type"],
  [cssPath, "background: #eff9f5"],
  [cssPath, ".home-reading-route"],
  [cssPath, "background: #fcfcfb"],
  [cssPath, "box-shadow: var(--shadow-soft)"],
  [cssPath, "overflow-wrap: anywhere"],
  [packagePath, "\"check:home-visual-hierarchy\""],
  [reviewGatePath, "scripts/check-home-visual-hierarchy.mjs"]
];

const forbidden = [
  ["hierarchyCss", ".home-decision-strip {\n  display: grid;\n  grid-template-columns: minmax(280px, 1.4fr) repeat(3, minmax(0, 1fr))"],
  ["hierarchyCss", "border-radius: 16px"],
  ["hierarchyCss", "letter-spacing: -"],
  ["hierarchyCss", "font-size: clamp("]
];

const sources = new Map([["hierarchyCss", hierarchyCss], ...files]);
const missing = required.filter(([file, phrase]) => !source(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => source(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (start < 0 || end < 0 || end <= start) {
  missing.push(`${cssPath}: home decision hierarchy range`);
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
