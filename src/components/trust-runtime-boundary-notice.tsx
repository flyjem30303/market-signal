import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";

type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "Legal Boundary",
    summary:
      "This site is a mock-only decision-support product surface. It may show signal flow, 資料新鮮度 metadata, partial coverage, model limitation, and risk disclosure, but 不構成投資建議.",
    title: "投資與資料限制：目前仍是 mock-only"
  },
  methodology: {
    eyebrow: "Method Boundary",
    summary:
      "The current methodology explains how the product reads signals. It does not validate forecasts, complete coverage, real scoring, or personalized recommendations.",
    title: "方法說明：mock 分數不等於正式模型結論"
  },
  privacy: {
    eyebrow: "Privacy Boundary",
    summary:
      "Runtime pages keep the public experience in mock mode. Do not enter secrets here; raw market payloads and row payloads are not shown on public pages.",
    title: "隱私與資料邊界：不因 mock 展示啟用真實資料線"
  },
  terms: {
    eyebrow: "Terms Boundary",
    summary:
      "Use the site as an informational mock Beta. Signals, scores, rankings, 資料新鮮度, and summaries can be stale, incomplete, delayed, unavailable, or wrong.",
    title: "使用條款：公開資訊仍受 mock-only 邊界限制"
  },
  weekly: {
    eyebrow: "Weekly Boundary",
    summary:
      "Weekly summaries are product-flow readings. They do not prove live market freshness, complete row coverage, real score approval, or investment advice.",
    title: "週報邊界：目前不是即時或完整市場資料"
  }
} as const;

export function TrustRuntimeBoundaryNotice({ context }: TrustRuntimeBoundaryNoticeProps) {
  const copy = contextCopy[context];
  const readiness = getRuntimeReadinessSummary();
  const runtimeInterpretation = getRuntimeInterpretationSummary();
  const sourceDepth = getSourceDepthBlockerSummary();
  const boundaryCopy = getPublicRuntimeBoundaryCopy("trust");

  return (
    <section className="trust-runtime-boundary-notice" aria-label={`${copy.eyebrow} notice`}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
      </div>
      <PublicRuntimeStateStrip context={context === "weekly" ? "weekly" : "trust"} />
      <article className="active runtime-boundary-copy-card">
        <span>Shared runtime boundary</span>
        <strong>{boundaryCopy.headline}</strong>
        <p>{boundaryCopy.summary}</p>
        <p>{boundaryCopy.currentState}</p>
      </article>
      <article className="readying">
        <span>Runtime guard summary</span>
        <strong>{readiness.score}%</strong>
        <p>{readiness.status}</p>
      </article>
      <article className="blocked">
        <span>Source and score boundary</span>
        <strong>{sourceDepth.sourceDepthState}</strong>
        <p>Current score source: {sourceDepth.scoreSource === "mock" ? "mock" : sourceDepth.scoreSource}</p>
        <p>
          This state keeps the experience mock-only. Source rights, model credibility, data quality, and public-claim
          gates must pass before real-score wording can appear. 不得把 mock 訊號說成真實資料、完整覆蓋率或正式投資建議.
        </p>
      </article>
      <article className="blocked">
        <span>Promotion stop line</span>
        <strong>publicDataSource=mock; scoreSource=mock</strong>
        <p>{runtimeInterpretation.stopLine}</p>
      </article>
      <article className="readying">
        <span>PM runtime route</span>
        <strong>{runtimeInterpretation.decision}</strong>
        <p>
          mock runtime hardening {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / Supabase readonly
          preparation {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}
        </p>
      </article>
    </section>
  );
}
