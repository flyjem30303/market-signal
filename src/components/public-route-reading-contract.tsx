type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    title: "公開頁閱讀流程：先確認這不是投資建議",
    body: "本頁說明燈號、風險提醒與資料邊界的使用限制，避免使用者把市場資訊整理誤認成個別投資建議。",
    next: "六個閱讀檢查點都看完後，再決定要關注、加強觀察或等待更多資料。"
  },
  methodology: {
    title: "公開頁閱讀流程：先看燈號如何被整理",
    body: "方法頁說明市場狀態、原因、更新時間、風險提醒與資料邊界，讓使用者知道每個數字的限制。",
    next: "六個閱讀檢查點都看完後，再決定要關注、加強觀察或等待更多資料。"
  },
  privacy: {
    title: "公開頁閱讀流程：目前不做會員資料追蹤",
    body: "公開免費版不提供登入、watchlist 或自訂警示，因此不會儲存會員個人化追蹤資料。",
    next: "下一階段會員功能上線前，會重新補齊資料使用、通知與刪除機制。"
  },
  terms: {
    title: "公開頁閱讀流程：使用前請理解網站定位",
    body: "本網站是市場資訊整理與風險辨識工具，不是下單工具，也不提供保證報酬。",
    next: "六個閱讀檢查點都看完後，再決定要關注、加強觀察或等待更多資料。"
  }
} satisfies Record<PublicRouteReadingContractProps["context"], { body: string; next: string; title: string }>;

const steps = [
  ["市場狀態", "先確認燈號顏色與目前市場氣氛。"],
  ["原因", "再閱讀主要成因與指標變化。"],
  ["更新時間", "確認資料更新時間與是否仍在示範資料模式。"],
  ["風險提醒", "理解風險來源，不把單一分數當成完整判斷。"],
  ["資料邊界", "確認資料來源、延遲與正式資料是否啟用。"],
  ["下一步觀察", "最後決定要關注、加強觀察或等待更多資料。"]
] as const;

export function PublicRouteReadingContract({ context }: PublicRouteReadingContractProps) {
  const item = copy[context];

  return (
    <section className="public-route-reading-contract" aria-label="閱讀說明">
      <div className="public-route-reading-contract__intro">
        <p className="eyebrow">六個閱讀檢查點</p>
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
