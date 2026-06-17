type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    title: "先理解風險，再使用燈號",
    body: "本網站提供市場資訊整理與風險辨識，不提供買賣建議、保證報酬或個人化投資決策。",
    next: "閱讀燈號時，請同時確認資料來源、更新時間與頁面上的風險聲明。"
  },
  methodology: {
    title: "燈號是觀察順序，不是交易指令",
    body: "方法頁說明分數、風險與資料品質如何協助使用者理解市場狀態。",
    next: "若資料狀態顯示示範、延遲或不可用，應先停止用分數做判斷。"
  },
  privacy: {
    title: "目前不收集會員追蹤資料",
    body: "公開版不提供登入、付款、watchlist 儲存或個人化警示，因此不需要處理敏感投資偏好資料。",
    next: "未來若加入會員功能，會另行揭露資料用途、保存方式與刪除流程。"
  },
  terms: {
    title: "使用本網站前，請理解資訊用途",
    body: "本網站內容用於市場觀察與資訊整理，不應被視為任何金融商品的買賣建議。",
    next: "若不同意資料延遲、示範資料或非投資建議邊界，請停止使用本網站。"
  }
} satisfies Record<PublicRouteReadingContractProps["context"], { body: string; next: string; title: string }>;

const steps = [
  ["看燈號", "先用紅、黃、綠理解市場狀態。"],
  ["看原因", "確認分數背後的趨勢、風險與資料品質。"],
  ["看時間", "確認資料更新時間與是否仍為示範資料。"],
  ["看風險", "把風險提示放在分數之前閱讀。"],
  ["看邊界", "不要把燈號視為個別買賣建議。"],
  ["看下一步", "回到市場摘要或標的頁建立觀察順序。"]
] as const;

export function PublicRouteReadingContract({ context }: PublicRouteReadingContractProps) {
  const item = copy[context];

  return (
    <section className="public-route-reading-contract" aria-label="閱讀方式說明">
      <div className="public-route-reading-contract__intro">
        <p className="eyebrow">閱讀方式</p>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        <p>{item.next}</p>
      </div>
      <div className="public-route-reading-contract__steps" aria-label="閱讀順序">
        {steps.map(([title, body]) => (
          <article key={title}>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
