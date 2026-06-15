import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";

type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "membership" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "風險聲明",
    title: "投資與資料使用限制",
    summary: "燈號只整理市場狀態，不是投資建議，也不是正式即時行情。"
  },
  membership: {
    eyebrow: "會員邊界",
    title: "會員功能尚未開放",
    summary: "會員深度解讀、自選追蹤與警示功能仍是後續規劃，公開版先保留清楚資料邊界。"
  },
  methodology: {
    eyebrow: "方法邊界",
    title: "示範分數不是正式模型結論",
    summary: "目前分數用於說明產品流程，不代表正式模型結論或專業投資判斷。"
  },
  privacy: {
    eyebrow: "隱私邊界",
    title: "示範資料不等於正式資料啟用",
    summary: "公開 Beta 不需要輸入個人資料，也沒有因展示示範資料而啟用正式資料來源。"
  },
  terms: {
    eyebrow: "使用條款",
    title: "公開資訊仍是示範狀態",
    summary: "公開資訊仍以示範資料呈現；下載、轉載、再散布與正式資料使用需另行確認。"
  },
  weekly: {
    eyebrow: "週報邊界",
    title: "週報不是即時或完整市場資料",
    summary: "週報是延遲與示範狀態下的閱讀流程，不代表完整或即時市場資料。"
  }
} as const;

export function TrustRuntimeBoundaryNotice({ context }: TrustRuntimeBoundaryNoticeProps) {
  const copy = contextCopy[context];
  const boundaryCopy = getPublicRuntimeBoundaryCopy("trust");

  return (
    <section className="trust-runtime-boundary-notice" aria-label={`${copy.eyebrow}資料邊界`}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
      </div>
      <PublicRuntimeStateStrip context={context === "weekly" ? "weekly" : "trust"} />
      <article className="active runtime-boundary-copy-card">
        <span>目前狀態</span>
        <strong>{boundaryCopy.headline}</strong>
        <p>{boundaryCopy.summary}</p>
        <p>{boundaryCopy.currentState}</p>
      </article>
      <article className="blocked">
        <span>資料限制</span>
        <strong>不是即時或完整市場資料</strong>
        <p>目前不宣稱即時、完整或來源授權完成；正式資料上線前，使用者應把內容視為閱讀流程示範。</p>
      </article>
      <article className="readying">
        <span>模型限制</span>
        <strong>模型仍在示範階段</strong>
        <p>{boundaryCopy.nextStep}</p>
        <p>燈號與分數只做觀察輔助，不是投資建議。</p>
      </article>
    </section>
  );
}
