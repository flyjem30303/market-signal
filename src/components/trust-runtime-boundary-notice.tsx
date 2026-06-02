import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";

type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "methodology" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "Legal Runtime Boundary",
    title: "免責聲明：目前不是正式投資訊號",
    summary:
      "本網站目前仍以 mock-only runtime 呈現，內容只供產品驗證與研究參考，不構成投資建議、交易建議或正式資料保證。"
  },
  methodology: {
    eyebrow: "Method Runtime Boundary",
    title: "方法論目前仍停在 mock-only 驗證階段",
    summary:
      "方法論頁說明模型設計與閱讀方式，但目前尚未完成來源深度、權利、回測與真實資料接軌，因此不能把分數視為正式市場訊號。"
  },
  weekly: {
    eyebrow: "Weekly Runtime Boundary",
    title: "週報目前仍是 mock-only 閱讀摘要",
    summary:
      "週報可以協助整理本週觀察與風險方向，但目前尚未完成真實資料接軌、來源深度與 scoreSource=real 核准，不能視為正式投資報告。"
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
        <span>Visible now</span>
        <strong>{boundaryCopy.headline}</strong>
        <p>{boundaryCopy.summary}</p>
        <p>{boundaryCopy.currentState}</p>
      </article>
      <article className="readying">
        <span>Runtime readiness</span>
        <strong>{readiness.score}%</strong>
        <p>{readiness.status}</p>
      </article>
      <article className="blocked">
        <span>Source depth</span>
        <strong>{sourceDepth.sourceDepthState}</strong>
        <p>scoreSource: {sourceDepth.scoreSource}</p>
      </article>
      <article className="blocked">
        <span>Stop line</span>
        <strong>no real score</strong>
        <p>{runtimeInterpretation.stopLine}</p>
      </article>
      <article className="readying">
        <span>CEO track</span>
        <strong>{runtimeInterpretation.decision}</strong>
        <p>
          Runtime {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / readonly prep{" "}
          {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}.
        </p>
      </article>
    </section>
  );
}
