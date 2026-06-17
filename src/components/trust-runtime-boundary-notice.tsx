import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";

type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "membership" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextLabel = {
  disclaimer: "風險聲明",
  membership: "會員內容",
  methodology: "方法說明",
  privacy: "隱私權",
  terms: "使用條款",
  weekly: "週報"
} as const;

export function TrustRuntimeBoundaryNotice({ context }: TrustRuntimeBoundaryNoticeProps) {
  const boundaryCopy = getPublicRuntimeBoundaryCopy("trust");

  return (
    <section className="trust-runtime-boundary-notice" aria-label={`${contextLabel[context]} 非投資建議`}>
      <div>
        <p className="eyebrow">{contextLabel[context]}</p>
        <h2>{boundaryCopy.headline}</h2>
        <p>{boundaryCopy.summary}</p>
      </div>
      <article className="active runtime-boundary-copy-card">
        <span>目前狀態</span>
        <strong>{boundaryCopy.currentState}</strong>
        <p>{boundaryCopy.nextStep}</p>
      </article>
      <article className="blocked">
        <span>非投資建議</span>
        <strong>{boundaryCopy.stopLine}</strong>
        <p>所有燈號與文字只作資訊整理、風險辨識與觀察輔助。</p>
      </article>
      <article className="readying">
        <span>尚未啟用</span>
        <strong>{boundaryCopy.blockedState}</strong>
        <p>若資料異常、過期或未完成審核，前台必須清楚顯示降級狀態。</p>
      </article>
    </section>
  );
}
