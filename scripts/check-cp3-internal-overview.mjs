import fs from "node:fs";

const pagePath = "src/app/internal/page.tsx";
const cssPath = "src/app/globals.css";

const page = fs.readFileSync(pagePath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const requiredPagePhrases = [
  "CP3 Operating State",
  "目前採低治理、高產出密度推進",
  "Option A remains active",
  "Supabase",
  "SQL",
  "real market data",
  "authorization packets",
  "public claims",
  "Score source",
  "mock",
  "Source depth",
  "not_ready",
  "Active route",
  "Option A",
  "Public claim",
  "blocked",
  "優先推進可見的內部工具與狀態呈現",
  "保持 scoreSource=mock 與 public-ineligible"
];

const requiredCssPhrases = [
  ".internal-status-panel",
  ".internal-status-grid",
  ".internal-status-card",
  ".internal-next-actions",
  ".internal-status-card.active",
  ".internal-status-card.hold",
  ".internal-status-card.blocked"
];

const forbiddenPagePhrases = [
  "scoreSource=real",
  "public eligible: true",
  "public_eligible: true",
  "sourceDepthState: \"approved\"",
  "source_depth_state: \"approved\""
];

const missing = [
  ...requiredPagePhrases.filter((phrase) => !page.includes(phrase)).map((phrase) => `${pagePath}: ${phrase}`),
  ...requiredCssPhrases.filter((phrase) => !css.includes(phrase)).map((phrase) => `${cssPath}: ${phrase}`)
];
const forbidden = forbiddenPagePhrases.filter((phrase) => page.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
