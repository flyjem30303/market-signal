type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    title: "先確認這不是投資建議",
    body: "本頁說明燈號與風險提示的使用限制，避免使用者把市場資訊整理誤認成個別投資建議。",
    next: "閱讀完後，請回到方法說明確認分數如何產生，再回首頁查看市場狀態。"
  },
  methodology: {
    title: "先看燈號如何被整理",
    body: "方法頁說明燈號、風險分數與資料狀態的閱讀方式，讓使用者知道每個數字的限制。",
    next: "資料狀態、來源品質與風險聲明都要一起看，避免只憑單一分數做判斷。"
  },
  privacy: {
    title: "Phase 1 不做會員資料追蹤",
    body: "公開版不提供登入、watchlist 或自訂警示，因此不會儲存會員個人化追蹤資料。",
    next: "未來會員功能上線前，會重新補齊資料使用、通知與刪除機制。"
  },
  terms: {
    title: "使用前請理解網站定位",
    body: "本網站是市場資訊整理與風險辨識工具，不是下單工具，也不提供保證報酬。",
    next: "使用者應自行確認資料時間、來源限制與個人風險承受度。"
  }
} satisfies Record<PublicRouteReadingContractProps["context"], { body: string; next: string; title: string }>;

const steps = [
  ["先看狀態", "確認燈號顏色、分數與資料更新時間。"],
  ["再看原因", "閱讀風險來源、資料邊界與方法限制。"],
  ["最後判斷", "把燈號當成觀察輔助，而不是直接買賣指令。"]
] as const;

export function PublicRouteReadingContract({ context }: PublicRouteReadingContractProps) {
  const item = copy[context];

  return (
    <section className="public-route-reading-contract" aria-label="閱讀說明">
      <div className="public-route-reading-contract__intro">
        <p className="eyebrow">閱讀說明</p>
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
