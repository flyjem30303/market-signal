import { PublicRuntimeStateStrip } from "@/components/public-runtime-state-strip";
import { getPublicRuntimeBoundaryCopy } from "@/lib/public-runtime-boundary-copy";

type TrustRuntimeBoundaryNoticeProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const contextCopy = {
  disclaimer: {
    eyebrow: "風險聲明",
    summary: "本站協助使用者整理市場狀態與風險線索，但不替使用者做投資決策，也不承諾任何投資結果。",
    title: "請把燈號當成觀察線索，不要當成交易指令"
  },
  methodology: {
    eyebrow: "方法說明",
    summary: "本站把市場氣氛、風險熱度、資料品質與下一步觀察整理成固定閱讀流程，協助使用者降低資訊過載。",
    title: "方法頁說明如何閱讀燈號、成因與資料狀態"
  },
  privacy: {
    eyebrow: "隱私與資料說明",
    summary: "公開 Beta 不要求交易帳戶、金融憑證、身分證字號、信用卡資料或第三方服務密鑰。",
    title: "公開頁可以直接瀏覽，不需要提供敏感資料"
  },
  terms: {
    eyebrow: "使用條款",
    summary: "公開 Beta 內容用於市場資訊整理、風險辨識與產品體驗驗證，不提供個別買賣建議。",
    title: "使用本站前，請先理解資訊用途與資料限制"
  },
  weekly: {
    eyebrow: "週報說明",
    summary: "週報整理一週市場狀態與觀察方向，協助回看趨勢，不代表個別投資建議或即時行情。",
    title: "週報是回顧與觀察工具，不是交易建議"
  }
} as const;

export function TrustRuntimeBoundaryNotice({ context }: TrustRuntimeBoundaryNoticeProps) {
  const copy = contextCopy[context];
  const boundaryCopy = getPublicRuntimeBoundaryCopy("trust");

  return (
    <section className="trust-runtime-boundary-notice" aria-label={`${copy.eyebrow}邊界`}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
      </div>
      <PublicRuntimeStateStrip context={context === "weekly" ? "weekly" : "trust"} />
      <article className="active runtime-boundary-copy-card">
        <span>目前資料狀態</span>
        <strong>{boundaryCopy.headline}</strong>
        <p>{boundaryCopy.summary}</p>
        <p>{boundaryCopy.currentState}</p>
      </article>
      <article className="blocked">
        <span>正式資料狀態</span>
        <strong>正式市場資料尚未啟用</strong>
        <p>正式資料、完整覆蓋率與正式分數通過前，所有公開頁都只作為示範資料閱讀與產品測試。</p>
      </article>
      <article className="readying">
        <span>下一步</span>
        <strong>確認資料來源、更新時間與風險聲明</strong>
        <p>{boundaryCopy.nextStep}</p>
        <p>所有內容皆為非投資建議，正式上線前仍需通過資料來源、覆蓋率與公開聲明檢查。</p>
      </article>
    </section>
  );
}
