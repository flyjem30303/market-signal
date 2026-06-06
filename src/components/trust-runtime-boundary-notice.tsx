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
    eyebrow: "Legal Boundary",
    title: "投資與資料限制：目前仍是 mock-only",
    summary:
      "本網站目前公開內容用於產品流程與訊號閱讀示範，不構成投資建議。真實資料來源、完整覆蓋率、資料新鮮度與真實分數尚未完成公開升級。"
  },
  methodology: {
    eyebrow: "Method Boundary",
    title: "方法說明：mock 分數不等於正式模型結論",
    summary:
      "目前分數與風險方向用於說明閱讀方式。模型可能受資料缺值、延遲、來源限制與覆蓋率不足影響，不能視為預測、保證或買賣依據。"
  },
  privacy: {
    eyebrow: "Privacy Boundary",
    title: "隱私與資料邊界：不因 mock 展示啟用真實資料線",
    summary:
      "公開頁面顯示的 runtime 狀態與資料新鮮度說明，不代表連線 Supabase、寫入資料庫或抓取 raw market data。使用者看到的是已整理的頁面文案與 mock 狀態。"
  },
  terms: {
    eyebrow: "Terms Boundary",
    title: "使用條款：公開資訊仍受 mock-only 邊界限制",
    summary:
      "網站資訊僅供一般研究與產品理解，不構成投資建議。資料新鮮度、缺值、延遲、部分覆蓋或尚未核准狀態都必須揭露；任何真實來源、真實分數或投資用途宣稱都必須等待 PM 接受 gate。"
  },
  weekly: {
    eyebrow: "Weekly Boundary",
    title: "週報邊界：目前不是即時或完整市場資料",
    summary:
      "週報可用來理解市場摘要格式、mock 訊號與待補資料狀態。freshness metadata 只代表狀態說明可讀，不等於真實資料品質或完整覆蓋率已核准。"
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
        <span>目前公開狀態</span>
        <strong>{boundaryCopy.headline}</strong>
        <p>{boundaryCopy.summary}</p>
        <p>{boundaryCopy.currentState}</p>
      </article>
      <article className="readying">
        <span>升級準備度</span>
        <strong>{readiness.score}%</strong>
        <p>{readiness.status}</p>
      </article>
      <article className="blocked">
        <span>資料來源與分數限制</span>
        <strong>{sourceDepth.sourceDepthState}</strong>
        <p>目前 score source: {sourceDepth.scoreSource === "mock" ? "mock" : sourceDepth.scoreSource}</p>
        <p>公開頁不得把 mock 訊號說成真實資料、完整覆蓋率或正式投資建議。</p>
      </article>
      <article className="blocked">
        <span>停止線</span>
        <strong>publicDataSource=mock; scoreSource=mock</strong>
        <p>{runtimeInterpretation.stopLine}</p>
      </article>
      <article className="readying">
        <span>下一個可討論步驟</span>
        <strong>{runtimeInterpretation.decision}</strong>
        <p>
          mock runtime hardening {runtimeInterpretation.laneRatio.mockRuntimeHardening}% / Supabase readonly
          preparation {runtimeInterpretation.laneRatio.supabaseReadonlyPreparation}%. {runtimeInterpretation.blockers[0]}
        </p>
      </article>
    </section>
  );
}
