import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getRuntimeInterpretationSummary } from "@/lib/runtime-interpretation";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";
import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";

type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "Legal Runtime Boundary",
    title: "免責聲明：目前仍是 mock-only 判讀",
    summary:
      "本頁把投資責任、資料限制與 runtime 邊界說清楚。網站現在提供的是產品體驗與決策輔助展示，不是投資建議，也不是即時或完整市場資料。"
  },
  methodology: {
    eyebrow: "Method Runtime Boundary",
    title: "方法論目前用 mock 資料展示評分邏輯",
    summary:
      "方法論頁說明指標設計、分數來源與未來資料切換原則。正式啟用真實分數前，仍必須通過資料來源、欄位品質與模型可信度檢查。"
  },
  privacy: {
    eyebrow: "Privacy Runtime Boundary",
    title: "隱私權頁目前只說明低風險資料使用",
    summary:
      "目前網站不要求登入，也不收集交易帳戶或個人投資部位。後續若加入分析工具、聯絡表單或會員功能，會先更新告知範圍與使用目的。"
  },
  terms: {
    eyebrow: "Terms Runtime Boundary",
    title: "使用條款目前鎖定展示型服務邊界",
    summary:
      "條款頁說明使用者可以如何閱讀、測試與分享本服務。正式接入真實資料或收費功能前，服務內容、責任範圍與使用限制都會再審核。"
  },
  weekly: {
    eyebrow: "Weekly Runtime Boundary",
    title: "週報目前仍是 mock-only 市場節奏展示",
    summary:
      "週報用來展示市場健康度、風險升溫與族群節奏的閱讀方式。它不代表真實行情、即時訊號或可直接下單的投資建議。"
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
        <p>Freshness metadata only explains data recency; it does not make mock scores real.</p>
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
